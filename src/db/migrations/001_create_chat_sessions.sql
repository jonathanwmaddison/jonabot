-- Migration: 001_create_chat_sessions
-- Description: Creates tables for tracking chat sessions and messages
-- Created at: 2024-02-03

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the sessions table
CREATE TABLE conversation_sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  metadata JSONB
);

-- Create the messages table
CREATE TABLE conversation_messages (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES conversation_sessions(session_id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

-- Add indexes for better query performance
CREATE INDEX idx_messages_session_id ON conversation_messages(session_id);
CREATE INDEX idx_messages_timestamp ON conversation_messages(timestamp);