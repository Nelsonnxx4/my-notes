// pages/ProfilePage.tsx

export default function ProfilePage() {
  return (
    <main className="p-5">
      <div className="flex flex-col items-center">
        <img
          src="https://i.pravatar.cc/150"
          alt=""
          className="h-24 w-24 rounded-full"
        />

        <h2 className="mt-4 text-2xl font-bold">Nelson</h2>

        <p className="text-gray-500">243 Notes</p>
      </div>

      <div className="mt-8 space-y-3">
        <button className="w-full rounded-2xl bg-white p-4 text-left">
          Appearance
        </button>

        <button className="w-full rounded-2xl bg-white p-4 text-left">
          Notifications
        </button>

        <button className="w-full rounded-2xl bg-white p-4 text-left">
          Storage
        </button>
      </div>
    </main>
  );
}
