import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AnywherePT Terms of Service. Please read these terms carefully before using our platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-warm-900">Terms of Service</h1>
      <p className="mt-2 text-sm text-warm-500">Last updated: 1 January 2024</p>

      <div className="prose-warm mt-10 space-y-8 text-sm leading-relaxed text-warm-600">
        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the AnywherePT platform (&quot;Platform&quot;), including our website at anywherept.com.au and any associated mobile applications, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you must not use the Platform.
          </p>
          <p>
            AnywherePT Pty Ltd (&quot;AnywherePT&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) reserves the right to modify these Terms at any time. We will notify you of material changes by posting a notice on the Platform or by sending you an email. Your continued use of the Platform following any changes constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">2. Description of Services</h2>
          <p>
            AnywherePT is an online marketplace that connects individuals (&quot;Clients&quot;) with independent personal trainers (&quot;Trainers&quot;) across Australia. We also provide tools for gyms (&quot;Gym Partners&quot;) and corporate entities (&quot;Enterprise Clients&quot;) to facilitate fitness services.
          </p>
          <p>
            AnywherePT acts solely as an intermediary platform. Trainers are independent contractors, not employees of AnywherePT. We do not provide personal training services directly. We facilitate connections, bookings, and payments between Clients and Trainers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">3. User Accounts</h2>
          <p>
            To use certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information up to date.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorised use of your account.
          </p>
          <p>
            You must be at least 18 years of age to create an account. If you are between 16 and 18, you may use the Platform with the consent of a parent or legal guardian who agrees to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">4. Bookings</h2>
          <p>
            When you book a session through the Platform, you are entering into a direct agreement with the Trainer for the provision of personal training services. AnywherePT facilitates this booking but is not a party to the agreement between you and the Trainer.
          </p>
          <p>
            All bookings are subject to Trainer availability and acceptance. AnywherePT does not guarantee that a particular Trainer will be available at your preferred time or location.
          </p>
          <p>
            Session details, including date, time, location, and type, are confirmed at the time of booking. Both Clients and Trainers are expected to honour confirmed bookings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">5. Payments</h2>
          <p>
            All payments are processed securely through our third-party payment processor, Stripe. By making a payment, you agree to Stripe&apos;s terms of service in addition to these Terms.
          </p>
          <p>
            Session fees are charged at the time of booking. Trainers receive payment after the session is completed, less the AnywherePT platform fee. The current platform fee is 15% of the session price.
          </p>
          <p>
            Subscription plan payments are billed in advance on a monthly or annual basis, depending on your selected billing cycle. Prices are quoted in Australian Dollars (AUD) and include GST where applicable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">6. Cancellations and Refunds</h2>
          <p>
            Clients may cancel a booking free of charge up to 24 hours before the scheduled session time. Cancellations made less than 24 hours before the session may incur a cancellation fee of up to 50% of the session price.
          </p>
          <p>
            If a Trainer cancels a confirmed booking, the Client will receive a full refund. Trainers who repeatedly cancel bookings may have their accounts suspended or terminated.
          </p>
          <p>
            Refunds for subscription plans are handled on a case-by-case basis. If you cancel your subscription, you will retain access until the end of your current billing period but will not receive a pro-rated refund.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">7. Trainer Obligations</h2>
          <p>
            Trainers on the Platform must hold valid and current personal training certifications recognised in Australia. Trainers must maintain appropriate professional indemnity and public liability insurance.
          </p>
          <p>
            Trainers must complete our verification process, which includes identity verification, credential checks, and background checks. Trainers are required to hold a valid Working with Children Check where applicable.
          </p>
          <p>
            Trainers agree to provide services in a professional, safe, and competent manner. Trainers must not engage in any conduct that is unlawful, harassing, or discriminatory.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">8. Limitation of Liability</h2>
          <p>
            Personal training involves physical activity and inherent risks of injury. By using the Platform to book training sessions, you acknowledge these risks and agree that AnywherePT is not liable for any injuries, damages, or losses arising from training sessions.
          </p>
          <p>
            To the maximum extent permitted by Australian law, AnywherePT&apos;s total liability to you for any claims arising out of or related to these Terms or your use of the Platform shall not exceed the amount you paid to AnywherePT in the 12 months preceding the claim.
          </p>
          <p>
            AnywherePT does not warrant that the Platform will be uninterrupted, error-free, or secure. We provide the Platform on an &quot;as is&quot; and &quot;as available&quot; basis.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">9. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">10. Intellectual Property</h2>
          <p>
            All content on the Platform, including text, graphics, logos, icons, images, and software, is the property of AnywherePT or its licensors and is protected by Australian and international copyright and trademark laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works from any content on the Platform without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">11. Termination</h2>
          <p>
            AnywherePT may suspend or terminate your account at any time, with or without cause, and with or without notice. Reasons for termination may include violation of these Terms, fraudulent activity, or conduct that we determine to be harmful to other users or the Platform.
          </p>
          <p>
            Upon termination, your right to use the Platform ceases immediately. Provisions of these Terms that by their nature should survive termination will continue to apply.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. When we make material changes, we will update the &quot;Last updated&quot; date at the top of this page and notify you via email or through the Platform.
          </p>
          <p>
            Your continued use of the Platform after the effective date of any changes constitutes your acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">13. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of New South Wales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">14. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            AnywherePT Pty Ltd<br />
            Email: legal@anywherept.com.au<br />
            Phone: 1300 APT AUS<br />
            Sydney, NSW, Australia
          </p>
        </section>
      </div>
    </div>
  );
}
