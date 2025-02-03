# Database Migrations

This directory contains all database migrations for the project. Each migration is stored in a numbered SQL file in the `migrations` directory.

## Environment Variables

The following environment variables are required for database access:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

⚠️ **IMPORTANT: Security Notes**
1. Never commit actual environment variables to version control
2. The service role key (`SUPABASE_SERVICE_ROLE_KEY`) has full database access - keep it secure
3. Only use the service role key in trusted server-side code
4. Use `.env.local` for local development
5. Set environment variables securely in your deployment platform (e.g., Vercel)

## Migration Process

1. Create a new migration file in the `migrations` directory with the format:
   ```
   NNN_description_of_change.sql
   ```
   where NNN is a 3-digit number (e.g., 001, 002, etc.)

2. Add a header comment to the migration file with:
   - Migration name/number
   - Description
   - Creation date
   - Any special instructions or dependencies

3. Run the migration manually in the Supabase SQL Editor
   - Copy the contents of the migration file
   - Paste into the SQL Editor
   - Execute the SQL commands
   - Verify the changes were applied successfully

4. Document the migration execution in the log below

## Migration Log

| Migration | Description | Applied Date | Applied By | Notes |
|-----------|-------------|--------------|------------|-------|
| 001_create_chat_sessions | Creates tables for chat session tracking | PENDING | - | Initial schema for chat session logging |

## Schema Overview

### conversation_sessions
- Tracks individual chat sessions
- Primary key: session_id (UUID)
- Stores metadata about the session (user agent, IP, etc.)
- Records session start and end times

### conversation_messages
- Stores all messages within sessions
- Foreign key to conversation_sessions
- Includes message content, role (user/assistant), and metadata
- Indexed for efficient querying

## Best Practices

1. Always backup the database before applying migrations
2. Test migrations in a development environment first
3. Keep migrations idempotent when possible
4. Include both "up" (apply) and "down" (rollback) scripts for each change
5. Document any manual steps or verification needed

## Rollback Process

To rollback a migration, create a corresponding rollback file with the same number but suffixed with `_rollback.sql`. For example:

- `001_create_chat_sessions.sql` (forward migration)
- `001_create_chat_sessions_rollback.sql` (rollback script) 