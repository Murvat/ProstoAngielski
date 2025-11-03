"use client";

import { AdminBlogForm } from "../components/AdminBlogForm";
import { AdminBlogList } from "../components/AdminBlogList";
import { AdminBlogLogin } from "../components/AdminBlogLogin";
import { useAdminBlogs } from "../features/useAdminBlogs";

export function AdminBlogDashboard() {
  const {
    blogs,
    form,
    editingId,
    preview,
    loading,
    blogError,
    username,
    password,
    isLoggedIn,
    loginError,
    setForm,
    setUsername,
    setPassword,
    handleLogin,
    handleSubmit,
    handleEdit,
    handleDelete,
    togglePreview,
  } = useAdminBlogs();

  if (!isLoggedIn) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col justify-center px-6 py-12">
        <AdminBlogLogin
          username={username}
          password={password}
          error={loginError}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-green-700">
            Panel blogowy
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Zarzadzaj wpisami blogowymi: dodawaj nowe tresci, edytuj istniejace
            artykuly i usuwaj nieaktualne wpisy.
          </p>
        </header>

        <AdminBlogForm
          form={form}
          preview={preview}
          editingId={editingId}
          loading={loading}
          blogError={blogError}
          onChange={setForm}
          onTogglePreview={togglePreview}
          onSubmit={handleSubmit}
        />

        <div className="space-y-4 bg-white/90 border border-gray-200 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700">
            Wszystkie wpisy
          </h2>
          <AdminBlogList
            blogs={blogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
}
