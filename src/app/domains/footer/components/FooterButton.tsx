type FooterButtonProps = {
  side: "prev" | "next";
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function FooterButton({
  side,
  label,
  onClick,
  disabled,
}: FooterButtonProps) {
  const isPrev = side === "prev";
  const color = isPrev
    ? "text-red-600 hover:bg-orange-50 active:bg-orange-100"
    : "text-green-600 hover:bg-green-100 active:bg-green-200";
  const arrow = isPrev ? "←" : "→";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-1/2 py-4 font-semibold flex items-center justify-center gap-2 
      transition-colors duration-200 rounded cursor-pointer
      ${color}
      ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      aria-disabled={disabled}
      aria-label={label}
    >
      {isPrev && <span className="text-lg">{arrow}</span>}
      {label}
      {!isPrev && <span className="text-lg">{arrow}</span>}
    </button>
  );
}
