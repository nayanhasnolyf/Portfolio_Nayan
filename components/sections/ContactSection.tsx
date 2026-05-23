import { RevealScope } from '@/components/interaction/RevealScope';
import { ScrollTilt } from '@/components/interaction/ScrollTilt';
import { AeroGlass } from '@/components/ui/GlassPanel';
import { RevealText } from '@/components/ui/RevealText';
import { profile } from '@/lib/content';

export function ContactSection() {
  const contactLinks = [
    { href: `mailto:${profile.email}`, label: 'Email', className: 'contact-link-primary' },
    { href: profile.linkedin, label: 'LinkedIn', className: 'contact-link-secondary' },
    { href: profile.github, label: 'GitHub', className: 'contact-link-secondary' },
  ];

  return (
    <RevealScope>
      <section id="contact" className="scroll-mt-28 pt-16 pb-24">
        <ScrollTilt>
          <AeroGlass variant="modal" tone="frost" floating className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
            <div>
              <p className="reveal-child section-label font-semibold">
                Contact
              </p>
              <h2 className="reveal-child section-heading mt-4 max-w-3xl">
                <RevealText text="Let’s build something." />
              </h2>
              <p className="reveal-child body-copy mt-5 max-w-2xl">
                Based in Bangalore. Open to remote, hybrid, or on-site roles and collaborations.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`reveal-child ${link.className}`}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </AeroGlass>
        </ScrollTilt>
      </section>
    </RevealScope>
  );
}
