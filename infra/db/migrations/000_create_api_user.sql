-- Migration 000: Create API application role for RLS enforcement
--
-- Security principles:
-- 1. api_user is a non-superuser, non-owner role.
-- 2. NOBYPASSRLS is mandatory so that PostgreSQL strictly enforces Row Level Security.
-- 3. Password provisioning is decoupled: passwords must NEVER be embedded in committed SQL.
--    In production (Supabase SQL Editor / DBA console), set the password out-of-band:
--      ALTER ROLE api_user WITH PASSWORD '<CHOOSE_STRONG_SECRET>';
-- 4. Database connect privilege dynamically targets current_database() rather than hardcoding.

DO $$
DECLARE
    current_db TEXT;
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'api_user') THEN
        CREATE ROLE api_user WITH LOGIN
            NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
    ELSE
        ALTER ROLE api_user WITH
            NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
    END IF;

    -- Dynamically grant connect on the active database (e.g. 'postgres' in Supabase, 'creator_platform' locally)
    SELECT current_database() INTO current_db;
    EXECUTE format('GRANT CONNECT ON DATABASE %I TO api_user', current_db);
END
$$;

-- Grant schema and object permissions in public
GRANT USAGE ON SCHEMA public TO api_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO api_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO api_user;

-- Configure default privileges for current role
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO api_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO api_user;

-- In Supabase where migrations run as postgres, ensure postgres-created objects are also granted
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'postgres') THEN
        ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
            GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO api_user;
        ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
            GRANT USAGE, SELECT ON SEQUENCES TO api_user;
    END IF;
END
$$;
