-- Migration: 002_add_chat_origin
-- Description: Adds chat_origin column to both sessions and messages tables
-- Created at: 2024-03-19

-- Add chat_origin to conversation_sessions
ALTER TABLE conversation_sessions
ADD COLUMN chat_origin VARCHAR(50);

-- Add chat_origin to conversation_messages
ALTER TABLE conversation_messages
ADD COLUMN chat_origin VARCHAR(50);

-- Create index for efficient querying by chat_origin
CREATE INDEX idx_sessions_chat_origin ON conversation_sessions(chat_origin);
CREATE INDEX idx_messages_chat_origin ON conversation_messages(chat_origin);