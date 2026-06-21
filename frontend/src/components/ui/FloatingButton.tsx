// components/ui/FloatingButton.tsx

import { Plus } from "lucide-react";

const FloatingButton = () => {
	return (
		<button
			className="
      fixed
      bottom-28
      right-5
      flex
      h-16
      w-16
      items-center
      justify-center
      rounded-full
      bg-primary
      text-white
      shadow-xl
    "
		>
			<Plus size={28} />
		</button>
	);
};
export default FloatingButton;
