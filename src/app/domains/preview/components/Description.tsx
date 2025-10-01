import Image from "next/image";

export default function Description() {
  return (
    <section className="flex flex-col gap-12 md:gap-24 px-4 md:px-16 py-12 md:py-16 max-w-screen-xl mx-auto">
      {/* First Block */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <Image
          src="/adfree.png"
          alt="Example 1"
          width={590}
          height={400}
          className="w-full max-w-md md:max-w-lg rounded-lg"
        />
        <div className="flex-1 max-w-xl flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-sans">
            Żadnej reklamy.
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed">
            Uczysz się angielskiego, a nie tracisz czasu na reklamy. U nas liczy
            się Twój rozwój i komfort nauki. Zero banerów, zero rozpraszaczy —
            tylko to, co naprawdę ważne.
          </p>
        </div>
      </div>

      {/* Second Block (Reversed) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <Image
          src="/pay.png"
          alt="Example 2"
          width={590}
          height={400}
          className="w-full max-w-md md:max-w-lg rounded-lg"
        />
        <div className="flex-1 max-w-xl flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-sans">
            Jednorazowa opłata
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed">
            Płacisz raz i uczysz się bez limitów, kiedy chcesz i jak chcesz. Bez
            ukrytych opłat, bez subskrypcji. Prosto, uczciwie i przejrzyście —
            dokładnie tak, jak powinno być.
          </p>
        </div>
      </div>

      {/* Third Block */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        <Image
          src="/career.png"
          alt="Career ladder"
          width={590}
          height={400}
          className="w-full max-w-md md:max-w-lg rounded-lg"
        />
        <div className="flex-1 max-w-xl flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-sans">
            Nauka języka to nie zabawa
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed">
            To jest prawdziwa inwestycja w siebie. Dlatego u nas nie znajdziesz
            zbędnych gier, rankingów ani sztucznych motywatorów. Liczy się Twój
            realny postęp, a nie punkty czy odznaki. Stawiamy na konkretną
            naukę, która daje prawdziwe efekty.
          </p>
        </div>
      </div>

      {/* Fourth Block (Reversed) */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <Image
          src="/speak.png"
          alt="Example 2"
          width={590}
          height={400}
          className="w-full max-w-md md:max-w-lg rounded-lg"
        />
        <div className="flex-1 max-w-xl flex flex-col gap-6">
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight font-sans">
            Dla Polaków
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed">
            Którzy chcą zrozumieć angielski raz na zawsze. Wiemy, że angielski
            to nie tylko nowe słowa, ale zupełnie inny sposób myślenia. Dlatego
            tłumaczymy to tak, jak nikt inny — z myślą o Tobie.
          </p>
        </div>
      </div>
    </section>
  );
}
