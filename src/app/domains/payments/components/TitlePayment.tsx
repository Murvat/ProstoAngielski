import Image from "next/image"

export default function TitlePayment() {
  return (
    <div className="flex items-center gap-3">
        <Image
                src="/logo.svg"
                alt="Prosto Angielski Logo"
                width={100}
                height={80}
              />
      <h1 className="text-xl font-semibold text-[#253058]">Płatność</h1>
    </div>
  );
}
