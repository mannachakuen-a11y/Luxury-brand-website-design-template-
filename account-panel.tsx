"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/client";
import { formatDate, money } from "@/lib/format";
import type { HouseOrder } from "@/lib/types";

export function AccountPanel({
  customerName,
  orders,
}: {
  customerName: string | null;
  orders: HouseOrder[];
}) {
  const router = useRouter();
  if (!customerName) return <AuthForms />;

  return (
    <div>
      <p className="label text-taupe">Account</p>
      <h1 className="mt-4 font-serif text-6xl lg:text-7xl">Bonjour, {customerName.split(" ")[0]}.</h1>
      <div className="mt-8 flex gap-6">
        <Link href="/wishlist" className="link-line">
          Wishlist
        </Link>
        <button
          className="label text-taupe"
          onClick={async () => {
            await request("/api/auth", { json: { action: "logout" } });
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>
      <div className="mt-16">
        <p className="label text-taupe">Orders</p>
        {orders.length === 0 ? (
          <p className="mt-6 font-serif text-3xl">No orders yet.</p>
        ) : (
          <div className="mt-6">
            {orders.map((order) => (
              <Link key={order.number} href={`/order/${order.number}`} className="grid gap-2 border-t border-line py-6 sm:grid-cols-4 sm:items-center">
                <span className="font-serif text-2xl">{order.number}</span>
                <span className="text-sm text-taupe">{formatDate(order.createdAt)}</span>
                <span className="text-sm capitalize">{order.status}</span>
                <span className="text-sm sm:text-right">{money(order.total)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthForms() {
  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <AuthForm
        title="Sign in"
        action="login"
        submit="Enter"
        note="Private client preview — client@jonglei.com · nocturne1924"
      />
      <AuthForm title="Open an account" action="register" submit="Create" showName />
    </div>
  );
}

function AuthForm({
  title,
  action,
  submit,
  note,
  showName = false,
}: {
  title: string;
  action: "login" | "register";
  submit: string;
  note?: string;
  showName?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        setError("");
        try {
          await request("/api/auth", {
            json: {
              action,
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              password: String(form.get("password") ?? ""),
            },
          });
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Please try again.");
          setPending(false);
        }
      }}
    >
      <h2 className="font-serif text-5xl">{title}</h2>
      {showName ? (
        <label className="mt-8 block text-sm">
          <span className="label text-taupe">Name</span>
          <input name="name" required className="field mt-2" />
        </label>
      ) : null}
      <label className="mt-6 block text-sm">
        <span className="label text-taupe">Email</span>
        <input name="email" type="email" required className="field mt-2" />
      </label>
      <label className="mt-6 block text-sm">
        <span className="label text-taupe">Password</span>
        <input name="password" type="password" required minLength={action === "register" ? 8 : 1} className="field mt-2" />
      </label>
      {error ? <p className="mt-4 text-sm">{error}</p> : null}
      {note ? <p className="mt-4 text-xs leading-5 text-taupe">{note}</p> : null}
      <button disabled={pending} className="mt-8 h-14 w-full bg-ink text-paper label disabled:opacity-50">
        {pending ? "Please wait" : submit}
      </button>
    </form>
  );
}
