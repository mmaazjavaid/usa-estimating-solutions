type StepsRowProps = {
  heading: string;
  steps: string[];
  variant?: 'light' | 'dark';
  headingClassName?: string;
  dividerClassName?: string;
  className?: string;
};

export function StepsRow({
  heading,
  steps,
  variant = 'light',
  headingClassName,
  dividerClassName,
  className,
}: StepsRowProps) {
  const resolvedHeadingClassName =
    headingClassName ??
    (variant === 'dark'
      ? 'mb-10 text-center text-3xl font-bold text-white md:text-4xl text-balance'
      : 'mb-14 text-center text-3xl font-bold text-foreground md:text-4xl text-balance');

  const resolvedDividerClassName =
    dividerClassName ??
    (variant === 'dark' ? 'bg-white/20' : 'bg-muted-foreground/30');

  return (
    <div className={className}>
      <h2 className={resolvedHeadingClassName}>{heading}</h2>

      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-0">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <span
              className="whitespace-nowrap text-sm font-medium md:text-base"
              style={{ color: '#D9D9D9' }}
            >
              {step}
            </span>

            {index < steps.length - 1 ? (
              <div
                className={`mx-4 hidden h-px w-16 md:block lg:w-32 xl:w-40 ${resolvedDividerClassName}`}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
