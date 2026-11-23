import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import SplitText from "@/components/SplitText";

export const metadata = { title: "Contact" };

const channels = [
  { title: "WhatsApp", value: "+91 98100 00000", text: "Fastest. Answered around the clock.", color: "var(--mint)" },
  { title: "Email", value: "hello@tripkite.travel", text: "We reply within four hours.", color: "var(--blue)" },
  { title: "Office", value: "Hauz Khas Village, New Delhi", text: "Mon–Sat, 10am to 7pm.", color: "var(--pink)" },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        img="1499856871958-5b9627545d1a"
        title="Talk to a real person"
        sub="Questions about a trip, a change to a booking, or something that went wrong. We're here."
        crumbs={[["Contact"]]}
        size="sm"
      />

      <section className="channels">
        {channels.map((c, i) => (
          <article key={c.title} className="channel" style={{ "--c": c.color, "--i": i }} data-reveal data-tilt>
            <h2>{c.title}</h2>
            <p className="channel-value">{c.value}</p>
            <p>{c.text}</p>
          </article>
        ))}
      </section>

      <section className="contact-grid">
        <div>
          <h2 className="display small" data-reveal><SplitText>Send us a message</SplitText></h2>
          <p className="section-sub">Add your booking reference if it&apos;s about a trip, and we&apos;ll have the details ready when we reply.</p>
        </div>
        <ContactForm />
      </section>

      <section className="faq" id="faq">
        <h2 className="display small" data-reveal><SplitText>Questions people ask</SplitText></h2>
        <Faq />
      </section>
    </main>
  );
}
