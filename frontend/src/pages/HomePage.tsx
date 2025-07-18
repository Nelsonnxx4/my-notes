import Header from "@/components/Header";
import NavFooter from "@/components/NavFooter";
import NotesContainer from "@/components/NotesContainer";

interface IHomePageProps {}

const HomePage: React.FC<IHomePageProps> = () => {
  return (
    <main>
      <Header />
      <NotesContainer />
      <NavFooter />
    </main>
  );
};

export default HomePage;
