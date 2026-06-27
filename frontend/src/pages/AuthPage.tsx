import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button, Form, Input, Separator } from "@heroui/react";

// import { ToastContainer } from "@/components/Toast";
// import { useAuth } from "@/contexts/AuthContext";
import { GoogleIcon } from "@/assets/icons";
// import { usePopToast } from "@/hooks/useToast";
// import { useSignUp, useSignIn, useGoogleSignIn } from "@/hooks/useAuthMutation";
// import { getAuthErrorMessage, validateAuthForm } from "@/services/validation";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const isSignUp = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // const { user } = useAuth();
  const navigate = useNavigate();
  // const { toasts, addToast, removeToast } = usePopToast();

  // const signUpMutation = useSignUp();
  // const signInMutation = useSignIn();
  // const googleMutation = useGoogleSignIn();

  // const isLoading =
  //   signUpMutation.isPending ||
  //   signInMutation.isPending ||
  //   googleMutation.isPending;

  // const activeAuthError = isSignUp
  //   ? signUpMutation.error
  //   : signInMutation.error;
  // const authError =
  //   formError ||
  //   (activeAuthError instanceof Error
  //     ? getAuthErrorMessage(activeAuthError)
  //     : null) ||
  //   (googleMutation.error instanceof Error
  //     ? getAuthErrorMessage(googleMutation.error)
  //     : null);

  // const clearAuthErrors = () => {
  //   setFormError(null);
  //   signUpMutation.reset();
  //   signInMutation.reset();
  //   googleMutation.reset();
  // };

  // useEffect(() => {
  //   const oauthError = searchParams.get("error");

  //   if (oauthError) {
  //     addToast({
  //       description:
  //         "Something went wrong with Google sign-in. Please try again.",
  //       title: "Sign in failed",
  //       variant: "destructive",
  //     });
  //   }
  // }, [searchParams]);

  // useEffect(() => {
  //   if (user) navigate("/home", { replace: true });
  // }, [user, navigate]);

  // const validate = (): boolean => {
  //   const result = validateAuthForm({ email, password });

  //   if (!result.success) {
  //     const message = result.error.issues[0]?.message ?? "Invalid input";

  //     setFormError(message);
  //     addToast({
  //       description: message,
  //       title: "Validation Error",
  //       variant: "destructive",
  //     });

  //     return false;
  //   }

  //   return true;
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   clearAuthErrors();
  //   if (!validate()) return;
  //   if (isSignUp) {
  //     signUpMutation.mutate({ email, password });
  //   } else {
  //     signInMutation.mutate({ email, password });
  //   }
  // };

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      {/* <ToastContainer toasts={toasts} onRemove={removeToast} /> */}

      {/* ── Left: form column ── */}
      <section className="flex flex-col items-center justify-center px-8 py-12 bg-white">
        {/* Logo */}
        <div className=" w-full max-w-sm mb-4">
          <div className="flex flex-col items-start justify-between">
            <video
              aria-label="Not-lify bee animation"
              className="h-8 w-8"
              src="/icons8-bee.gif"
            >
              <track default kind="captions" src="/icons8-bee.vtt" />
            </video>
            <h1 className="text-xl font-semibold text-gray-600">Not-lify</h1>
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col items-start justify-start w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            {isSignUp
              ? "Sign up and start taking notes — free forever."
              : "Sign in to continue to your notes."}
          </p>

          {/* OAuth error banner */}
          {searchParams.get("error") && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-5">
              <AlertCircle className="shrink-0" size={16} />
              Google sign-in failed. Please try again or use email.
            </div>
          )}

          {/* Google */}
          <Button
            className="
              w-full flex items-center justify-center gap-2
              border border-gray-200 rounded-xl
              bg-white text-gray-700 text-sm font-medium
               py-2.5
              transition-all duration-200
              hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm cursor-pointer "
            // isLoading={googleMutation.isPending}
            // variant="bordered"
            // onPress={() => {
            //   clearAuthErrors();
            //   googleMutation.mutate();
            // }}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex justify-center items-center  my-6">
            {/* <Separator className="flex-1" /> */}
            <span className="text-sm  text-gray-400 whitespace-nowrap">
              or continue with email
            </span>
            {/* <Separator className="flex-1" /> */}
          </div>

          {/* Auth error */}
          {/* {authError && (
            <div
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{authError}</span>
            </div>
          )} */}

          {/* Form */}
          <Form
            className="w-full flex flex-col gap-4"
            // onSubmit={handleSubmit}
          >
            <Input
              required
              className="border border-gray-200 shadow-sm rounded-md bg-white hover:border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-300 focus:bg-gray-50 outline-none p-2"
              // label="Email address"
              placeholder="you@example.com"
              type="email"
              value={email}
              // onValueChange={(val) => {
              //   clearAuthErrors();
              //   setEmail(val);
              // }}
            />

            <div className="flex justify-between items-center w-full">
              <div className="relative w-full">
                <label className="sr-only">Password</label>
                <input
                  required
                  className="w-full border border-gray-200 shadow-sm rounded-md bg-white hover:border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-300 focus:bg-gray-50 outline-none p-2 pr-11"
                  placeholder={
                    isSignUp ? "At least 6 characters" : "Your password"
                  }
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            {!isSignUp && (
              <div className="text-right mt-1.5">
                <a
                  className="text-xs text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                  href="mailto:support@not-lify.com?subject=Password reset"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              className="
                w-full rounded-md outline-2 outline-offset-1 outline-accent-100 py-2.5
                bg-green-600 text-white text-sm font-semibold
                shadow-sm transition-all duration-150
                hover:bg-green-600/85 hover:shadow-md
                disabled:opacity-50 cursor-pointer
              "
              // isLoading={isLoading}
              type="submit"
            >
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </Form>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              className="text-gray-800 font-semibold hover:underline"
              to={isSignUp ? "/auth/login" : "/auth/signup"}
            >
              {isSignUp ? "Sign in" : "Sign up free"}
            </Link>
          </p>

          {/* Legal */}
          {isSignUp && (
            <p className="text-center text-xs text-gray-400 leading-relaxed mt-4">
              By signing up you agree to our{" "}
              <Link className="underline hover:text-gray-600" to="/terms">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link className="underline hover:text-gray-600" to="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* ── Right: illustration column ── */}
      <section className="hidden md:flex flex-col items-center justify-center bg-gray-50 px-12 py-16 border-l border-gray-100">
        <img
          alt="Illustration of a person organising notes"
          className="w-full max-w-md"
          src="/illustrations/login-illustration.svg"
        />
        <div className="mt-10 text-center max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 leading-snug">
            Your second mind, always ready.
          </h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            Capture thoughts, ideas, and tasks in seconds. Not-lify keeps
            everything organised so you never lose a good idea again.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
