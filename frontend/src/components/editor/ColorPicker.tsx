const colorOptions = [
  { value: "#FCEAA8", className: "bg-[#FCEAA8]" },
  { value: "#F7CBE9", className: "bg-[#F7CBE9]" },
  { value: "#CFEFFF", className: "bg-[#CFEFFF]" },
  { value: "#D8F5C8", className: "bg-[#D8F5C8]" },
  { value: "#FADFCF", className: "bg-[#FADFCF]" },
];

const ColorPicker = () => {
  return (
    <div className="mb-8 flex gap-3">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          aria-label={`Select color ${color.value}`}
          className={`
            h-10
            w-10
            rounded-full
            border-2
            border-white
            shadow-sm
            ${color.className}
          `}
          title={`Select color ${color.value}`}
          type="button"
        >
          <span className="sr-only">{`Select color ${color.value}`}</span>
        </button>
      ))}
    </div>
  );
};

export default ColorPicker;
