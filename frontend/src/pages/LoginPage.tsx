import { Button } from "@heroui/button";

import { GoogleIcon } from "@/assets/icons";

interface ILoginPageProps {}

const LoginPage: React.FC<ILoginPageProps> = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-8 
                     md:max-w-2xl md:flex md:items-center md:gap-12 md:p-12"
      >
        {/* Left Column - Branding */}
        <div className="md:w-1/2 md:space-y-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-indigo-600 md:text-3xl">
              Just Notes
            </h3>
          </div>

          <div className="text-center space-y-2 md:text-left md:space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Think it, jot it, do it
            </h1>
            <p className="text-gray-600 md:text-lg">
              Plan, remember, and conquer your day and maybe tell me some
              secrets too.
            </p>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="md:w-1/2">
          <section className="space-y-6">
            {/* Login Button */}
            <Button
              className="w-full py-3 bg-white border border-gray-300 rounded-lg 
                         text-gray-700 font-medium hover:bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         md:py-3.5"
              startContent={<GoogleIcon className="w-5 h-5" />}
            >
              Continue with Google
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 md:text-base">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
