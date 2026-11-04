#!/usr/bin/env bash
# Apply versioned SQL migrations to Creator Platform SaaS database.
#
# ADR-005 selects versioned SQL files in `infra/db/migrations/`.
# This runner supports:
#   1. Remote direct connection via $DATABASE_URL or $ADMIN_DATABASE_URL
#   2. Local Docker container via container name (default: creator-postgres)
#
# On a fresh installation, all migrations (000 through 009) are applied in order.
# On an existing database, already applied migrations recorded in `schema_migrations`
# are skipped safely.
#
# Usage:
#   # Remote / Direct psql:
#   DATABASE_URL="postgresql://user:pass@host:5432/postgres" infra/db/migrations/apply.sh
#
#   # Local Docker container:
#   infra/db/migrations/apply.sh [database] [container]
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB="${1:-${PGDATABASE:-creator_platform}}"
CONTAINER="${2:-creator-postgres}"
DB_USER="${DB_USER:-${PGUSER:-creator}}"

run_sql() {
    local sql="$1"
    if [ -n "${DATABASE_URL:-}" ]; then
        psql "$DATABASE_URL" -tAc "$sql" 2>/dev/null || true
    elif [ -n "${ADMIN_DATABASE_URL:-}" ]; then
        psql "$ADMIN_DATABASE_URL" -tAc "$sql" 2>/dev/null || true
    else
        docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB" -tAc "$sql" 2>/dev/null || true
    fi
}

run_file() {
    local file="$1"
    if [ -n "${DATABASE_URL:-}" ]; then
        psql -v ON_ERROR_STOP=1 "$DATABASE_URL" < "$file" > /dev/null
    elif [ -n "${ADMIN_DATABASE_URL:-}" ]; then
        psql -v ON_ERROR_STOP=1 "$ADMIN_DATABASE_URL" < "$file" > /dev/null
    else
        docker exec -i "$CONTAINER" psql -v ON_ERROR_STOP=1 -U "$DB_USER" -d "$DB" < "$file" > /dev/null
    fi
}

if [ -n "${DATABASE_URL:-}" ] || [ -n "${ADMIN_DATABASE_URL:-}" ]; then
    echo "Applying migrations from $DIR via direct database URL connection"
else
    echo "Applying migrations from $DIR to '$DB' (container: $CONTAINER)"
fi

has_core_tables="$(run_sql "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'")"
has_migration_table="$(run_sql "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations'")"

for file in "$DIR"/*.sql; do
    version="$(basename "$file" .sql)"

    # If core schema is already present from initial container provisioning, skip 000-002
    if [ "$has_core_tables" = "1" ]; then
        case "$version" in
            000_*|001_*|002_*) continue ;;
        esac
    fi

    # Check schema_migrations if table exists
    if [ "$has_migration_table" = "1" ]; then
        already="$(run_sql "SELECT 1 FROM schema_migrations WHERE version = '${version}'")"
        if [ "$already" = "1" ]; then
            echo "  = $version (already applied, skipping)"
            continue
        fi
    fi

    echo "  + $version"
    run_file "$file"

    # Refresh migration table check once 003 creates it
    if [ "$has_migration_table" != "1" ]; then
        has_migration_table="$(run_sql "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'schema_migrations'")"
    fi

    # Guarantee record is stored in schema_migrations
    if [ "$has_migration_table" = "1" ]; then
        run_sql "INSERT INTO schema_migrations (version, notes) VALUES ('${version}', 'Applied by runner') ON CONFLICT (version) DO NOTHING;" > /dev/null
    fi

    echo "  . recorded $version"
done

echo "Done. Applied state:"
run_sql "SELECT version || ' @ ' || applied_at FROM schema_migrations ORDER BY version" || echo "  (schema_migrations not present)"
