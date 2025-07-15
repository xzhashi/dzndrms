import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://strg21.dozendreams.com';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MjM4NjU4MCwiZXhwIjo0OTA4MDYwMTgwLCJyb2xlIjoiYW5vbiJ9.vCQwcpypKE14bLS_0xdFvbfLrNT5w8irW2jXgtIT9q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
