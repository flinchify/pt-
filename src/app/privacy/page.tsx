import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AnywherePT Privacy Policy. Learn how we collect, use, and protect your personal information in accordance with Australian Privacy Act 1988.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-warm-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-warm-500">Last updated: 16 April 2026</p>

      <div className="prose-warm mt-10 space-y-8 text-sm leading-relaxed text-warm-600">
        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">1. Introduction</h2>
          <p>
            AnywhereTradie Pty Ltd, trading as AnywherePT (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), is committed to protecting the privacy of individuals who use our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
          </p>
          <p>
            By using the AnywherePT platform, including our website at anywherept.com.au, you consent to the collection and use of your information as described in this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">2. Information We Collect</h2>
          <p>We collect the following categories of personal information:</p>
          <p><strong>Account Information:</strong> Name, email address, phone number, date of birth, and account type (Client, Trainer, Gym Partner, or Enterprise).</p>
          <p><strong>Trainer Profile Information:</strong> Qualifications, certifications, credential documents, experience, specialisations, photos, biography, location, availability, insurance details, Working With Children Check, and police check information.</p>
          <p><strong>Client Profile Information:</strong> Fitness goals, health information you choose to share, weight, measurements, and location preferences.</p>
          <p><strong>Payment Information:</strong> Payment details are collected and processed by our payment processor, Stripe. We do not store your full credit card number. We may store the last four digits and card type for your reference.</p>
          <p><strong>Booking Information:</strong> Session dates, times, locations, session types, booking history, and related communications.</p>
          <p><strong>Usage Information:</strong> Pages visited, features used, search queries, IP address, browser type, device information, and referring URLs.</p>
          <p><strong>Communications:</strong> Messages sent through our platform, support requests, contact form submissions, and feedback.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">3. Health and Sensitive Information</h2>
          <p>
            We recognise that certain information collected through the Platform may constitute &quot;health information&quot; or &quot;sensitive information&quot; under the Privacy Act 1988. This includes fitness goals, weight data, medical notes, injury history, and any health-related information shared between Clients and Trainers.
          </p>
          <p>
            We collect health information only with your explicit consent. This information is:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Used solely for the purpose of facilitating personal training services</li>
            <li>Shared only with Trainers you have booked or are actively engaging with</li>
            <li>Stored securely with access controls limiting who can view it</li>
            <li>Never sold or shared with third parties for marketing purposes</li>
            <li>Deleted upon your request, subject to legal record-keeping obligations</li>
          </ul>
          <p>
            You may withdraw consent for the collection of health information at any time by contacting privacy@anywherept.com.au. Withdrawal of consent may limit the functionality of certain Platform features.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">4. How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>To provide, operate, and maintain the Platform</li>
            <li>To facilitate bookings between Clients and Trainers</li>
            <li>To process payments and send transaction confirmations</li>
            <li>To verify Trainer credentials using AI-assisted document analysis</li>
            <li>To conduct background checks on Trainers</li>
            <li>To personalise your experience and provide relevant trainer recommendations</li>
            <li>To communicate with you about your account, bookings, and platform updates</li>
            <li>To send marketing communications (with your consent)</li>
            <li>To analyse usage patterns and improve our services</li>
            <li>To detect, prevent, and address fraud, security issues, and technical problems</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">5. Information Sharing and Disclosure</h2>
          <p>We may share your personal information in the following circumstances:</p>
          <p><strong>Between Users:</strong> When you book a session, relevant information (such as your name, contact details, and session preferences) is shared with the Trainer. Trainer profiles are visible to Clients browsing the Platform.</p>
          <p><strong>Service Providers:</strong> We share information with third-party service providers who perform services on our behalf:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Stripe</strong> - Payment processing and trainer payouts</li>
            <li><strong>Neon</strong> - Database hosting and data storage</li>
            <li><strong>Vercel</strong> - Website hosting and deployment</li>
            <li><strong>Resend</strong> - Transactional email delivery</li>
            <li><strong>OpenAI</strong> - AI-assisted credential verification (document images only)</li>
          </ul>
          <p>These providers are contractually obligated to protect your information and process it only on our instructions.</p>
          <p><strong>Legal Requirements:</strong> We may disclose your information if required by law, court order, subpoena, or other legal process, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</p>
          <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">6. Cookies and Analytics</h2>
          <p>
            We use cookies and similar tracking technologies to collect usage information and improve your experience.
          </p>
          <p><strong>Essential Cookies:</strong> Required for Platform functionality, including authentication and session management.</p>
          <p><strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform. These collect anonymised usage data.</p>
          <p><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (only set with your consent).</p>
          <p>
            You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect Platform functionality.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">7. Data Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal information, including:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Encryption of data in transit (TLS/SSL) and at rest</li>
            <li>Access controls and role-based permissions</li>
            <li>Regular security assessments and monitoring</li>
            <li>HTTP-only session cookies to prevent cross-site scripting</li>
            <li>Rate limiting to prevent abuse</li>
            <li>Stripe PCI-DSS compliant payment processing</li>
          </ul>
          <p>
            No method of electronic transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">8. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide services. After account closure:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Account data is retained for 30 days before deletion (to allow account recovery)</li>
            <li>Booking and transaction records are retained for 7 years (Australian tax requirements)</li>
            <li>Trainer credential documents are retained for 2 years after account closure</li>
            <li>Anonymised usage data may be retained indefinitely for analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">9. Your Rights</h2>
          <p>Under Australian privacy law, you have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete information</li>
            <li>Request deletion of your personal information (subject to legal obligations)</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Request a copy of your data in a portable format</li>
            <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at privacy@anywherept.com.au. We will respond to your request within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">10. International Data Transfers</h2>
          <p>
            Your information may be stored and processed in countries outside of Australia where our service providers maintain facilities (including the United States for Stripe, Vercel, and OpenAI). When we transfer data internationally, we take steps to ensure your information receives adequate protection in accordance with Australian privacy law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">11. Children&apos;s Privacy</h2>
          <p>
            The Platform is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected such information, we will take steps to delete it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating the &quot;Last updated&quot; date and, where appropriate, by sending you an email notification.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">13. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact our Privacy Officer:
          </p>
          <p>
            AnywhereTradie Pty Ltd (trading as AnywherePT)<br />
            Privacy Officer<br />
            Email: privacy@anywherept.com.au<br />
            Sydney, NSW, Australia
          </p>
          <p>
            You may also lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.
          </p>
        </section>
      </div>
    </div>
  );
}
