const FolderSelector = () => {
  const folderOption = ["Personal", "Work", "Ideas", "Travels"];

  return (
    <select
      aria-label="folder selector"
      className="
      mb-6
      rounded-full
      bg-white
      px-4
      py-2
      text-sm
      shadow-sm
      outline-none
    "
    >
      {folderOption.map((option, index) => (
        <option key={index}>{option}</option>
      ))}
    </select>
  );
};

export default FolderSelector;
