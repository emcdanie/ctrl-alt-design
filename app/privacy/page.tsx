import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import TodoNote from "@/components/TodoNote";
import FooterEmail from "@/components/FooterEmail";

export const metadata: Metadata = { title: "Privacy · Elleta McDaniel" };

/* Privacy notice. Copy is Elleta's draft (_private/content); not legal
   advice. Every [CHECK] stays a visible TODO until she answers it. */
export default function PrivacyPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />
      <Section prose id="privacy" labelledBy="privacy-title">
        <SectionHeader
          as="h1"
          id="privacy-title"
          heading="Privacy"
          lead="No ads, no analytics, no tracking cookies. The only personal data this site handles is what you choose to send me."
        />
        <TodoNote>Last updated: the date of publishing.</TodoNote>
      </Section>

      <Section prose id="who-i-am" labelledBy="who-i-am-title">
        <SectionHeader id="who-i-am-title" heading="Who I am" />
        <p>
          Elleta McDaniel, freelance design systems designer based near Barcelona, Spain. I&apos;m responsible for
          the personal data described here. Contact: <FooterEmail className="text-action" />
        </p>
      </Section>

      <Section prose id="what-i-collect" labelledBy="what-i-collect-title">
        <SectionHeader id="what-i-collect-title" heading="What I collect and why" />
        <p>
          <strong>1. The contact form.</strong> Your name, email address and message. They&apos;re emailed to me
          through Resend, an email delivery service, so I can reply to you. I use them only for that conversation:
          no newsletters, no mailing lists, and I never share them. Legal basis: taking steps you asked for, and my
          legitimate interest in answering messages sent to me. I keep the email in my inbox for as long as the
          conversation is useful and delete it within a set period.
        </p>
        <TodoNote>Pick a retention period you&apos;ll actually keep to (the draft suggests 24 months).</TodoNote>
        <p>
          <strong>2. &quot;Find my fit&quot;.</strong> If you paste a job description, the text is sent to
          Anthropic&apos;s API (the company behind Claude) to match it with my case studies. I don&apos;t store it.
          Anthropic processes it under its commercial terms. Please don&apos;t paste personal details into it. To
          stop abuse, your IP address is held in the server&apos;s memory for up to 10 minutes and then discarded.
        </p>
        <TodoNote>
          Link to Anthropic&apos;s current commercial privacy terms. Remove this section if the AI version of Find my
          fit isn&apos;t switched on in production.
        </TodoNote>
        <p>
          <strong>3. Hosting.</strong> The site is hosted by Vercel. Like any web host, Vercel processes technical
          data such as your IP address and browser type to deliver the pages and protect the site, and keeps server
          logs for a short period under its own policy.
        </p>
        <p>
          <strong>4. Your theme choice.</strong> If you switch between light and dark mode, that choice is saved in
          your own browser (local storage). It never leaves your device and I can&apos;t see it. It&apos;s there
          because you asked for it, so no consent banner is needed.
        </p>
      </Section>

      <Section prose id="who-else" labelledBy="who-else-title">
        <SectionHeader id="who-else-title" heading="Who else handles data" />
        <ul className="section-list">
          {["Vercel Inc. (hosting, USA)", "Resend (email delivery, USA)", "Anthropic PBC (Find my fit, USA)"].map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p>
          Transfers to the USA rely on the EU-US Data Privacy Framework or the European Commission&apos;s standard
          contractual clauses in each provider&apos;s data processing terms.
        </p>
        <TodoNote>Confirm each provider&apos;s DPA covers this.</TodoNote>
      </Section>

      <Section prose id="your-rights" labelledBy="your-rights-title">
        <SectionHeader id="your-rights-title" heading="Your rights" />
        <p>
          You can ask me to see, correct or delete the data I hold about you, to restrict or object to how I use it,
          or to receive a copy. Email me (<FooterEmail className="text-action" />) and I&apos;ll reply within one
          month. If you&apos;re not happy with how I&apos;ve handled it, you can complain to the Spanish data
          protection authority, the AEPD (aepd.es).
        </p>
      </Section>

      <Section prose id="changes" labelledBy="changes-title">
        <SectionHeader id="changes-title" heading="Changes" />
        <p>If this page changes, the date at the top changes too.</p>
      </Section>
    </main>
  );
}
