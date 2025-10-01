import { CheckIcon } from "lucide-react";

export default function BenefitsPayment() {
  const benefits = [
    "Krótkie i zrozumiałe lekcje",
    "Materiały PDF do pobrania po każdej lekcji",
    "Praktyczne przykłady z życia codziennego",
    "Interaktywne ćwiczenia online",
    "Zadania dopasowane do poziomu",
    "Powtórki w systemie zapamiętywania",
    "Dostęp na urządzeniach mobilnych (Wkrótce)",
    "Konkretny zakres słownictwa w każdej lekcji",
    "Ćwiczenia rozwijające wszystkie umiejętności",
  ];

  return (
    <div className=" bg-green-50 p-6 rounded-lg shadow space-y-6">
      <h3 className="text-green-700 font-medium">Otrzymasz</h3>
      <ul className="space-y-3 text-gray-700 text-sm">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-center gap-2">
            <CheckIcon className="w-6 h-6 text-green-500" />
            <span className="leading-snug text-left">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
