import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns and Refund Policy | BNB Lab",
  description: "Returns and refund policy for BNB Lab mentorship purchases.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b0d10] px-6 py-16 text-white">
      <div className="mx-auto max-w-[850px] rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:p-12">
        <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.24em] text-white/45">
          BNB Lab
        </p>

        <h1 className="text-4xl font-black tracking-tight md:text-5xl">
          Returns and Refund Policy
        </h1>

        <p className="mt-4 text-sm text-white/50">
          Last updated: 3 June 2026
        </p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-white/72">
          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Overview
            </h2>
            <p>
              This Returns and Refund Policy applies to purchases made for BNB
              Lab education, mentorship, training, coaching, course materials,
              digital resources, community access, calls, templates, and related
              services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              No change-of-mind refunds
            </h2>
            <p>
              Once payment has been made, we do not provide refunds for change
              of mind, change in personal circumstances, lack of time, failure to
              participate, failure to complete the program, or a decision not to
              proceed after purchase.
            </p>

            <p className="mt-4">
              By making payment, you acknowledge that you are purchasing access
              to education, mentorship, coaching, course materials, digital
              resources, community access, and/or related services, and that
              access to these resources and services may begin immediately after
              payment.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Digital products, mentorship and services
            </h2>
            <p>
              Due to the nature of digital products, educational materials,
              coaching, mentorship, community access, calls, templates, and
              service-based programs, payments are final once made, except where
              required by law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Australian Consumer Law
            </h2>
            <p>
              Nothing in this policy excludes, restricts, or modifies any rights
              you may have under the Australian Consumer Law or any other
              applicable law.
            </p>

            <p className="mt-4">
              Our goods and services come with guarantees that cannot be
              excluded under the Australian Consumer Law. If there is a major
              failure with a service, you may be entitled to cancel the service
              contract and receive a refund for the unused portion, or
              compensation for the reduced value of the service.
            </p>

            <p className="mt-4">
              If a failure does not amount to a major failure, we are entitled to
              rectify the issue within a reasonable time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Refund requests
            </h2>
            <p>
              Any refund request must be submitted in writing and include the
              reason for the request. We may assess the request, the services
              provided, access granted, communications, payment records, and any
              other relevant circumstances before making a decision.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-extrabold text-white">
              Contact
            </h2>
            <p>
              For questions about this policy, please contact us using the
              contact details provided to you during enrolment.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}