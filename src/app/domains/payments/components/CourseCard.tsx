type CourseCardProps = {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string;
    price: string;
    selected: boolean;
    onSelect: (id: string) => void;
  };
  
  export default function CourseCard({
    id,
    title,
    description,
    level,
    duration,
    price,
    selected,
    onSelect,
  }: CourseCardProps) {
    return (
      <div
        onClick={() => onSelect(id)}
        className={`rounded-lg p-6 flex flex-col gap-4 shadow-sm transition cursor-pointer
          hover:shadow-md hover:scale-[1.02]
          ${selected ? "bg-green-50 border-2 border-green-600" : "border border-gray-200 bg-white"}
        `}
      >
        <h3 className="font-semibold text-[20px] leading-8 text-green-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex items-center gap-2">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">{level}</span>
          <span className="text-xs">{duration}</span>
          <span className="ml-auto font-semibold text-green-700">{price}</span>
        </div>
      </div>
    );
  }
  