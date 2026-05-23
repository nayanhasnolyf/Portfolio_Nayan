import { RevealText } from '@/components/ui/RevealText';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="reveal-child section-label font-semibold">
        {eyebrow}
      </p>
      <h2 className="reveal-child section-heading mt-3">
        <RevealText text={title} />
      </h2>
      {description ? (
        <p className="reveal-child body-copy mt-4 max-w-2xl text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
