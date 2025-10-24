"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Calendar } from "lucide-react";
import type { BlogPost } from "@/types";

type BlogCardProps = {
  blog: BlogPost;
  index: number;
};

export default function BlogCard({ blog, index }: BlogCardProps) {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.4 },
    }),
  };

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {blog.image_link ? (
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={blog.image_link}
            alt={blog.title || "thumbnail"}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div className="h-52 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
          Brak zdjęcia
        </div>
      )}

      <div className="flex flex-col justify-between flex-1 p-6">
        <Link
          href={`/blog/${blog.id}`}
          className="text-green-700 hover:text-green-800 font-bold text-xl mb-2 line-clamp-2 transition"
        >
          {blog.title || "Bez tytułu"}
        </Link>

        <div className="flex items-center justify-between text-gray-500 text-sm mt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {blog.created_at
              ? new Date(blog.created_at).toLocaleDateString("pl-PL")
              : ""}
          </div>

          <Link
            href={`/blog/${blog.id}`}
            className="text-green-600 font-medium hover:underline hover:text-green-700 transition"
          >
            Czytaj dalej →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
