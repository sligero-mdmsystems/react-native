import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient(
  "https://zgrlireycbtaumwfayab.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmxpcmV5Y2J0YXVtd2ZheWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE2OTY5NjUsImV4cCI6MTk4NzI3Mjk2NX0.wgMYylqzKMmH8nlt9XawpvoYakf0ztt4VLzpY1Ml4-4",
  {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
  }
);
