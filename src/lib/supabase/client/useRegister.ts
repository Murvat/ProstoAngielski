// import { supabase } from "./supabaseClient"; 

// type RegisterInput = {
//   email: string;
//   password: string;
// };

// export async function registerUser({ email, password }: RegisterInput) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: "http://localhost:3000/confirmation",
//     },
//   });

//   if (error) throw error;

//   return data.user; 
// }

