import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button, Form } from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";

import { GoogleIcon } from "@/assets/icons";
import { loginApi, registerApi, googleAuthApi } from "@/api/auth.api";
import BrandMark from "@/components/BrandMark";
import { useAuth } from "@/contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const isSignUp = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<"email" | "password" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const passwordFieldRef = useRef<HTMLDivElement>(null);
  const { setCredentials } = useAuth();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const markPasswordInvalid = () => {
    setFieldError("password");
    const field = passwordFieldRef.current;

    if (!field) return;
    field.classList.remove("field-shake");
    void field.offsetWidth;
    field.classList.add("field-shake");
  };

  const validate = () => {
    if (!email.trim()) {
      setFormError("Email is required.");
      setFieldError("email");

      return false;
    }
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      markPasswordInvalid();

      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setFieldError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const result = isSignUp
        ? await registerApi({ email, password })
        : await loginApi({ email, password });

      setCredentials(result);
      navigate("/home", { replace: true });
    } catch (error: any) {
      if (!isSignUp) markPasswordInvalid();
      setFormError(
        error?.response?.data?.message ??
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      setFormError(null);
      setIsLoading(true);
      try {
        const result = await googleAuthApi(tokenResponse.access_token);

        setCredentials(result);
        navigate("/home", { replace: true });
      } catch (error: any) {
        setFormError(
          error?.response?.data?.message ??
            "Google sign-in failed. Please try again or use email.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      setFormError(
        errorResponse.error_description ??
          "Google sign-in failed. Please try again or use email.",
      );
    },
    onNonOAuthError: (error) => {
      setFormError(
        error.type === "popup_closed"
          ? "Google sign-in was closed before it finished."
          : "Google sign-in popup could not open. Please disable popup blockers and try again.",
      );
    },
  });

  const startGoogleLogin = () => {
    setFormError(null);
    if (!googleClientId) {
      setFormError("Google sign-in is not configured for this app.");

      return;
    }
    handleGoogleLogin();
  };

  const clearFieldError = () => {
    setFormError(null);
    setFieldError(null);
  };

  return (
    <main className="grid min-h-screen bg-[var(--app-ground)] lg:grid-cols-[minmax(28rem,0.82fr)_1.18fr]">
      <section className="flex min-h-screen flex-col bg-[var(--app-surface)] px-5 py-6 sm:px-10 lg:px-14">
        <Link
          className="flex w-fit items-center gap-2 text-sm font-semibold tracking-[-0.01em] text-[var(--app-text)]"
          to="/"
        >
          <BrandMark className="h-8 w-8" />
          Not-lify
        </Link>

        <div className="ui-enter my-auto w-full max-w-sm py-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--app-focus)]">
            {isSignUp ? "Create your workspace" : "Return to your workspace"}
          </p>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--app-text)]">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mb-8 mt-3 max-w-xs text-sm leading-6 text-[var(--app-muted)]">
            {isSignUp
              ? "A quiet place for notes that remain useful, even when you are offline."
              : "Pick up exactly where your last thought stopped."}
          </p>

          {searchParams.get("error") && (
            <div className="mb-5 flex items-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-negative)] bg-[var(--app-danger-soft)] p-3 text-sm text-[var(--app-negative)]">
              <AlertCircle className="shrink-0" size={16} />
              Google sign-in failed. Please try again or use email.
            </div>
          )}

          <Button
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-border)] bg-[var(--app-surface)] text-sm font-medium text-[var(--app-text)] hover:bg-[var(--app-raised)]"
            isDisabled={isLoading}
            onPress={startGoogleLogin}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 before:h-px before:flex-1 before:bg-[var(--app-rule)] after:h-px after:flex-1 after:bg-[var(--app-rule)]">
            <span className="whitespace-nowrap text-xs text-[var(--app-faint)]">
              or continue with email
            </span>
          </div>

          {formError && (
            <div
              aria-live="polite"
              className="mb-4 flex w-full items-start gap-2 rounded-[var(--app-radius-control)] border border-[var(--app-negative)] bg-[var(--app-danger-soft)] p-3 text-sm text-[var(--app-negative)]"
            >
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <span>{formError}</span>
            </div>
          )}

          <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
            <div
              className={
                fieldError === "email"
                  ? "auth-field-error relative w-full"
                  : "relative w-full"
              }
            >
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                required
                aria-invalid={fieldError === "email"}
                className="h-11 w-full rounded-[var(--app-radius-control)] border border-[var(--app-control)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-faint)] hover:border-[var(--app-muted)] focus:border-[var(--app-focus)]"
                id="email"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(event) => {
                  clearFieldError();
                  setEmail(event.target.value);
                }}
              />
            </div>

            <div
              ref={passwordFieldRef}
              className={
                fieldError === "password"
                  ? "auth-field-error relative w-full"
                  : "relative w-full"
              }
              onAnimationEnd={() =>
                passwordFieldRef.current?.classList.remove("field-shake")
              }
            >
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                required
                aria-invalid={fieldError === "password"}
                className="h-11 w-full rounded-[var(--app-radius-control)] border border-[var(--app-control)] bg-[var(--app-surface)] px-3 pr-11 text-sm text-[var(--app-text)] outline-none placeholder:text-[var(--app-faint)] hover:border-[var(--app-muted)] focus:border-[var(--app-focus)]"
                id="password"
                placeholder={
                  isSignUp ? "At least 6 characters" : "Your password"
                }
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  clearFieldError();
                  setPassword(event.target.value);
                }}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[var(--app-radius-control)] text-[var(--app-faint)] hover:bg-[var(--app-raised)] hover:text-[var(--app-text)]"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-1.5 text-right">
                <a
                  className="text-xs text-[var(--app-muted)] hover:text-[var(--app-text)] hover:underline"
                  href="mailto:support@not-lify.com?subject=Password reset"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--app-radius-control)] bg-[var(--app-primary)] text-sm font-semibold text-[var(--app-ground)] hover:opacity-90 disabled:opacity-50"
              isDisabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="animate-spin" size={15} />}
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </Form>

          <p className="mt-6 text-center text-sm text-[var(--app-muted)]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              className="font-semibold text-[var(--app-text)] hover:underline"
              to={isSignUp ? "/auth/login" : "/auth/signup"}
            >
              {isSignUp ? "Sign in" : "Sign up free"}
            </Link>
          </p>

          {isSignUp && (
            <p className="mt-4 text-center text-xs leading-relaxed text-[var(--app-faint)]">
              By signing up you agree to our{" "}
              <Link
                className="underline hover:text-[var(--app-text)]"
                to="/terms"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                className="underline hover:text-[var(--app-text)]"
                to="/privacy"
              >
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>

        <p className="text-xs text-[var(--app-faint)]">
          Private by default · Available offline
        </p>
      </section>

      <section className="relative hidden overflow-hidden border-l border-[var(--app-border)] bg-[var(--app-raised)] px-12 py-16 lg:flex lg:items-center lg:justify-center">
        <div className="ui-enter ui-enter-late w-full max-w-xl">
          <div className="mb-7 flex items-center justify-between text-xs text-[var(--app-muted)]">
            <span>THE WRITING LEDGER</span>
            <span>SYNCED WHEN READY</span>
          </div>
          <div className="relative border border-[var(--app-control)] bg-[var(--app-surface)] p-8">
            <span className="absolute inset-y-8 left-0 w-0.5 bg-[var(--app-focus)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-faint)]">
              Last open thought
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--app-text)]">
              Ideas stay close enough to continue.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--app-muted)]">
              Resume a note, capture a fragment, and let organisation happen
              around the writing.
            </p>
            <div className="mt-12 grid grid-cols-3 border-t border-[var(--app-rule)] pt-5 text-xs text-[var(--app-muted)]">
              <span>01 Capture</span>
              <span>02 Connect</span>
              <span>03 Continue</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
