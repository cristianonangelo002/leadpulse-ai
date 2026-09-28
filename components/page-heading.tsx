export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div>{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-violet-400">{eyebrow}</p>}<h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm text-zinc-500">{description}</p></div>{action}</div>;
}
