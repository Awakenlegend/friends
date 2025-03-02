
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nhogyefbutexhalwouuj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ob2d5ZWZidXRleGhhbHdvdXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4OTU1MjQsImV4cCI6MjA1NjQ3MTUyNH0.t6DA8RaAZQsj064WV2DjUQPf6PnrsXmmzQPtFS53sMM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
