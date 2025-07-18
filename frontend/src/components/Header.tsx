import { Input } from "@heroui/input";

import { FilterIcon } from "@/assets/icons";

interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  return (
    <header className="flex items-start gap-6 flex-col p-2 border-b border-gray-200 mb-4">
      <div className="flex justify-between items-center w-full">
        <h3 className="font-bold text-indigo-600 text-2xl">Just Notes</h3>
        <picture className="bg-black rounded-full h-8 w-8 border-2 border-indigo-400">
          <img alt="" src="" />
        </picture>
      </div>
      <div className="flex justify-between items-center w-full">
        <Input className="max-w-[80%] " placeholder="Search for notes" />
        <FilterIcon className="cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;
