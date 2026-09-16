const FolderSelector = () => {
  const folderOption = ["Personal", "Work", "Ideas", "Travels"];

  return (
    <select
      aria-label="folder selector"
      className="
      mb-6
      rounded-full
      bg-white
      dark:bg-gray-900
      dark:text-gray-100
      px-4
      py-2
      text-sm
      shadow-sm
      dark:border
      dark:border-gray-800
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
