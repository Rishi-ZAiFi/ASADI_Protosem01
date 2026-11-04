"""Contract tests for PostgreSQL migrations in infra/db/migrations.

Validates:
1. Migration files 000-009 exist in sequence.
2. No hardcoded passwords or hardcoded database names in committed migrations.
3. api_user role definition enforces NOBYPASSRLS and NOSUPERUSER.
4. Migration 004 allows empty-table progression without aborting.
5. All user tables have Row-Level Security enabled.
6. All user policies use `current_user_id()`.
7. Migration tracking in schema_migrations is maintained.
"""
from pathlib import Path
import re
import pytest

MIGRATIONS_DIR = Path(__file__).resolve().parents[1] / "infra" / "db" / "migrations"


def test_migrations_directory_exists():
    assert MIGRATIONS_DIR.exists()
    assert MIGRATIONS_DIR.is_dir()


def test_migration_sequence_is_complete():
    expected_migrations = [
        "000_create_api_user.sql",
        "001_enable_extensions.sql",
        "002_core_schema.sql",
        "003_embedding_768_expand.sql",
        "004_embedding_768_contract.sql",
        "005_voice_profile_uniqueness.sql",
        "006_studio_sessions.sql",
        "007_today_plan.sql",
        "008_growth_domain.sql",
        "009_coach_learning.sql",
    ]
    present_files = sorted(f.name for f in MIGRATIONS_DIR.glob("*.sql"))
    assert present_files == expected_migrations


def test_000_does_not_hardcode_password():
    sql = (MIGRATIONS_DIR / "000_create_api_user.sql").read_text()
    # Should not contain hardcoded PASSWORD '...'
    assert "api_password" not in sql
    # Password setting should be decoupled
    assert not re.search(r"CREATE\s+ROLE\s+api_user\s+WITH[^;]*PASSWORD\s+'[^']+'", sql, re.IGNORECASE)


def test_000_enforces_nobypassrls_and_nosuperuser():
    sql = (MIGRATIONS_DIR / "000_create_api_user.sql").read_text()
    assert "NOSUPERUSER" in sql
    assert "NOBYPASSRLS" in sql


def test_000_dynamically_targets_database():
    sql = (MIGRATIONS_DIR / "000_create_api_user.sql").read_text()
    # Should not hardcode creator_platform database
    assert "GRANT CONNECT ON DATABASE creator_platform" not in sql
    assert "current_database()" in sql


def test_004_allows_empty_table_cutover():
    sql = (MIGRATIONS_DIR / "004_embedding_768_contract.sql").read_text()
    # Must guard observed vector dimension check so 0 rows does not abort with width 0
    assert "IF v_total > 0 THEN" in sql
    assert "observed vector width is %, expected 768." in sql


def test_all_user_tables_have_rls_enabled():
    core_tables = [
        "users", "creator_profiles", "voice_profiles", "content_assets",
        "chunks", "ideas", "plan_items", "performance_records",
        "comments", "comment_insights", "lessons", "jobs", "ai_calls"
    ]
    sql_002 = (MIGRATIONS_DIR / "002_core_schema.sql").read_text()
    for table in core_tables:
        pattern = rf"ALTER\s+TABLE\s+{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY"
        assert re.search(pattern, sql_002, re.IGNORECASE), f"Missing RLS for {table} in 002"

    sql_006 = (MIGRATIONS_DIR / "006_studio_sessions.sql").read_text()
    for table in ["studio_sessions", "studio_generations"]:
        pattern = rf"ALTER\s+TABLE\s+{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY"
        assert re.search(pattern, sql_006, re.IGNORECASE), f"Missing RLS for {table} in 006"

    sql_008 = (MIGRATIONS_DIR / "008_growth_domain.sql").read_text()
    for table in ["growth_insights", "experiments"]:
        assert table in sql_008
        assert "ENABLE ROW LEVEL SECURITY" in sql_008

    sql_009 = (MIGRATIONS_DIR / "009_coach_learning.sql").read_text()
    for table in ["coach_goals", "coach_sessions", "coach_feedback", "learning_records"]:
        pattern = rf"ALTER\s+TABLE\s+{table}\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY"
        assert re.search(pattern, sql_009, re.IGNORECASE), f"Missing RLS for {table} in 009"


def test_rls_policies_use_current_user_id():
    for f in MIGRATIONS_DIR.glob("*.sql"):
        sql = f.read_text()
        if "CREATE POLICY" in sql:
            # Policy expressions must use current_user_id()
            assert "current_user_id()" in sql, f"Migration {f.name} defines policies without current_user_id()"


def test_migrations_track_state_in_schema_migrations():
    tracking_migrations = [
        "003_embedding_768_expand.sql",
        "004_embedding_768_contract.sql",
        "005_voice_profile_uniqueness.sql",
        "006_studio_sessions.sql",
        "007_today_plan.sql",
        "008_growth_domain.sql",
        "009_coach_learning.sql",
    ]
    for filename in tracking_migrations:
        sql = (MIGRATIONS_DIR / filename).read_text()
        assert "INSERT INTO schema_migrations" in sql, f"{filename} missing schema_migrations record"
