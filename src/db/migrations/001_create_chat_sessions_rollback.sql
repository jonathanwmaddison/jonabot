-- Rollback Migration: 001_create_chat_sessions
-- Description: Removes chat session and message tables
-- Created at: 2024-02-03

-- Drop indexes first
DROP INDEX IF EXISTS idx_messages_timestamp;
DROP INDEX IF EXISTS idx_messages_session_id;

-- Drop tables (order matters due to foreign key constraints)
DROP TABLE IF EXISTS conversation_messages;
DROP TABLE IF EXISTS conversation_sessions;