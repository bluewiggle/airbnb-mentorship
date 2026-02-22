"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import ApplicationModal from "@/components/application-modal";
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
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <SiteHeader onApplyClick={() => setApplyOpen(true)} />

      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for mentorship" />

      <main>
        <Hero onApplyClick={() => setApplyOpen(true)} />
        <Authority />
        <Problem />
        <Operators />
        <HowItWorks />
        <MentorshipSnapshot onApplyClick={() => setApplyOpen(true)} />
        <FitCheck />
        <FAQ />

        {/* Make the Apply section button also open the same modal */}
        <Apply onApplyClick={() => setApplyOpen(true)} />
      </main>

      <SiteFooter />
    </>
  );
}