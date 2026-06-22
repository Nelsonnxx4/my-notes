import { Input, Breadcrumbs, Select } from "@heroui/react";
import { SearchIcon } from "lucide-react";

import { FilterIcon } from "@/assets/icons";

interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  return (
    <header className="flex items-start gap-6 flex-col p-2 border-b border-gray-200 mb-4">
      <Breadcrumbs>
        <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">All Notes</Breadcrumbs.Item>
      </Breadcrumbs>

      <section>
        <div>
          <SearchIcon />
          <Input placeholder="Search a note" />
        </div>

        <div>
          <div>
            <FilterIcon />
            <Select />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
