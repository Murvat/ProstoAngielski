type PaymentSuccessCardProps = {
  userName: string;
  course: string;
  amount: string;
  access: string;
};

export default function PaymentSuccessCard({
  userName,
  course,
  amount,
  access,
}: PaymentSuccessCardProps) {
  return (
    <div
      className="w-full max-w-lg bg-green-50 rounded-xl p-8 space-y-6 shadow-md 
      hover:shadow-lg transition-shadow cursor-pointer"
    >
      <h1 className="text-2xl md:text-3xl font-semibold font-sans text-green-800">
        ✅ Płatność zakończona sukcesem!
      </h1>

      <p className="text-gray-700 text-base">
        Dziękujemy,{" "}
        <span className="font-semibold text-green-700">{userName}</span>!
      </p>

      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4 text-left">
        <h2 className="text-lg font-semibold text-gray-800">
          Szczegóły zakupu
        </h2>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <span className="font-medium">Kurs:</span> {course}
          </p>
          <p>
            <span className="font-medium">Kwota:</span> {amount}
          </p>
          <p>
            <span className="font-medium">Dostęp:</span> {access}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Potwierdzenie zakupu i szczegóły dostępu zostały wysłane na Twój adres
        e-mail.
      </p>
    </div>
  );
}
