import FooterButton from "./FooterButton";

type FooterProps = {
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel: string;
  nextLabel: string;
  className?: string;
  hideFinish?: boolean;
};

export default function Footer({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevLabel,
  nextLabel,
  className = "",
  hideFinish = false,
}: FooterProps) {
  return (
    <div
      className={`fixed bottom-0 z-50 left-0 right-0 lg:left-80 lg:right-72 ${className}`}
    >
      <div className="flex border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <FooterButton
          side="prev"
          label={prevLabel}
          onClick={onPrev}
          disabled={prevDisabled}
        />

        {!hideFinish && (
          <FooterButton
            side="next"
            label={nextLabel}
            onClick={onNext}
            disabled={nextDisabled}
          />
        )}

        {hideFinish && (
          <FooterButton
            side="next"
            label="Dalej"
            onClick={onNext}
            disabled={nextDisabled}
          />
        )}
      </div>
    </div>
  );
}
