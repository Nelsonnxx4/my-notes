const TagSelector = () => {
  return (
    <div className="mb-8 flex gap-2">
      <span className="rounded-full bg-white px-4 py-2 text-sm">#meeting</span>

      <span className="rounded-full bg-white px-4 py-2 text-sm">#project</span>

      <button className="rounded-full bg-primary px-4 py-2 text-sm text-white">
        +
      </button>
    </div>
  );
};

export default TagSelector;
