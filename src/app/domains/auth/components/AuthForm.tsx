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
      className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {pending ? "Loading..." : label}
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
          placeholder="Email"
          aria-invalid={!!errors?.email}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          aria-invalid={!!errors?.password}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
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
              placeholder="Confirm password"
              aria-invalid={!!errors?.confirmPassword}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            {errors?.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword[0]}
              </p>
            )}
          </>
        )}
        {includeConfirmPassword && (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      name="agreeTerms"
      id="agreeTerms"
      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      
    />
    <label htmlFor="agreeTerms" className="text-sm text-gray-700">
      I agree to the{" "}
      <a href="/terms" className="text-green-600 underline">
        Terms & Conditions
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

        {/* Password hint (signup only) */}
        {includeConfirmPassword && (
          <p className="text-xs text-gray-500">
            Must be at least 8 characters, include at least 3 numbers.
          </p>
        )}
      </div>

      <SubmitButton label={submitLabel} />
    </form>
  );
}
