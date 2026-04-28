import { createClient } from '@supabase/supabase-js'

// Pegue esses dados no seu painel do Supabase (Settings > API)
const supabaseUrl = 'https://tiarimiqqqakaagodlou.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpYXJpbWlxcXFha2FhZ29kbG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTkzNTMsImV4cCI6MjA4OTQzNTM1M30.Nw00AN47e8p-8ioEuajuHLDw0xbN2B0SUep9WFoMrSI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)