"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import BlogCard from "../components/BlogCard";
import { useBlogs } from "../features/useBlogs";

export default function BlogPageContainer() {
  const { filteredBlogs, search, setSearch, loading } = useBlogs();

  return (
    <>
      <NavbarContainer initialUser={null} />

      <section className="relative max-w-screen-xl mx-auto px-6 md:px-12 py-28 transition-all">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logoweb.svg"
              alt="Logo"
              width={60}
              height={60}
              className="rounded-lg drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
            <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-500 to-teal-400 text-transparent bg-clip-text">
              PROSTOANGIELSKI Blog
            </h1>
          </div>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
            Czytaj, ucz się i inspiruj z naszymi artykułami 💚
          </p>
        </motion.div>

        <div className="relative max-w-lg mx-auto mb-12">
          <input
            type="text"
            placeholder="Szukaj po tytule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-5 pr-4 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 h-72 rounded-2xl border border-gray-200"></div>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
          >
            {filteredBlogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} index={i} />
            ))}
          </motion.div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Nie znaleziono żadnych wpisów.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.15),_transparent_70%)]"
        />
      </section>
    </>
  );
}
