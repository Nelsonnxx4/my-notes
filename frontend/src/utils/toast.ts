import { addToast, type ToastProps } from "@heroui/react";

type ToastSeverity = NonNullable<ToastProps["severity"]>;

interface NotifyOptions {
  title: string;
  description?: string;
  severity?: ToastSeverity;
}

export function notify({
  title,
  description,
  severity = "default",
}: NotifyOptions) {
  addToast({
    title,
    description,
    severity,
    timeout: 5000,
    shouldShowTimeoutProgress: true,
  });
}

export function getToastErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;

  return "Please try again.";
}
