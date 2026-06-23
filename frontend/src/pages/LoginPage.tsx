import { Form, Input, Button, Separator } from "@heroui/react";

import { GoogleIcon } from "@/assets/icons";

const LoginPage: React.FC = () => {
  return (
    <main>
      <div className="flex flex-col justify-center items-center">
        <img alt="bee moving" src="../assets/icons8-bee.gif" />
        <h1>Welcome to Not-lify</h1>
        <span>Sign up and start taking notes.</span>
      </div>

      <Form className="flex flex-col justify-center w-[90%]">
        <div>
          <Input
            className="h-[30px] w-[90%] p-4 border border-gray-300 outline-none offset-none"
            placeholder="email"
          />
          <Input
            className="h-[30px] w-[90%] p-4 border border-gray-300 outline-none offset-none"
            placeholder="password"
          />
          <Button className="p-3 rounded-md">Sign Up</Button>
        </div>
        <Separator />
      </Form>
    </main>
  );
};

export default LoginPage;
