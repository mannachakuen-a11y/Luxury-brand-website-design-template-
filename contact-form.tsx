"use client";

import { useState } from "react";
import { request } from "@/lib/client";

export function ContactForm({ subject = "Salon appointment" }: { subject?: string }) {
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="max-w-xl"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setPending(true);
        setNote("");
        try {
          await request("/api/contact", {
            json: {
              name: String(form.get("name") ?? ""),
              email: String(form.get("email") ?? ""),
              subject: String(form.get("subject") ?? ""),
              body: String(form.get("body") ?? ""),
            },
          });
          event.currentTarget.reset();
          setNote("The salon has received your note.");
        } catch (error) {
          setNote(error instanceof Error ? error.message : "Please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label className="block text-sm">
        <span className="label text-taupe">Name</span>
        <input name="name" required className="field mt-2" />
      </label>
      <label className="mt-6 block text-sm">
        <span className="label text-taupe">Email</span>
        <input name="email" type="email" required className="field mt-2" />
      </label>
      <label className="mt-6 block text-sm">
        <span className="label text-taupe">Subject</span>
        <input name="subject" required defaultValue={subject} className="field mt-2" />
      </label>
      <label className="mt-6 block text-sm">
        <span className="label text-taupe">Note</span>
        <textarea name="body" required className="field mt-2" placeholder="A fitting, an alteration, a question of cloth." />
      </label>
      {note ? <p className="mt-4 text-sm">{note}</p> : null}
      <button disabled={pending} className="mt-8 h-14 bg-ink px-10 text-paper label disabled:opacity-50">
        {pending ? "Sending" : "Send"}
      </button>
    </form>
  );
}
