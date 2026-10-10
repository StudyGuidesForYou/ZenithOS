import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const QUOTES = [
  { t: 'Stay hungry. Stay foolish.', a: 'Stewart Brand' },
  { t: 'Simplicity is the ultimate sophistication.', a: 'Leonardo da Vinci' },
  { t: 'The best way to predict the future is to invent it.', a: 'Alan Kay' },
  { t: 'Make it work, make it right, make it fast.', a: 'Kent Beck' },
  { t: 'Design is not just what it looks like — design is how it works.', a: 'Steve Jobs' },
  { t: 'Any sufficiently advanced technology is indistinguishable from magic.', a: 'Arthur C. Clarke' },
  { t: 'Talk is cheap. Show me the code.', a: 'Linus Torvalds' },
  { t: 'Premature optimization is the root of all evil.', a: 'Donald Knuth' },
];

export default function QuoteWidget() {
  const [i, setI] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const q = QUOTES[i];
  return (
    <div>
      <p className="text-[12px] italic leading-relaxed">“{q.t}”</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-[hsl(var(--z-text-dim))]">— {q.a}</span>
        <button
          type="button"
          onClick={() => setI((n) => (n + 1) % QUOTES.length)}
          className="z-hoverable flex h-6 w-6 items-center justify-center rounded-lg"
          title="Another quote"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}