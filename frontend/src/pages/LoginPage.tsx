import { Button } from "@heroui/button";

import { GoogleIcon } from "@/assets/icons";

interface ILoginPageProps {}

const LoginPage: React.FC<ILoginPageProps> = () => {
  return (
    <main>
      <h3>Just Notes</h3>
      <section>
        <div>
          <h1>Think it, jot it, do it</h1>
          <p>
            Plan, remember, and conquer your day and maybe tell me some secrets
            too.
          </p>
        </div>
        <Button startContent={<GoogleIcon />}>Login with Google</Button>
      </section>
    </main>
  );
};

export default LoginPage;
