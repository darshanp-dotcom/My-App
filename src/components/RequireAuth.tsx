"use client";

import React from "react";
import { useRouter } from "next/navigation";
import db from "../lib/db";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, user, error } = db.useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, router, user]);

  if (isLoading) return null;
  if (error) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] p-6 text-bm-danger">
        {error.message}
      </div>
    );
  }
  if (!user) return null;

  return <db.SignedIn>{children}</db.SignedIn>;
}

