"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { request } from "@/lib/client";
import { money } from "@/lib/format";
import { COUNTRIES, shippingCost, shippingLabel } from "@/lib/house";
import type { CartLine } from "@/lib/types";

export function CheckoutForm({
  lines,
  email,
  name,
}: {
  lines: CartLine[];
  email?: string;
  name?: string;
}) {
  const router = useRouter();
  const [method, setMethod] = useState("standard");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.price * line.quantity, 0), [lines]);
  const shipping = shippingCost(subtotal, method);
  const total = subtotal + shipping;

  return (
    <form
      className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        setError("");
        try {
          const data = await request("/api/checkout", {
            json: {
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              phone: String(form.get("phone") ?? ""),
              address: String(form.get("address") ?? ""),
              city: String(form.get("city") ?? ""),
              postal: String(form.get("postal") ?? ""),
              country: String(form.get("country") ?? ""),
              shippingMethod: method,
            },
          });
          router.push(`/order/${data.number}`);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Please try again.");
          setPending(false);
        }
      }}
    >
      <div>
        <p className="label text-taupe">Delivery</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Field label="Name" name="name" defaultValue={name} required className="sm:col-span-2" />
          <Field label="Email" name="email" type="email" defaultValue={email} required />
          <Field label="Telephone" name="phone" type="tel" />
          <Field label="Address" name="address" required className="sm:col-span-2" />
          <Field label="City" name="city" required />
          <Field label="Postal code" name="postal" required />
          <label className="sm:col-span-2 text-sm">
            <span className="label text-taupe">Country</span>
            <select name="country" required className="field mt-2" defaultValue="France">
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-12">
          <p className="label text-taupe">Dispatch</p>
          <div className="mt-5 space-y-4">
            {[
              { id: "standard", title: "Standard salon delivery", note: subtotal >= 50000 ? "Complimentary" : money(3500) },
              { id: "express", title: "Express atelier dispatch", note: money(4500) },
            ].map((option) => (
              <label key={option.id} className="flex cursor-pointer items-center justify-between border-b border-line py-4">
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={method === option.id}
                    onChange={() => setMethod(option.id)}
                  />
                  <span>{option.title}</span>
                </span>
                <span className="text-sm text-taupe">{option.note}</span>
              </label>
            ))}
          </div>
        </div>
        {error ? <p className="mt-6 text-sm">{error}</p> : null}
        <button disabled={pending} className="mt-10 h-14 w-full bg-ink text-paper label disabled:opacity-50">
          {pending ? "Placing order" : "Place order"}
        </button>
        <p className="mt-4 text-xs leading-5 text-taupe">
          By placing this order you agree to the house terms. The salon confirms dispatch against this order; no card is taken on this page.
        </p>
      </div>
      <aside className="h-fit lg:sticky lg:top-28">
        <p className="label text-taupe">Order</p>
        <div className="mt-6 space-y-5">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-4">
              <img src={line.image} alt="" className="h-24 w-16 object-cover grade" />
              <div className="flex-1">
                <p className="font-serif text-2xl leading-none">{line.name}</p>
                <p className="mt-2 text-sm text-taupe">
                  {line.color} / {line.size} · {line.quantity}
                </p>
              </div>
              <p className="text-sm">{money(line.price * line.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-3 border-t border-line pt-5 text-sm">
          <Row label="Subtotal" value={money(subtotal)} />
          <Row label={shippingLabel(method)} value={shipping === 0 ? "Complimentary" : money(shipping)} />
          <Row label="Total" value={money(total)} />
        </div>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="label text-taupe">{label}</span>
      <input name={name} type={type} required={required} defaultValue={defaultValue} className="field mt-2" />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
