import { Suspense } from "react";
import AuthClient from "./AuthClient";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-tasino-muted">
          در حال بارگذاری...
        </div>
      }
    >
      <AuthClient />
    </Suspense>
  );
}
