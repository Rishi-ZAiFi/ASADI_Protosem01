export function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-label text-ink-500">
      ({children})
    </span>
  );
}
