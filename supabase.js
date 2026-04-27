import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://zqrizrtembhifljulrfd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpxcml6cnRlbWJoaWZsanVscmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc2MjYsImV4cCI6MjA5Mjg2MzYyNn0.LlzpExD72n3Y34PRcYTudQfC7BhwKGWqwQwmMfPM4UM'

export const supabase = createClient(supabaseUrl, supabaseKey)
