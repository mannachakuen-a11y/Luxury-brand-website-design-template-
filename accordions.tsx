"use client";

import { useState } from "react";

export function Accordions({ items }: { items: { title: string; body: string }[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.title} className="border-b border-line">
            <button
              className="flex w-full items-center justify-between py-5 text-left"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span className="label">{item.title}</span>
              <span aria-hidden="true">{expanded ? "–" : "+"}</span>
            </button>
            {expanded ? <p className="max-w-xl pb-6 text-sm leading-7 text-charcoal">{item.body}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
