// pages/HomePage.tsx

import SearchInput from "@/components/ui/SearchInput";
import CategoryChip from "@/components/ui/CategoryChip";
import NoteCard from "@/components/notes/NoteCard";

const notes = [
	{
		title: "Meeting Notes",
		content: "Discuss onboarding improvements and sprint planning.",
		color: "#FCEAA8",
	},
	{
		title: "Travel Plans",
		content: "Book hotel and prepare itinerary for Lagos trip.",
		color: "#CFEFFF",
	},
];

export default function HomePage() {
	return (
		<main className="px-5 pt-10">
			<h1 className="mb-1 text-3xl font-bold">Good Morning 👋</h1>

			<p className="mb-6 text-gray-500">Capture your ideas instantly.</p>

			<SearchInput />

			<div className="mt-6 flex gap-2 overflow-x-auto">
				<CategoryChip title="All" active />

				<CategoryChip title="Work" />

				<CategoryChip title="Ideas" />

				<CategoryChip title="Travel" />

				<CategoryChip title="Personal" />
			</div>

			<div className="mt-8">
				<h2 className="mb-4 text-xl font-semibold">Recent Notes</h2>

				<div className="grid gap-4">
					{notes.map((note) => (
						<NoteCard key={note.title} {...note} />
					))}
				</div>
			</div>
		</main>
	);
}
