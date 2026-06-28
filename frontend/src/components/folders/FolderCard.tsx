import { FolderIcon, MoreHorizontalIcon } from "lucide-react";

interface Props {
  title: string;
  count: number;
  color: string;
  date: string;
}

const FolderCard = ({ title, count, color, date }: Props) => {
  return (
    <div
      className={`flex flex-col justify-between md:min-w-55 min-h-55 rounded-md p-4
 ${color}`}
    >
      <div>
        <div className="flex justify-between items-center text-gray-600">
          <FolderIcon className="cursor-pointer" size={30} strokeWidth={1} />
          <MoreHorizontalIcon className="cursor-pointer" strokeWidth={1} />
        </div>
        <h3 className="font-semibold text-md ">{title}</h3>

        <p className="mt-1 text-sm text-gray-700">{count} Notes</p>
      </div>
      <div className="flex justify-start items-baseline">
        <span className="text-sm text-gray-900">{date}</span>
      </div>
    </div>
  );
};

export default FolderCard;
