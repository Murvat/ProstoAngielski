// src/app/domains/navbar/containers/NavbarContainer.tsx
"use client";

import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../features/useAuth";
import { useDropdown } from "../features/useDropdown";

export default function NavbarContainer({ initialUser }: { initialUser: User | null }) {
  const router = useRouter();
  const { user: clientUser, logout } = useAuth();
  const { isOpen, toggle, close, dropdownRef } = useDropdown();

  // prefer client user, fallback to server user
  const user = clientUser ?? initialUser;

  // navigation handlers
  const goProfile = () => router.push("/profile");
  const goPayments = () => router.push("/profile");
  const goLogin = () => router.push("/login");
  const goContact = () => router.push("/contact");
  const goBlog = () => router.push("/blog");


  return (
    <Navbar
      user={user}
      isOpen={isOpen}
      onToggleDropdown={toggle}
      onCloseDropdown={close}
      dropdownRef={dropdownRef}
      onGoProfile={goProfile}
      onGoContact={goContact}
      onGoPayments={goPayments}
      onGoBlog={goBlog}
      onLogout={logout}
      onLogin={goLogin}
    />
  );
}
