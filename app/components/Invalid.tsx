import { FileWarning } from "lucide-react";
import Link from "next/link";
import React from "react";

interface InvalidProps {
  title?: string;
  message?: string;
}

export default function Invalid({
  title = "Invalid Quiz",
  message = "This quiz does not exist or is no longer available.",
}: InvalidProps) {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center px-6 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-[hsl(var(--primary))]/10 p-4 text-[hsl(var(--primary))]">
        <FileWarning className="h-10 w-10" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-[hsl(var(--muted-foreground))]">
        {message}
      </p>

      {/* Optional CTA */}
      <Link
        href="/"
        className="bg-primary text-background mt-6 rounded-sm px-15 py-2.5 transition hover:opacity-90"
      >
        Refresh
      </Link>
    </div>
  );
}
