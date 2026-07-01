import { colorOptions } from "@/constant/colorPickerOptions";

interface Props {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ value, onChange }: Props) => {
  return (
    <div className="mb-8 flex gap-3">
      {colorOptions.map((color) => (
        <button
          key={color.value}
          aria-label={`Select color ${color.value}`}
          className={`h-10 w-10 rounded-full shadow-sm transition-transform ${color.className} ${
            value === color.value
              ? "ring-2 ring-offset-1 ring-gray-500 scale-110"
              : "hover:scale-105"
          }`}
          type="button"
          onClick={() => onChange(color.value)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
