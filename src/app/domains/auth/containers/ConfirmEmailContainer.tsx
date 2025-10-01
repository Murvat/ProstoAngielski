type ConfirmEmailCardProps = {
  email: string;
};

export default function ConfirmEmailContainer({ email }: ConfirmEmailCardProps) {
  return (
    <div className="w-full max-w-md bg-green-50 p-6 md:p-8 rounded-xl shadow-md">
      <h1 className="text-xl md:text-2xl leading-snug font-semibold font-sans text-green-800">
        Confirm Your Email
      </h1>

     <p className="text-gray-600 text-sm mt-4">
  We&apos;ve sent a confirmation link to your email address:
  <br />
  <span className="font-medium text-gray-800 break-words">{email}</span>
</p>

      <p className="text-gray-600 text-sm mt-2">
        Please check your inbox and click the confirmation link to continue.
      </p>

    
<p className="text-gray-500 text-xs mt-4">
  If you don&rsquo;t see the email, check your spam folder.
</p>
    </div>
  );
}
