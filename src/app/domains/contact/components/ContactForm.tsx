"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("sending");

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    setStatus("sent");
  } else {
    setStatus("idle");
    alert("❌ Wystąpił błąd. Spróbuj ponownie.");
  }
};

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Formularz kontaktowy
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Imię i nazwisko
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Adres e-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wiadomość
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-colors disabled:opacity-70"
        >
          {status === "idle" && "Wyślij wiadomość"}
          {status === "sending" && "Wysyłanie..."}
          {status === "sent" && "Wiadomość wysłana ✅"}
        </button>
      </form>
    </div>
  );
}
