import { Input, Breadcrumbs, Select, ListBox } from "@heroui/react";
import {
  SearchIcon,
  LayoutGridIcon,
  FilterIcon,
  ChevronDown,
  Grid3x2Icon,
  ChevronUp,
} from "lucide-react";

const Header: React.FC = () => {
  const countries = [
    { id: "argentina", label: "Argentina" },
    { id: "venezuela", label: "Venezuela" },
    { id: "japan", label: "Japan" },
    { id: "france", label: "France" },
    { id: "italy", label: "Italy" },
    { id: "spain", label: "Spain" },
    { id: "thailand", label: "Thailand" },
    { id: "new-zealand", label: "New Zealand" },
    { id: "iceland", label: "Iceland" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 md:left-65 z-50 w-full md:w-[calc(100%-260px)] bg-white flex items-start gap-3 flex-col px-4 md:px-16 py-6 border-b border-gray-200 h-28">
      <Breadcrumbs className="flex justify-between items-center">
        <Breadcrumbs.Item className="flex items-center text-gray-500" href="#">
          Home
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">All Notes</Breadcrumbs.Item>
      </Breadcrumbs>

      <section className="w-full flex justify-between items-center">
        <div className="flex items-center bg-gray-100 w-[30%] h-7.5 px-2 py-1 rounded-md border border-gray-200 transition-all duration-200 focus-within:bg-gray-50 focus-within:border-gray-400 focus-within:shadow-sm">
          <SearchIcon
            className="text-gray-400 transition-colors duration-200 focus-within:text-gray-600"
            size={20}
            strokeWidth={1.5}
          />
          <Input
            className="bg-transparent ml-2 w-full outline-none border-none text-sm text-gray-700 placeholder:text-gray-400"
            placeholder="Search a note"
          />
        </div>

        <div className="flex justify-between items-center w-[25%] ">
          <Select
            className="w-50 text-gray-700 text-xs"
            placeholder="Filter"
            selectionMode="multiple"
          >
            <Select.Trigger
              className="bg-gray-100
      flex items-center gap-2 w-full
      border border-slate-200 rounded-md px-3 py-1.5
      shadow-sm
      text-sm font-medium text-slate-600
      cursor-pointer outline-none
      transition-all duration-200
      hover:border-slate-400 hover:shadow-slate-200 hover:shadow-md
      focus:bg-slate-50 focus:border-slate-500 focus:ring-2 focus:ring-slate-300 focus:ring-offset-1
      data-open:bg-slate-50 data-open:border-slate-500 data-open:ring-2 data-open:ring-slate-300
    "
            >
              <FilterIcon
                className="text-slate-400 shrink-0"
                size={15}
                strokeWidth={1.5}
              />
              <Select.Value className="flex-1 text-left text-slate-400 data-placeholder:text-slate-400" />
              <Select.Indicator className="text-slate-400 transition-transform duration-200 data-open:rotate-180 shrink-0">
                <ChevronDown size={15} strokeWidth={1.5} />
              </Select.Indicator>
            </Select.Trigger>

            <Select.Popover
              className="
      z-50 mt-1.5 w-55
      rounded-xl
      bg-white
      border border-slate-200
      shadow-xl shadow-slate-300/40
      overflow-hidden
      animate-in fade-in-0 zoom-in-95
      duration-100
    "
            >
              <ListBox
                className="py-1.5 max-h-64 scrollbar-thin  overflow-y-auto"
                selectionMode="multiple"
              >
                {countries.map(({ id, label }) => (
                  <ListBox.Item
                    key={id}
                    className="

            group
            flex items-center justify-between
            px-4 py-2.5
            mb-1
            mx-1.5 rounded-lg
            text-sm font-medium text-slate-600
            cursor-pointer
            transition-colors duration-100
            hover:bg-slate-100 hover:text-slate-900
            data-selected:bg-slate-100 data-selected:text-slate-900
            focus:outline-none focus:bg-slate-100
          "
                    id={id}
                    textValue={label}
                  >
                    {label}
                    <ListBox.ItemIndicator
                      className="
              ml-auto
              flex h-4 w-4 items-center justify-center
              rounded-full
              border-2 border-slate-300
              transition-all duration-150
              group-data-selected:border-slate-700
              group-data-selected:bg-slate-700
            "
                    >
                      <ChevronUp className="h-2 w-2 text-white opacity-0 group-data-selected:opacity-100" />
                    </ListBox.ItemIndicator>
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <div className="flex justify-between items-center gap-2  bg-gray-100 p-1 rounded-sm border border-gray-200">
            <Grid3x2Icon
              className="text-gray-400 cursor-pointer hover:text-gray-800 transition-all"
              strokeWidth={1.5}
            />
            <LayoutGridIcon
              className="text-gray-400 cursor-pointer hover:text-gray-800 transition-all"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;
