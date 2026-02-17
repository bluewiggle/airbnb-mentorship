import Link from "next/link";
import { cn } from "@/components/utils";

export function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("px-6 py-[80px] md:py-[110px]", className)}>
      <div className="mx-auto w-full max-w-[1180px]">{children}</div>
    </section>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-white/80">
      {children}
    </div>
  );
}

export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-extrabold tracking-[-0.04em] text-white/95 text-[clamp(40px,6vw,82px)] leading-[1.02]">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-extrabold tracking-[-0.03em] text-white/95 text-[clamp(34px,4.2vw,54px)] leading-[1.08]">
      {children}
    </h2>
  );
}

export function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[15.5px] leading-[1.75] text-white/74", className)}>{children}</p>;
}

export function ButtonLink({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-[14px] font-extrabold transition will-change-transform hover:-translate-y-0.5";
  const styles =
    variant === "primary"
      ? "border-transparent bg-accent text-black shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-glow"
      : "border-white/18 bg-white/6 text-white/92 hover:bg-white/10";
  return (
    <Link href={href} className={cn(base, styles)}>
      {children}
    </Link>
  );
}
