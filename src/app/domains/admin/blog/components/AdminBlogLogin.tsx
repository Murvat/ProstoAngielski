"use client";

type AdminBlogLoginProps = {
  username: string;
  password: string;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function AdminBlogLogin({
  username,
  password,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: AdminBlogLoginProps) {
  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-lg border border-gray-200 p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
        Panel administratora
      </h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Login
          </label>
          <input
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            type="text"
            placeholder="Login administratora"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Haslo
          </label>
          <input
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            type="password"
            placeholder="Haslo"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Zaloguj sie
        </button>
      </form>
    </div>
  );
}
