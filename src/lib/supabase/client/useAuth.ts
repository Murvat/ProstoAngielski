// // src/features/useAuth.ts
// import { supabase } from "./supabaseClient";

// export async function signInWithGoogle() {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: "http://localhost:3000/auth/callback",
//     },
//   });

//   if (error) throw error;
//   return data;
// }

// export async function signOut() {
//   await supabase.auth.signOut();
// }
