"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { Calendar, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useBlog } from "../features/useBlogs";
import PromoBanner from "../../layouts/components/PromoBanner";

export default function BlogDetailContainer() {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const { blog, loading } = useBlog(blogId);

  const handleGoBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/blog");
  };

  if (loading) {
    return (
      <>
        <PromoBanner />
        <section className="max-w-3xl mx-auto px-6 py-20 animate-pulse">
          <div className="h-10 w-48 bg-gray-200 mb-6 rounded-lg"></div>
          <div className="h-64 bg-gray-200 mb-8 rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </section>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <PromoBanner />
        <section className="max-w-3xl mx-auto text-center py-20">
          <p className="text-gray-600 text-lg mb-6">Nie znaleziono tego wpisu 😕</p>
          <button
            onClick={handleGoBack}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Wróć do bloga
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <PromoBanner />
      <motion.section
        className="max-w-4xl mx-auto px-6 md:px-10 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do bloga
        </button>

        {blog.image_link && (
          <div className="relative w-full h-80 md:h-[420px] mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={blog.image_link}
              alt={blog.title || "Blog image"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          {blog.title || "Bez tytułu"}
        </h1>

        <div className="flex items-center gap-2 text-gray-500 mb-8">
          <Calendar className="w-4 h-4" />
          {new Date(blog.created_at).toLocaleDateString("pl-PL")}
        </div>

        <article className="prose prose-green prose-lg max-w-none text-gray-800 leading-relaxed">
          <ReactMarkdown>{blog.blog || "_Brak treści_"}</ReactMarkdown>
        </article>
      </motion.section>
    </>
  );
}
