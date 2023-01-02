import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient(
  "https://zgrlireycbtaumwfayab.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmxpcmV5Y2J0YXVtd2ZheWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIzMTc4OTIsImV4cCI6MTk4Nzg5Mzg5Mn0.EnZ2tIVr5JuntCs83aYYvGzjliHeJmVAPAsytpmjHd0",
  {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
  }
);
