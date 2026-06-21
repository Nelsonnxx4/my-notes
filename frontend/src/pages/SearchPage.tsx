// pages/SearchPage.tsx

import SearchInput from "@/components/ui/SearchInput";

export default function SearchPage() {
  return (
    <main className="p-5">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>

      <SearchInput />

      <div className="mt-8">
        <h2 className="font-semibold">Recent Searches</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-4 py-2">React</span>

          <span className="rounded-full bg-white px-4 py-2">Design</span>

          <span className="rounded-full bg-white px-4 py-2">Meeting</span>
        </div>
      </div>
    </main>
  );
}
