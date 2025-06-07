import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tuuiecrdjnjkrfljwuyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dWllY3Jkam5qa3JmbGp3dXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjA5OTIsImV4cCI6MjA2NDAzNjk5Mn0.F6m8BYLPbRYhtDVu802LxfdemSqjGHAO7hYYD5kXzcs';

export const supabase = createClient(supabaseUrl, supabaseKey);