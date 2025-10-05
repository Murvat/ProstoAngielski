// src/app/auth/components/AuthForm.tsx
"use client";
import { useFormStatus } from "react-dom";

type AuthFormProps = {
  errors?: Record<string, string[]>;
  submitLabel: string;
  includeConfirmPassword?: boolean;
  formAction: (formData: FormData) => void | Promise<void>;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "Ładowanie..." : label}
    </button>
  );
}

export default function AuthForm({
  errors,
  submitLabel,
  includeConfirmPassword = false,
  formAction,
}: AuthFormProps) {
  return (
    <form action={formAction} className="space-y-6 mt-6 text-left">
      <div className="space-y-4">
        {/* Email */}
        <input
          type="text"
          name="email"
          placeholder="Adres e-mail"
          aria-invalid={!!errors?.email}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm 
          focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
        />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          aria-invalid={!!errors?.password}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm 
          focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
        />
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors.password[0]}</p>
        )}

        {/* Confirm password (signup only) */}
        {includeConfirmPassword && (
          <>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Potwierdź hasło"
              aria-invalid={!!errors?.confirmPassword}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm 
              focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword[0]}
              </p>
            )}
          </>
        )}

        {/* Terms checkbox */}
        {includeConfirmPassword && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agreeTerms"
              id="agreeTerms"
              className="h-4 w-4 text-green-600 border-gray-300 rounded 
              focus:ring-green-500 cursor-pointer"
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-700">
              Akceptuję{" "}
              <a
                href="/terms"
                className="text-green-600 underline hover:text-green-700 cursor-pointer"
              >
                regulamin
              </a>
            </label>
          </div>
        )}
        {errors?.agreeTerms && (
          <p className="text-red-500 text-sm">{errors.agreeTerms[0]}</p>
        )}

        {/* Form-level errors */}
        {errors?.form && (
          <p className="text-red-500 text-sm">{errors.form[0]}</p>
        )}

        {/* Password hint */}
        {includeConfirmPassword && (
          <p className="text-xs text-gray-500">
            Hasło musi mieć co najmniej 8 znaków i zawierać minimum 3 cyfry.
          </p>
        )}
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
