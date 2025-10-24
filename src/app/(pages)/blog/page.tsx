"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchBlogs } from "@/lib/supabase/queries/blogs";
import type { BlogPost } from "@/types";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // ✅ Fetch once — from utility
    useEffect(() => {
        let mounted = true;

        async function load() {
            const data = await fetchBlogs();
            if (mounted) {
                setBlogs(data);
                setFilteredBlogs(data);
                setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    // ✅ Local search
    useEffect(() => {
        if (!search.trim()) {
            setFilteredBlogs(blogs);
            return;
        }

        const q = search.toLowerCase();
        setFilteredBlogs(
            blogs.filter((b) => b.title?.toLowerCase().includes(q))
        );
    }, [search, blogs]);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.07, duration: 0.4 },
        }),
    };

    return (
        <>
            <NavbarContainer  initialUser={null}  />

            <section className="relative max-w-screen-xl mx-auto px-6 md:px-12 py-28 transition-all">
                {/* 🌟 Header with logo */}
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

                {/* 🔍 Search bar */}
                <div className="relative max-w-lg mx-auto mb-12">
                    <input
                        type="text"
                        placeholder="Szukaj po tytule..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 rounded-full pl-5 pr-4 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                    />
                </div>

                {/* 🌀 Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 h-72 rounded-2xl border border-gray-200"
                            ></div>
                        ))}
                    </div>
                )}

                {/* 📚 Blog list */}
                {!loading && filteredBlogs.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredBlogs.map((blog, i) => (
                            <motion.div
                                key={blog.id}
                                custom={i}
                                variants={fadeUp}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* 🖼 Image */}
                                {blog.image_link ? (
                                    <div className="relative h-52 w-full overflow-hidden">
                                        <img
                                            src={blog.image_link}
                                            alt={blog.title || "thumbnail"}
                                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    </div>
                                ) : (
                                    <div className="h-52 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                        Brak zdjęcia
                                    </div>
                                )}

                                {/* 📄 Title + date + read more */}
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
                                            {new Date(blog.created_at).toLocaleDateString("pl-PL")}
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
                        ))}
                    </motion.div>
                )}

                {/* ⚠️ No blogs */}
                {!loading && filteredBlogs.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">
                        Nie znaleziono żadnych wpisów.
                    </p>
                )}

                {/* ✨ Background effect */}
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
