
// src/app/(pages)/blog/[id]/page.tsx
import BlogDetailContainer from "@/app/domains/blog/containers/BlogDetailContainer";
import { fetchBlogById } from "@/lib/supabase/queries";
// src/app/(pages)/blog/[id]/page.tsx

export async function generateMetadata({ params }: { params: { id: string } }) {
  const blog = await fetchBlogById(params.id);
  return {
    title: blog?.title || "Blog",
    description: blog?.blog?.slice(0, 160) || "Zobacz wpis na blogu ProstoAngielski.",
  };
}

export default function Page() {
  return <BlogDetailContainer />;
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import ReactMarkdown from "react-markdown";
// import { Calendar, ArrowLeft } from "lucide-react";
// import { motion } from "framer-motion";
// import { fetchBlogById } from "@/lib/supabase/queries/blogs";

// type Blog = {
//   id: number;
//   title: string | null;
//   image_link: string | null;
//   blog: string | null;
//   created_at: string;
// };

// export default function BlogDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [blog, setBlog] = useState<Blog | null>(null);
//   const [loading, setLoading] = useState(true);

//   // 📦 Blog məlumatını çək
//   useEffect(() => {
//     if (!id) return;

//     async function load() {
//       setLoading(true);
//       const data = await fetchBlogById(id as string);
//       setBlog(data);
//       setLoading(false);
//     }

//     load();
//   }, [id]);

//   // 🔙 Geri funksiyası
//   const handleGoBack = () => {
//     if (window.history.length > 1) {
//       router.back();
//     } else {
//       router.push("/blog");
//     }
//   };

//   // 🌀 Loading skeleton
//   if (loading) {
//     return (
//       <section className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
//         <div className="h-10 w-48 bg-gray-200 mb-6 rounded-lg"></div>
//         <div className="h-64 bg-gray-200 mb-8 rounded-2xl"></div>
//         <div className="space-y-3">
//           <div className="h-4 bg-gray-200 rounded w-full"></div>
//           <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//           <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         </div>
//       </section>
//     );
//   }

//   // ⚠️ Əgər blog tapılmadısa
//   if (!blog) {
//     return (
//       <section className="max-w-3xl mx-auto text-center py-20">
//         <p className="text-gray-600 text-lg mb-6">
//           Nie znaleziono tego wpisu 😢
//         </p>
//         <button
//           onClick={handleGoBack}
//           className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
//         >
//           Wróć do bloga
//         </button>
//       </section>
//     );
//   }

//   return (
//     <motion.section
//       className="max-w-4xl mx-auto px-6 md:px-10 py-16"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* 🔙 Geri */}
//       <button
//         onClick={handleGoBack}
//         className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6"
//       >
//         <ArrowLeft className="w-4 h-4" />
//         Wróć do bloga
//       </button>

//       {/* 🖼️ Şəkil */}
//       {blog.image_link && (
//         <div className="relative w-full h-80 md:h-[420px] mb-10 rounded-2xl overflow-hidden shadow-lg">
//           <img
//             src={blog.image_link}
//             alt={blog.title || "Blog image"}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
//         </div>
//       )}

//       {/* 🧠 Başlıq */}
//       <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
//         {blog.title || "Bez tytułu"}
//       </h1>

//       {/* 🗓️ Tarix */}
//       <div className="flex items-center gap-2 text-gray-500 mb-8">
//         <Calendar className="w-4 h-4" />
//         {new Date(blog.created_at).toLocaleDateString("pl-PL")}
//       </div>

//       {/* 📝 Markdown məzmunu */}
//       <article className="prose prose-green prose-lg max-w-none text-gray-800 leading-relaxed">
//         <ReactMarkdown>{blog.blog || "_Brak treści_"}</ReactMarkdown>
//       </article>
//     </motion.section>
//   );
// }
