"use client";

import CompanyInfo from "../components/CompanyInfo"; 
import ContactForm from "../components/ContactForm"; 

export default function ContactContainer() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
          Kontakt
        </h1>

        {/* Company Info */}
        <CompanyInfo />

        {/* Contact Form */}
        <ContactForm />
      </div>
    </div>
  );
}
