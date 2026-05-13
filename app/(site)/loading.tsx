export default function SiteLoading() {
  return (
    <div className="min-h-[50vh] bg-background">
      <div className="border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="h-9 w-40 animate-pulse rounded-md bg-muted/40" />
          <div className="hidden gap-6 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-16 animate-pulse rounded bg-muted/40"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-12">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="h-10 max-w-md animate-pulse rounded-lg bg-muted/50 md:w-[72%]" />
          <div className="h-4 w-full animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/30" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted/30" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
          <div className="h-40 animate-pulse rounded-xl border border-border/40 bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
