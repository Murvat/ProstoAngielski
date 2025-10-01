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
    <div className="w-full max-w-lg bg-green-50 rounded-xl p-8 space-y-6 shadow-md">
      <h1 className="text-2xl md:text-3xl font-semibold font-sans text-green-800">
        ✅ Payment Successful!
      </h1>

      <p className="text-gray-700 text-base">
        Thank you,{" "}
        <span className="font-semibold text-green-700">{userName}</span>!
      </p>

      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4 text-left">
        <h2 className="text-lg font-semibold text-gray-800">
          Your Purchase Details
        </h2>
        <div className="space-y-2 text-gray-700 text-sm">
          <p>
            <span className="font-medium">Course:</span> {course}
          </p>
          <p>
            <span className="font-medium">Amount Paid:</span> {amount}
          </p>
          <p>
            <span className="font-medium">Access:</span> {access}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        A confirmation email with your receipt and access details has been sent.
      </p>
    </div>
  );
}
