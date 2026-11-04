-- Migration 001: Enable pgvector and uuid-ossp extensions
-- In Supabase, extensions are typically placed in the `extensions` schema.
-- If schema `extensions` exists, install there; otherwise use default schema.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'extensions') THEN
        CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
    ELSE
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    END IF;
END
$$;
