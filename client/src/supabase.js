import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vjwbscpnejglevqvkkhq.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey); //connection success to supabase

export default supabase;