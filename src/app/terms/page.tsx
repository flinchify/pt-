import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AnywherePT Terms of Service. Read the terms and conditions governing your use of the AnywherePT personal trainer marketplace.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-warm-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-warm-500">Last updated: 16 April 2026</p>

      <div className="prose-warm mt-10 space-y-8 text-sm leading-relaxed text-warm-600">
        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AnywherePT platform (&quot;Platform&quot;), including our website at anywherept.com.au and any associated mobile applications, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not use the Platform.
          </p>
          <p>
            The Platform is operated by AnywhereTradie Pty Ltd (ABN pending) (&quot;AnywhereTradie&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), trading as AnywherePT. We reserve the right to modify these Terms at any time. Material changes will be communicated via the Platform or email. Your continued use constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">2. Platform and Marketplace Model</h2>
          <p>
            AnywherePT is an online marketplace that connects individuals seeking personal training services (&quot;Clients&quot;) with independent personal trainers (&quot;Trainers&quot;) across Australia. We also provide tools for gyms (&quot;Gym Partners&quot;) and corporate entities (&quot;Enterprise Clients&quot;).
          </p>
          <p>
            AnywherePT acts solely as an intermediary platform and marketplace facilitator. We do not provide personal training services directly. We facilitate connections, bookings, and payment processing between Clients and Trainers. AnywherePT is not a party to any agreement between a Client and a Trainer for the provision of training services.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">3. Independent Contractor Status</h2>
          <p>
            Trainers registered on the Platform are independent contractors and are not employees, agents, or representatives of AnywhereTradie or AnywherePT. Trainers operate their own businesses and are solely responsible for the manner in which they provide their services.
          </p>
          <p>
            AnywhereTradie does not supervise, direct, or control the work performed by Trainers. Trainers set their own schedules, rates (within Platform guidelines), session content, and training methodologies. The relationship between AnywhereTradie and Trainers is strictly that of an independent marketplace operator and service provider.
          </p>
          <p>
            Trainers are responsible for their own tax obligations, including GST registration if applicable, income tax, superannuation, and WorkCover/workers compensation insurance as required by Australian law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">4. User Accounts</h2>
          <p>
            To use certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorised use.
          </p>
          <p>
            You must be at least 18 years of age to create an account. If you are between 16 and 18, you may use the Platform with the consent of a parent or legal guardian who agrees to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">5. Bookings and Service Agreements</h2>
          <p>
            When you book a session through the Platform, you are entering into a direct agreement with the Trainer for the provision of personal training services. AnywhereTradie facilitates this booking but is not a party to the contract between Client and Trainer.
          </p>
          <p>
            All bookings are subject to Trainer availability and acceptance. The Platform does not guarantee that any particular Trainer will be available. Session details, including date, time, location, and type, are confirmed at the time of booking.
          </p>
          <p>
            Both Clients and Trainers are expected to honour confirmed bookings. The contractual terms of the training session (including scope, expectations, and any specific health considerations) are agreed between the Client and the Trainer.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">6. Payments and Fees</h2>
          <p>
            All payments are processed securely through Stripe, our third-party payment processor. By making a payment, you agree to Stripe&apos;s terms of service in addition to these Terms. AnywhereTradie does not store full payment card details.
          </p>
          <p>
            Session fees are charged at the time of booking. Trainers receive payment after the session, less the AnywherePT platform fee (currently 15% of the session price). Prices are quoted in Australian Dollars (AUD) and include GST where applicable.
          </p>
          <p>
            Subscription plans are billed in advance on a monthly or annual basis. AnywhereTradie reserves the right to adjust platform fees and subscription pricing with 30 days written notice.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">7. Cancellations and Refunds</h2>
          <p>
            Clients may cancel a booking free of charge up to 24 hours before the scheduled session time. Cancellations made less than 24 hours before the session may incur a cancellation fee of up to 50% of the session price, payable to the Trainer.
          </p>
          <p>
            If a Trainer cancels a confirmed booking, the Client will receive a full refund. Trainers who repeatedly cancel may have their accounts suspended or terminated.
          </p>
          <p>
            Subscription refunds are handled on a case-by-case basis. Cancellation of a subscription retains access until the end of the current billing period without pro-rated refund.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">8. Trainer Obligations and Insurance Requirements</h2>
          <p>
            Trainers on the Platform must hold valid and current personal training certifications recognised in Australia (minimum Certificate III in Fitness SIS30321 or Certificate IV in Fitness SIS40221).
          </p>
          <p>
            Trainers must maintain the following at all times while active on the Platform:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Current First Aid Certificate (HLTAID011) and CPR Certificate (HLTAID009)</li>
            <li>Public liability insurance with minimum coverage of $10,000,000</li>
            <li>Professional indemnity insurance appropriate to their services</li>
            <li>Working With Children Check (WWCC) valid in the relevant state or territory</li>
            <li>National Police Check issued within the preceding 12 months (upon initial registration)</li>
          </ul>
          <p>
            Trainers must complete our verification process, which includes identity verification, credential checks, and AI-assisted document verification. Trainers agree to provide services in a professional, safe, and competent manner.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">9. No Warranty on Quality of Training</h2>
          <p>
            AnywhereTradie does not warrant, guarantee, or make any representations regarding the quality, safety, suitability, or effectiveness of any training services provided by Trainers on the Platform.
          </p>
          <p>
            While we verify Trainer credentials and conduct background checks, we do not assess, monitor, or evaluate the actual training sessions. Clients acknowledge that personal training involves physical activity with inherent risks of injury, and that they should consult with a healthcare professional before commencing any fitness program.
          </p>
          <p>
            Any reviews, ratings, or testimonials on the Platform reflect the personal opinions of individual users and do not constitute endorsement by AnywhereTradie.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">10. Dispute Resolution</h2>
          <p>
            Disputes regarding the quality, delivery, or scope of training services are between the Client and the Trainer. AnywhereTradie will facilitate communication between the parties but is not responsible for resolving such disputes.
          </p>
          <p>
            If a dispute arises, the parties should first attempt to resolve it directly. If direct resolution fails, AnywhereTradie may, at its sole discretion, offer mediation assistance. Any mediation facilitated by AnywhereTradie is non-binding.
          </p>
          <p>
            For disputes regarding Platform services, payments, or account issues, please contact support@anywherept.com.au. We will respond within 5 business days and endeavour to resolve complaints within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">11. Indemnification</h2>
          <p>
            Trainers agree to indemnify, defend, and hold harmless AnywhereTradie, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable legal fees) arising out of or related to:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>The provision of personal training services by the Trainer</li>
            <li>Any injury, harm, or damage suffered by a Client or third party during or as a result of training sessions</li>
            <li>Any breach of these Terms by the Trainer</li>
            <li>Any negligent, reckless, or unlawful conduct by the Trainer</li>
            <li>Any claim arising from the Trainer&apos;s failure to maintain required insurance, certifications, or working-with-children clearances</li>
          </ul>
          <p>
            Clients agree to indemnify AnywhereTradie from claims arising out of their misuse of the Platform, provision of false information, or breach of these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">12. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Australian law, including the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)), AnywhereTradie&apos;s total aggregate liability to you for any claims arising out of or related to these Terms or your use of the Platform shall not exceed the lesser of:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>The total amount you paid to AnywhereTradie in platform fees during the 12 months preceding the claim; or</li>
            <li>$1,000 AUD.</li>
          </ul>
          <p>
            AnywhereTradie shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, revenue, data, or business opportunities, regardless of the cause of action.
          </p>
          <p>
            AnywhereTradie does not exclude or limit liability for death or personal injury caused by our negligence, fraud, or any other liability that cannot be excluded under Australian law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">13. Australian Consumer Law</h2>
          <p>
            Nothing in these Terms is intended to exclude, restrict, or modify any rights or remedies that you may have under the Australian Consumer Law or any other applicable consumer protection legislation, which cannot be excluded, restricted, or modified by agreement.
          </p>
          <p>
            If the Australian Consumer Law applies, and we supply services that are not of a kind ordinarily acquired for personal, domestic, or household use, our liability is limited to resupplying the services or paying the cost of having them resupplied.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">14. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a> to understand how we collect, use, and protect your personal information, including sensitive health information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">15. Intellectual Property</h2>
          <p>
            All content on the Platform, including text, graphics, logos, icons, images, and software, is the property of AnywhereTradie or its licensors and is protected by Australian and international copyright and trademark laws.
          </p>
          <p>
            Users retain ownership of content they upload (including reviews, photos, and profile information) but grant AnywhereTradie a non-exclusive, worldwide, royalty-free licence to use, display, and distribute such content in connection with the operation of the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">16. Termination</h2>
          <p>
            AnywhereTradie may suspend or terminate your account at any time, with or without cause, including for violation of these Terms, fraudulent activity, failure to maintain required insurance or credentials (for Trainers), or conduct harmful to other users or the Platform.
          </p>
          <p>
            Upon termination, your right to use the Platform ceases immediately. Any outstanding payment obligations survive termination. Provisions of these Terms that by their nature should survive termination (including indemnification, limitation of liability, and dispute resolution) will continue to apply.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">17. Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of New South Wales, unless otherwise required by applicable consumer protection legislation.
          </p>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
          </p>
          <p className="mt-6 font-medium text-warm-700">
            Contact us:
          </p>
          <p>
            AnywhereTradie Pty Ltd (trading as AnywherePT)<br />
            Email: support@anywherept.com.au<br />
            Sydney, NSW, Australia
          </p>
        </section>
      </div>
    </div>
  );
}
