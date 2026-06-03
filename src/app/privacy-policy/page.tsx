import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | BNB Lab",
  description: "Privacy Policy for BNB Lab.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b0d10] px-6 py-16 text-white">
      <div className="mx-auto max-w-[850px] rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:p-12">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.24em] text-white/45">
          BNB Lab
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-4 text-sm text-white/50">
          Last updated: 4 June 2026
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-white/72">
          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Overview
            </h2>
            <p>
              This Privacy Policy explains how BNB Lab collects, holds, uses and
              discloses personal information in connection with our website,
              enquiries, applications, calls, education, mentorship, training,
              coaching, digital resources, communities, marketing and related
              services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Privacy Act
            </h2>
            <p>
              Where applicable, we handle personal information in accordance
              with the Privacy Act 1988 (Cth), the Australian Privacy Principles
              and other applicable laws.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Personal information we collect
            </h2>
            <p>
              We may collect personal information including your name, email
              address, phone number, social media details, business details,
              payment-related information, enquiry details, application answers,
              call notes, communications with us, and information you provide
              when interacting with our website, advertisements, forms, booking
              links, social media accounts, communities or team members.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              How we collect information
            </h2>
            <p>
              We may collect personal information when you submit a form, book a
              call, message us, engage with our advertisements, join our
              community, purchase or enquire about our services, communicate
              with us by email, phone, SMS, WhatsApp, social media, or otherwise
              provide information to us directly or through authorised third
              parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              How we use personal information
            </h2>
            <p>
              We may use personal information to respond to enquiries, assess
              applications, provide our products and services, deliver
              mentorship and education, manage onboarding, send appointment
              reminders, process payments, maintain business records, improve
              our services, communicate with you, run marketing campaigns, and
              comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Communications and consent
            </h2>
            <p>
              By submitting your information through our website, advertisements,
              booking links, forms, social media, direct messages, email, phone,
              SMS, WhatsApp, ManyChat or any other communication channel, you
              consent to BNB Lab contacting you about your enquiry, application,
              booking, requested services, appointment reminders, relevant
              offers, promotions, follow-ups, database reactivation campaigns
              and related business communications.
            </p>

            <p className="mt-4">
              You may withdraw consent to marketing communications at any time
              by using the unsubscribe option provided or by contacting us
              directly. Some operational communications may still be necessary
              for service delivery, appointment reminders, payment matters,
              legal compliance or administration.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Disclosure of information
            </h2>
            <p>
              We may disclose personal information to service providers,
              contractors, payment processors, software platforms, marketing
              tools, analytics providers, professional advisers, legal or
              regulatory authorities, and other parties where required to provide
              our services, operate our business, protect our rights or comply
              with law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Storage and security
            </h2>
            <p>
              We take reasonable steps to protect personal information from
              misuse, interference, loss, unauthorised access, modification or
              disclosure. Information may be stored electronically using third
              party platforms and systems used to operate our business.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Access and correction
            </h2>
            <p>
              You may request access to, or correction of, personal information
              we hold about you by contacting us. We may need to verify your
              identity before releasing or amending personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Data breaches
            </h2>
            <p>
              If we suspect an eligible data breach has occurred, we will assess
              the matter and take steps required by applicable law, which may
              include notifying affected individuals and the Office of the
              Australian Information Commissioner where required.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Complaints
            </h2>
            <p>
              If you have a complaint about how we handle personal information,
              please contact us. You may also contact the Office of the
              Australian Information Commissioner.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Contact
            </h2>
            <p>
              For questions about this Privacy Policy, please contact us using
              the contact details provided on our website or during your
              enrolment process.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}