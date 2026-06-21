import { House, Notebook, Search, Folder, User } from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
	{
		path: "/",
		icon: House,
	},
	{
		path: "/notes",
		icon: Notebook,
	},
	{
		path: "/search",
		icon: Search,
	},
	{
		path: "/folders",
		icon: Folder,
	},
	{
		path: "/profile",
		icon: User,
	},
];

export default function BottomNavbar() {
	return (
		<div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 rounded-full bg-white p-3 shadow-xl">
			<div className="flex items-center justify-around">
				{links.map(({ path, icon: Icon }) => (
					<NavLink
						key={path}
						to={path}
						className={({ isActive }) =>
							isActive
								? "rounded-full bg-primary p-3 text-white"
								: "p-3 text-gray-500"
						}
					>
						<Icon size={20} />
					</NavLink>
				))}
			</div>
		</div>
	);
}
