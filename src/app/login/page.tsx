"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import db from "../../lib/db";
import { Button, Card, Input, Label } from "../../components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, user, error } = db.useAuth();

  React.useEffect(() => {
    if (user) router.replace("/");
  }, [router, user]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-[color:var(--background)] px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-black/70 border border-black/10">
            BrewManager
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Log in with a 6-digit code. No passwords needed.
          </p>
        </div>

        <div className="mt-6">
          <Card>
            {error ? (
              <div className="mb-3 rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
                {error.message}
              </div>
            ) : null}
            <MagicCodeForm />
          </Card>
        </div>

        <div className="mt-6 text-center text-xs text-black/50">
          Tip: use your work email so your data stays tied to your account.
        </div>
      </div>
    </div>
  );
}

function MagicCodeForm() {
  const [sentEmail, setSentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSend = useMemo(() => email.trim().length > 3 && email.includes("@"), [
    email,
  ]);
  const canVerify = useMemo(() => code.trim().length >= 4, [code]);

  async function send() {
    setErr(null);
    setBusy(true);
    try {
      const normalized = email.trim().toLowerCase();
      setSentEmail(normalized);
      await db.auth.sendMagicCode({ email: normalized });
    } catch (e: any) {
      setSentEmail("");
      setErr(e?.body?.message ?? e?.message ?? "Could not send code.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setErr(null);
    setBusy(true);
    try {
      await db.auth.signInWithMagicCode({
        email: sentEmail,
        code: code.trim(),
      });
    } catch (e: any) {
      setCode("");
      setErr(e?.body?.message ?? e?.message ?? "Invalid code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {!sentEmail ? (
        <>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <Button onClick={send} disabled={!canSend || busy} className="w-full">
            {busy ? "Sending..." : "Send verification code"}
          </Button>
        </>
      ) : (
        <>
          <div className="rounded-xl bg-black/5 px-3 py-2 text-sm text-black/70">
            Code sent to <span className="font-semibold">{sentEmail}</span>
          </div>
          <div>
            <Label>6-digit code</Label>
            <Input
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
          </div>
          <Button
            onClick={verify}
            disabled={!canVerify || busy}
            className="w-full"
          >
            {busy ? "Verifying..." : "Verify and sign in"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setSentEmail("");
              setCode("");
              setErr(null);
            }}
            disabled={busy}
            className="w-full"
          >
            Use a different email
          </Button>
        </>
      )}

      {err ? (
        <div className="rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {err}
        </div>
      ) : null}
    </div>
  );
}

