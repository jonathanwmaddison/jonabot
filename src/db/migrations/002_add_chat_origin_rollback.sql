-- Rollback Migration: 002_add_chat_origin
-- Description: Removes chat_origin columns from sessions and messages tables
-- Created at: 2024-03-19

-- Drop indexes first
DROP INDEX IF EXISTS idx_sessions_chat_origin;
DROP INDEX IF EXISTS idx_messages_chat_origin;

-- Remove chat_origin columns
ALTER TABLE conversation_sessions DROP COLUMN IF EXISTS chat_origin;
ALTER TABLE conversation_messages DROP COLUMN IF EXISTS chat_origin;