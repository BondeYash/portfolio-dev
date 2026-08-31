import Image from "next/image";

/**
 * Wire photo, printed the only way newsprint can print a photo:
 * greyscale, high contrast, and screened into halftone dots.
 */
export function LeadArt({
  src,
  alt,
  caption,
  credit,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`col-break-avoid ${className}`}>
      <div
        data-halftone
        className="halftone relative aspect-[4/5] w-full overflow-hidden border-2 border-rule"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 22rem, 60vw"
          priority={priority}
          className="object-cover"
        />
      </div>
      <figcaption className="caption mt-1.5 border-b border-rule/40 pb-1.5 leading-snug">
        {caption}
        {credit ? (
          <span className="block text-[0.62rem] text-faded">{credit}</span>
        ) : null}
      </figcaption>
    </figure>
  );
}
