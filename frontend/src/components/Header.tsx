import { Input, Breadcrumbs, Select, ListBox, Label } from "@heroui/react";
import { SearchIcon, LayoutListIcon, LayoutGridIcon } from "lucide-react";

import { FilterIcon } from "@/assets/icons";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 md:left-[260px] z-50 w-full md:w-[calc(100%-260px)] bg-white flex items-start gap-3 flex-col px-4 py-6 border-b border-gray-200 h-[113px]">
      <Breadcrumbs className="flex justify-between items-center">
        <Breadcrumbs.Item className="flex items-center text-gray-500" href="#">
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">All Notes</Breadcrumbs.Item>
      </Breadcrumbs>

      <section className="w-full flex justify-between items-center">
        <div className="flex bg-gray-100 w-[30%] h-[30px] px-2 py-1 rounded-md border border-gray-200">
          <SearchIcon className="text-gray-400" size={20} strokeWidth={1.5} />
          <Input
            className="bg-gray-100 ml-2 w-full outline-none border-none offset-none"
            placeholder="Search a note"
          />
        </div>

        <div className="flex justify-between items-center w-[30%]">
          <div className="flex ">
            <FilterIcon />
            {/* <Select
              className="w-[250px]"
              placeholder=""
              selectionMode="multiple"
            >
              <Label>Filter</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox selectionMode="multiple">
                  <ListBox.Item id="argentina" textValue="Argentina">
                    Argentina
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="venezuela" textValue="Venezuela">
                    Venezuela
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="japan" textValue="Japan">
                    Japan
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="france" textValue="France">
                    France
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="italy" textValue="Italy">
                    Italy
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="spain" textValue="Spain">
                    Spain
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="thailand" textValue="Thailand">
                    Thailand
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="new-zealand" textValue="New Zealand">
                    New Zealand
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="iceland" textValue="Iceland">
                    Iceland
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select> */}
          </div>
          <div className="flex ">
            <LayoutListIcon />
            <LayoutGridIcon />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
