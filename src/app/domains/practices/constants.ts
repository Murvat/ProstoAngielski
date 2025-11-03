export const PRACTICE_SECTION_KEYS = ["tasks", "flashcards", "vocabulary"] as const;

export type PracticeSectionKey = (typeof PRACTICE_SECTION_KEYS)[number];

type PracticeSectionMeta = {
  key: PracticeSectionKey;
  badge: string;
  cardTitle: string;
  cardDescription: string;
  heroTitle: string;
  heroDescription: string;
  gradient: string;
  accentTextClass: string;
  badgeClassName: string;
  ringClassName: string;
  hoverBorderClassName: string;
  statAccent: string;
};

export const PRACTICE_SECTION_META: Record<PracticeSectionKey, PracticeSectionMeta> = {
  tasks: {
    key: "tasks",
    badge: "Ćwiczenia",
    cardTitle: "Ćwiczenia interaktywne",
    cardDescription:
      "Rozwiązuj zadania typu cloze, poprawiaj błędy i buduj zdania, aby poczuć rytm języka.",
    heroTitle: "Sekcja ćwiczeń interaktywnych",
    heroDescription:
      "Każde zadanie zostało przygotowane tak, aby od razu sprawdzić Twoje rozumienie konstrukcji i słownictwa. Zapisujemy postępy w Twojej przeglądarce, więc możesz wrócić w dowolnym momencie.",
    gradient: "from-emerald-500 via-teal-400 to-green-500",
    accentTextClass: "text-emerald-600",
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ringClassName: "ring-emerald-200",
    hoverBorderClassName: "hover:border-emerald-300",
    statAccent: "text-emerald-600",
  },
  flashcards: {
    key: "flashcards",
    badge: "Fiszki",
    cardTitle: "Fiszki z podpowiedziami",
    cardDescription:
      "Poznaj słówka z tłumaczeniem, przykładem i wskazówką. Odwróć kartę i oceń, czy już pamiętasz.",
    heroTitle: "Sekcja fiszek pamięciowych",
    heroDescription:
      "Sprawdzaj słownictwo w trybie aktywnym. Każda fiszka ma tłumaczenie i zdanie przykładowe, a Ty decydujesz, czy oznaczyć hasło jako zapamiętane.",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    accentTextClass: "text-sky-600",
    badgeClassName: "bg-sky-50 text-sky-600 ring-sky-200",
    ringClassName: "ring-sky-200",
    hoverBorderClassName: "hover:border-sky-300",
    statAccent: "text-sky-600",
  },
  vocabulary: {
    key: "vocabulary",
    badge: "Słownictwo",
    cardTitle: "Zestawy tematyczne",
    cardDescription:
      "Wybierz temat albo tryb mieszany i trenuj szybkie dopasowywanie tłumaczeń.",
    heroTitle: "Sekcja słownictwa tematycznego",
    heroDescription:
      "Utrwalaj słownictwo z wybranych działów lub zmierz się z trybem mieszanym (50 pytań), aby sprawdzić całą wiedzę naraz.",
    gradient: "from-purple-500 via-fuchsia-500 to-violet-500",
    accentTextClass: "text-purple-600",
    badgeClassName: "bg-purple-50 text-purple-600 ring-purple-200",
    ringClassName: "ring-purple-200",
    hoverBorderClassName: "hover:border-purple-300",
    statAccent: "text-purple-600",
  },
};

export function isPracticeSectionKey(value: string): value is PracticeSectionKey {
  return PRACTICE_SECTION_KEYS.includes(value as PracticeSectionKey);
}

export function getPracticeSectionMeta(section: PracticeSectionKey) {
  return PRACTICE_SECTION_META[section];
}
