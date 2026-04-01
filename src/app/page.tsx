"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import ApplicationModal from "@/components/application-modal";
import { Hero } from "@/components/sections/hero";
import { Operators } from "@/components/sections/operators";
import { HowItWorks } from "@/components/sections/how-it-works";
import { MentorshipSnapshot } from "@/components/sections/mentorship-snapshot";
import { OurGuarantee } from "@/components/sections/our-guarantee"; 
import { FAQ } from "@/components/sections/faq";
import { Apply } from "@/components/sections/apply";
import { SiteFooter } from "@/components/site-footer";
import { Success } from "@/components/sections/success";

export default function Page() {
  const [applyOpen, setApplyOpen] = useState(false);

  return (
    <>
      <SiteHeader onApplyClick={() => setApplyOpen(true)} />

      <ApplicationModal open={applyOpen} onClose={() => setApplyOpen(false)} title="Apply for mentorship" />

      <main>
        <Hero onApplyClick={() => setApplyOpen(true)} />
        <Success />
        <MentorshipSnapshot />
        <OurGuarantee />
        <Apply />
        <Operators />
        <HowItWorks />
        <FAQ />
      </main>

      <SiteFooter />
    </>
  );
}