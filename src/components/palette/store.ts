// ponytail: tiny module-scoped store so the trigger button doesn't have to
// synthesize a KeyboardEvent to open the palette. Same idea as a Zustand store,
// but no library — we don't need selectors, just a setter.

type Listener = (open: boolean) => void;

let open = false;
const listeners = new Set<Listener>();

export function setPaletteOpen(next: boolean) {
  if (next === open) return;
  open = next;
  listeners.forEach((l) => l(open));
}

export function togglePalette() {
  setPaletteOpen(!open);
}

export function subscribePalette(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}