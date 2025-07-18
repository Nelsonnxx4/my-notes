interface INavFooterProps {}

const NavFooter: React.FC<INavFooterProps> = () => {
  return (
    <footer className="absolute bottom-3 left-1/2 translate-x-[-50%] mt-3">
      <div className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-500 cursor-pointer h-12 w-12 rounded-full shadow-md">
        <span className="text-white text-2xl">+</span>
      </div>
    </footer>
  );
};

export default NavFooter;
