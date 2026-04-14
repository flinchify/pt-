import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AnywherePT Privacy Policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-warm-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-warm-500">Last updated: 1 January 2024</p>

      <div className="prose-warm mt-10 space-y-8 text-sm leading-relaxed text-warm-600">
        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">1. Introduction</h2>
          <p>
            AnywherePT Pty Ltd (&quot;AnywherePT&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of individuals who use our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the Australian Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
          </p>
          <p>
            By using the AnywherePT platform, including our website at anywherept.com.au and any associated mobile applications, you consent to the collection and use of your information as described in this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">2. Information We Collect</h2>
          <p>We collect the following categories of personal information:</p>
          <p><strong>Account Information:</strong> When you create an account, we collect your name, email address, phone number, date of birth, and account type (Client, Trainer, Gym Partner, or Enterprise).</p>
          <p><strong>Profile Information:</strong> For Trainers, we collect qualifications, certifications, experience, specialisations, photos, biography, location, and availability. For Clients, we collect fitness goals, health information you choose to share, and location preferences.</p>
          <p><strong>Payment Information:</strong> Payment details are collected and processed by our payment processor, Stripe. We do not store your full credit card number on our servers. We may store the last four digits and card type for your reference.</p>
          <p><strong>Booking Information:</strong> Session dates, times, locations, session types, and related communications between Clients and Trainers.</p>
          <p><strong>Usage Information:</strong> We automatically collect information about how you use our platform, including pages visited, features used, search queries, IP address, browser type, device information, and referring URLs.</p>
          <p><strong>Communications:</strong> Messages sent through our platform, support requests, and feedback you provide.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">3. How We Use Your Information</h2>
          <p>We use your personal information for the following purposes:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>To provide, operate, and maintain the Platform</li>
            <li>To facilitate bookings between Clients and Trainers</li>
            <li>To process payments and send transaction confirmations</li>
            <li>To verify Trainer credentials and conduct background checks</li>
            <li>To personalise your experience and provide relevant trainer recommendations</li>
            <li>To communicate with you about your account, bookings, and platform updates</li>
            <li>To send marketing communications (with your consent)</li>
            <li>To analyse usage patterns and improve our services</li>
            <li>To detect, prevent, and address fraud, security issues, and technical problems</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect usage information and improve your experience on the Platform. Cookies are small data files stored on your device.
          </p>
          <p><strong>Essential Cookies:</strong> Required for the Platform to function properly, including authentication and session management.</p>
          <p><strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform, using services such as Google Analytics. These cookies collect anonymised usage data.</p>
          <p><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. These are only set with your consent.</p>
          <p>
            You can manage your cookie preferences through your browser settings. Note that disabling certain cookies may affect the functionality of the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">5. Information Sharing and Disclosure</h2>
          <p>We may share your personal information in the following circumstances:</p>
          <p><strong>Between Users:</strong> When you book a session, relevant information (such as your name, contact details, and session preferences) is shared with the Trainer. Similarly, Trainer profiles are visible to Clients browsing the Platform.</p>
          <p><strong>Service Providers:</strong> We share information with third-party service providers who perform services on our behalf, including payment processing (Stripe), email delivery, cloud hosting, and analytics. These providers are contractually obligated to protect your information.</p>
          <p><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law, in response to a court order, subpoena, or other legal process, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.</p>
          <p><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">6. Data Security</h2>
          <p>
            We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These measures include encryption of data in transit and at rest, access controls, regular security assessments, and staff training.
          </p>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">7. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you with services. We may retain certain information after account closure for legitimate business purposes, including compliance with legal obligations, resolving disputes, and enforcing our agreements.
          </p>
          <p>
            Booking records and transaction history are retained for a minimum of seven years in accordance with Australian tax and business record-keeping requirements.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">8. Your Rights</h2>
          <p>Under Australian privacy law, you have the right to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate or incomplete information</li>
            <li>Request deletion of your personal information (subject to legal obligations)</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the details provided below. We will respond to your request within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">9. International Data Transfers</h2>
          <p>
            Your information may be stored and processed in countries outside of Australia where our service providers maintain facilities. When we transfer data internationally, we take steps to ensure that your information receives an adequate level of protection in accordance with Australian privacy law.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">10. Children&apos;s Privacy</h2>
          <p>
            The Platform is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete that information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by updating the &quot;Last updated&quot; date at the top of this page and, where appropriate, by sending you an email notification.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-warm-900">12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact our Privacy Officer:
          </p>
          <p>
            AnywherePT Pty Ltd<br />
            Privacy Officer<br />
            Email: privacy@anywherept.com.au<br />
            Phone: 1300 APT AUS<br />
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
