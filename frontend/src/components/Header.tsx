import { Input, Breadcrumbs, BreadcrumbItem, Select, SelectItem } from "@heroui/react";
import {
  SearchIcon,
  LayoutGridIcon,
  FilterIcon,
  ChevronDown,
  Grid3x2Icon,
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
    <header className="fixed top-0 left-0 right-0 md:left-50 lg:left-50 xl:left-65 z-50 w-full lg:w-[81%] md:w-[74%] xl:w-[83%] bg-white flex items-start gap-3 flex-col px-4 md:px-4 lg:px-10 py-6 border-b border-gray-200 h-28">
      <Breadcrumbs className="flex justify-between items-center">
        <BreadcrumbItem className="flex items-center text-gray-500" href="#">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="#">All Notes</BreadcrumbItem>
      </Breadcrumbs>

      <section className="w-full flex justify-between items-center">
        <div className="flex items-center bg-gray-100 w-[30%] md:w-[40%] h-7.5 px-2 py-1 rounded-md border border-gray-200 transition-all duration-200 focus-within:bg-gray-50 focus-within:border-gray-400 focus-within:shadow-sm">
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

        <div className="flex justify-between items-center gap-2 w-[25%] md:w-[37%] lg:w-[37%] xl:w-max">
          <Select
            className="w-full lg:w-55 text-gray-700 text-xs"
            classNames={{
              trigger:
                "bg-gray-100 border border-slate-200 rounded-md px-3 py-1.5 shadow-sm data-[hover=true]:border-slate-400 data-[hover=true]:shadow-slate-200 data-[hover=true]:shadow-md data-[open=true]:bg-slate-50 data-[open=true]:border-slate-500 data-[open=true]:ring-2 data-[open=true]:ring-slate-300",
              value: "text-sm font-medium text-slate-400",
              popoverContent:
                "rounded-xl border border-slate-200 shadow-xl shadow-slate-300/40",
              listbox: "py-1.5",
            }}
            placeholder="Filter"
            selectionMode="multiple"
            selectorIcon={<ChevronDown size={15} strokeWidth={1.5} />}
            startContent={
              <FilterIcon
                className="text-slate-400 shrink-0"
                size={15}
                strokeWidth={1.5}
              />
            }
          >
            {countries.map(({ id, label }) => (
              <SelectItem key={id} textValue={label}>
                {label}
              </SelectItem>
            ))}
          </Select>
          <div className="flex justify-between items-center gap-2  bg-gray-100 p-1 rounded-sm border border-gray-200 ">
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
