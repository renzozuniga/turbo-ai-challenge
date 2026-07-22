export function EmptyNotesState() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/illustrations/happy-coffee.png" alt="" width={297} height={296} />
      <p className="h-[29px] w-[522px] rotate-0 opacity-100 font-sans text-2xl font-normal text-heading">
        I&apos;m just here waiting for your charming notes...
      </p>
    </div>
  );
}
