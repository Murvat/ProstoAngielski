export default function page() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
          Regulamin Serwisu ProstoAngielski
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            <strong>Data wejścia w życie:</strong> 26 maja 2024 r.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            1. Postanowienia ogólne
          </h2>
          <p>
            Serwis <strong>ProstoAngielski</strong> umożliwia dostęp do kursów
            języka angielskiego online. Administratorem jest{" "}
            <strong>Prostolang</strong>, NIP: 1133179228, REGON: 542709760.
            Kontakt:{" "}
            <a
              href="mailto:support@prostoangielski.pl"
              className="text-orange-600 hover:underline"
            >
              support@prostoangielski.pl
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            2. Rejestracja i konto
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Konto można założyć przez e-mail i hasło lub logowanie Google.</li>
            <li>Konto jest indywidualne i nie może być współdzielone.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            3. Warunki świadczenia usług
          </h2>
          <p>
            Usługi świadczone są drogą elektroniczną, 24/7 z przerwami
            technicznymi.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            4. Płatności
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Płatności obsługiwane są przez Stripe i PayPal.</li>
            <li>Dostęp do kursu przyznawany jest po zaksięgowaniu płatności.</li>
            <li>Ceny zawierają podatek VAT.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            5. Prawo odstąpienia
          </h2>
          <p>
            Konsument może odstąpić od umowy w ciągu 14 dni, ale traci to prawo
            po rozpoczęciu kursu (zgodnie z art. 38 ustawy o prawach konsumenta).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            6. Zasady korzystania
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Zakaz kopiowania i odsprzedaży materiałów.</li>
            <li>Zakaz udostępniania danych logowania osobom trzecim.</li>
            <li>Zakaz działań zakłócających pracę Serwisu.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            7. Własność intelektualna
          </h2>
          <p>
            Materiały kursowe są chronione prawem autorskim. Dozwolony jest
            wyłącznie użytek osobisty.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            8. Odpowiedzialność
          </h2>
          <p>
            Administrator nie gwarantuje pełnej dostępności Serwisu i nie
            odpowiada za szkody powstałe wskutek przerw technicznych lub działań
            osób trzecich. Odpowiedzialność ograniczona jest do ceny kursu.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            9. Reklamacje
          </h2>
          <p>
            Reklamacje można zgłaszać na{" "}
            <a
              href="mailto:support@prostoangielski.pl"
              className="text-orange-600 hover:underline"
            >
              support@prostoangielski.pl
            </a>
            . Rozpatrzymy je w ciągu 14 dni.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            10. Dane osobowe
          </h2>
          <p>Przetwarzamy dane zgodnie z naszą Polityką Prywatności.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            11. Postanowienia końcowe
          </h2>
          <p>
            Regulamin może być zmieniony, a Użytkownicy zostaną poinformowani co
            najmniej 7 dni wcześniej. Obowiązuje prawo polskie: ustawa o
            świadczeniu usług drogą elektroniczną, ustawa o prawach konsumenta,
            RODO.
          </p>
        </div>
      </div>
    </div>
  );
}
