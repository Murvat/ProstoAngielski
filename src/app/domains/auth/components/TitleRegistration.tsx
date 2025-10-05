import Image from "next/image";

export default function TitleRegistration() {
  return (
    <div
      className="w-full max-w-lg bg-green-50 p-6 rounded-xl text-center shadow-sm 
      flex flex-col items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Logo */}
      <Image
        src="/logoweb.svg"
        alt="Logo Prosto Angielski"
        width={64}
        height={64}
        className="mx-auto hover:scale-105 transition-transform"
      />

      {/* Tytuł */}
      <h1 className="text-2xl md:text-3xl font-semibold text-green-800">
        Witamy w Prosto Angielski
      </h1>

      {/* Podtytuł */}
      <p className="text-gray-600 mt-2">
        Zarejestruj się i wybierz odpowiedni dla siebie kurs
      </p>
    </div>
  );
}
