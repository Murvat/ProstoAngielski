export default function CompanyInfo() {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dane firmy</h2>
      <p className="text-gray-700">
        <strong>Prostolang</strong> <br />
        NIP: <strong>1133179228</strong>, REGON: <strong>542709760</strong>
        <br />
        E-mail:{" "}
        <a
          href="mailto:support@prostoangielski.pl"
          className="text-orange-600 hover:underline"
        >
          support@prostoangielski.pl
        </a>
      </p>
    </div>
  );
}
