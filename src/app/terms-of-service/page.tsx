import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | BNB Lab",
  description: "Terms of Service for BNB Lab.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#0b0d10] px-6 py-16 text-white">
      <div className="mx-auto max-w-[850px] rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:p-12">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.24em] text-white/45">
          BNB Lab
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Terms of Service
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
              These Terms of Service govern your access to and use of the BNB
              Lab website, education, mentorship, training, coaching, course
              materials, digital resources, communities, calls, templates and
              related services.
            </p>

            <p className="mt-4">
              By using our website, submitting your information, booking a call,
              making payment, accessing our materials, or participating in our
              services, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Changes to these terms
            </h2>
            <p>
              We may amend these Terms of Service from time to time. Updated
              terms take effect when published or otherwise made available. Your
              continued use of our website or services after an update means you
              accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Website use
            </h2>
            <p>
              You must not misuse our website, interfere with its operation,
              attempt to gain unauthorised access, upload malicious code, scrape
              content, copy materials, infringe our rights, send spam, or use
              the website for unlawful, harmful or misleading purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Services
            </h2>
            <p>
              BNB Lab provides education, mentorship, training, coaching,
              resources and support relating to short-term rental business
              models, including Airbnb arbitrage and related business systems.
              We do not guarantee that you will obtain a particular financial
              result, secure a property, earn revenue, make profit, or achieve
              any specific outcome unless expressly stated in writing.
            </p>

            <p className="mt-4">
              Results depend on many factors outside our control, including your
              effort, market conditions, available properties, landlord or agent
              decisions, compliance requirements, capital, execution, pricing,
              operations and risk management.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Payments
            </h2>
            <p>
              Fees, payment terms and inclusions may be provided to you during
              the sales, checkout, invoice, onboarding or enrolment process. By
              making payment, you agree to pay the applicable fees and understand
              that access to services, materials, communities, resources and
              onboarding may begin immediately.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Refunds
            </h2>
            <p>
              Refunds are governed by our Returns and Refund Policy. We do not
              provide refunds for change of mind, lack of time, change in
              personal circumstances, failure to participate, failure to complete
              the program, or a decision not to proceed after purchase, except
              where required by law.
            </p>

            <p className="mt-4">
              Nothing in these terms excludes, restricts or modifies any rights
              you may have under the Australian Consumer Law or any other
              applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Intellectual property
            </h2>
            <p>
              All course materials, frameworks, templates, videos, calls,
              recordings, documents, community content, website content, brand
              assets, processes, strategies and other materials provided by BNB
              Lab remain our intellectual property or the intellectual property
              of our licensors.
            </p>

            <p className="mt-4">
              You may use the materials for your own personal learning and
              business implementation only. You must not copy, share, sell,
              publish, distribute, reproduce, licence, teach, repackage, upload
              or commercially exploit our materials without written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Confidentiality
            </h2>
            <p>
              You must keep confidential any non-public materials, strategies,
              templates, processes, community discussions, business information,
              pricing, call recordings, documents or other information provided
              through BNB Lab, unless we give written permission or the
              information is already publicly available through no breach by you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Third party platforms
            </h2>
            <p>
              Our services may involve third party platforms such as payment
              processors, booking tools, community platforms, video call
              software, analytics tools, email tools and social media platforms.
              We are not responsible for the availability, performance, terms,
              policies or actions of third party platforms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Communications and contact consent
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
              directly. Operational communications may still be required for
              service delivery, appointment reminders, payment matters, legal
              compliance or administration.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Limitation of liability
            </h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any
              indirect, consequential, special, incidental or punitive loss, loss
              of profit, loss of revenue, loss of opportunity, loss of goodwill,
              business interruption, or loss arising from your use of our
              website, materials or services.
            </p>

            <p className="mt-4">
              This clause does not exclude liability that cannot be excluded
              under the Australian Consumer Law or other applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Indemnity
            </h2>
            <p>
              You agree to indemnify BNB Lab, its directors, officers,
              contractors, employees, agents and affiliates from claims, losses,
              liabilities, damages, costs or expenses arising from your misuse of
              our website, breach of these terms, breach of law, or misuse of
              our intellectual property.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Severability
            </h2>
            <p>
              If any part of these terms is found to be invalid or unenforceable,
              the remaining parts continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Contact
            </h2>
            <p>
              For questions about these Terms of Service, please contact us
              using the contact details provided on our website or during your
              enrolment process.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}