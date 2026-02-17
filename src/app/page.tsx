import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { Authority } from "@/components/sections/authority";
import { Problem } from "@/components/sections/problem";
import { Operators } from "@/components/sections/operators";
import { HowItWorks } from "@/components/sections/how-it-works";
import { MentorshipSnapshot } from "@/components/sections/mentorship-snapshot";
import { FitCheck } from "@/components/sections/fit-check";
import { FAQ } from "@/components/sections/faq";
import { Apply } from "@/components/sections/apply";
import { SiteFooter } from "@/components/site-footer";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Authority />
        <Problem />
        <Operators />
        <HowItWorks />
        <MentorshipSnapshot />
        <FitCheck />
        <FAQ />
        <Apply />
      </main>
      <SiteFooter />
    </>
  );
}
