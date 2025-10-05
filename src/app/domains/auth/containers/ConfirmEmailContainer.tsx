type ConfirmEmailCardProps = {
  email: string;
};

export default function ConfirmEmailContainer({ email }: ConfirmEmailCardProps) {
  return (
    <div
      className="w-full max-w-md bg-green-50 p-6 md:p-8 rounded-xl shadow-md 
      hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h1 className="text-xl md:text-2xl leading-snug font-semibold font-sans text-green-800">
        Potwierdź swój adres e-mail
      </h1>

      <p className="text-gray-600 text-sm mt-4">
        Wysłaliśmy link potwierdzający na Twój adres e-mail:
        <br />
        <span className="font-medium text-gray-800 break-words">{email}</span>
      </p>

      <p className="text-gray-600 text-sm mt-2">
        Sprawdź swoją skrzynkę odbiorczą i kliknij w link, aby kontynuować.
      </p>

      <p className="text-gray-500 text-xs mt-4">
        Jeśli nie widzisz wiadomości, sprawdź folder spam.
      </p>
    </div>
  );
}
