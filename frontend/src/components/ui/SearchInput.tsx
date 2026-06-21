// components/ui/SearchInput.tsx

import { Search } from "lucide-react";

export default function SearchInput() {
	return (
		<div className="relative">
			<Search
				size={18}
				className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
			/>

			<input
				placeholder="Search notes..."
				className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 shadow-sm outline-none"
			/>
		</div>
	);
}
