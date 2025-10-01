export default function page() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 text-center">
          Polityka Prywatności
        </h1>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-base md:text-lg">
            <strong>Data wejścia w życie:</strong> 26 maja 2024 r.
          </p>

          <p>
            Administratorem danych osobowych jest{" "}
            <strong>Prostolang</strong>, NIP: 1133179228, REGON: 542709760, z
            siedzibą w Polsce („Administrator”, „my”, „nasz”). Niniejsza
            Polityka Prywatności określa zasady przetwarzania danych osobowych
            użytkowników korzystających z aplikacji{" "}
            <strong>ProstoAngielski</strong>.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            1. Jakie dane zbieramy
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dane rejestracyjne (e-mail, hasło, dane logowania Google)</li>
            <li>
              Dane płatnicze (obsługiwane przez Stripe, PayPal – nie
              przechowujemy kart)
            </li>
            <li>Dane dotyczące postępów w kursach</li>
            <li>
              Dane techniczne i diagnostyczne (IP anonimizowane, przeglądarka,
              logi błędów)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            2. Cele przetwarzania danych
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Świadczenie usług kursów online</li>
            <li>Obsługa płatności i obowiązków podatkowych</li>
            <li>Zapewnienie bezpieczeństwa i wsparcia technicznego</li>
            <li>
              Analiza ruchu i poprawa działania Serwisu (Plausible Analytics –
              bez cookies)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            3. Podstawa prawna
          </h2>
          <p>
            Dane przetwarzane są zgodnie z art. 6 RODO (umowa, obowiązki prawne,
            uzasadniony interes).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            4. Przekazywanie danych
          </h2>
          <p>
            Dane mogą być przekazywane podmiotom: Supabase (hosting, baza
            danych), Stripe i PayPal (płatności), Plausible Analytics (anonimowa
            analityka), usługodawcom IT i księgowym. W przypadku przekazania
            danych poza EOG stosujemy odpowiednie zabezpieczenia (np. klauzule
            umowne UE).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            5. Czas przechowywania
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dane konta – do momentu usunięcia</li>
            <li>Dane płatnicze – min. 5 lat zgodnie z prawem</li>
            <li>
              Dane postępów – do usunięcia konta lub 2 lata nieaktywności
            </li>
            <li>Dane techniczne – do 12 miesięcy</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            6. Twoje prawa
          </h2>
          <p>
            Masz prawo do: dostępu, sprostowania, usunięcia, ograniczenia,
            przeniesienia danych oraz sprzeciwu wobec przetwarzania. Możesz
            złożyć skargę do UODO.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            7. Dzieci
          </h2>
          <p>Serwis nie jest przeznaczony dla osób poniżej 18 roku życia.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            8. Zabezpieczenia
          </h2>
          <p>
            Stosujemy szyfrowanie TLS, ograniczony dostęp do baz danych, kopie
            bezpieczeństwa i inne środki ochrony danych.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            9. Zmiany
          </h2>
          <p>
            Polityka Prywatności może być aktualizowana. O istotnych zmianach
            poinformujemy Cię drogą mailową i w Serwisie.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10">
            10. Kontakt
          </h2>
          <p>
            Administrator: <strong>Prostolang</strong> <br />
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
      </div>
    </div>
  );
}
