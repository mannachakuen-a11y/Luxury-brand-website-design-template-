"use client";

import { useState } from "react";
import { request } from "@/lib/client";

export function NewsletterForm({ label = "Correspondence", button = "Join" }: { label?: string; button?: string }) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="max-w-md"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setNote("");
        try {
          await request("/api/newsletter", { json: { email } });
          setEmail("");
          setNote("You are on the list.");
        } catch (error) {
          setNote(error instanceof Error ? error.message : "Please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label htmlFor="newsletter" className="label text-taupe">
        {label}
      </label>
      <div className="mt-3 flex items-end gap-4">
        <input
          id="newsletter"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="field"
        />
        <button className="label mb-3 shrink-0 border-b border-ink pb-1" disabled={pending}>
          {pending ? "Sending" : button}
        </button>
      </div>
      {note ? <p className="mt-3 text-sm text-taupe">{note}</p> : null}
    </form>
  );
}
