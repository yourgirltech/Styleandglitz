import { useRef, useState } from "react";
import { Link } from "react-router-dom";

interface PanelProps {
  to: string;
  title: string;
  count: string;
  image: string;
  video: string;
  clipPath: string;
  align: "left" | "right";
  focus?: string;
}

function Panel({ to, title, count, image, video, clipPath, align, focus = "center" }: PanelProps) {
  const [hovered, setHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Link
      to={to}
      onMouseEnter={() => {
        setHovered(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovered(false);
        videoRef.current?.pause();
      }}
      style={{ clipPath }}
      className="group absolute inset-0 block overflow-hidden bg-graphite"
    >
      {/* Sized to roughly this panel's own visible share of the diptych — not
          the full container — so a square/portrait source photo doesn't get
          forced into an ultra-wide box and blown up past recognition. */}
      <div className={`absolute inset-y-0 w-[62%] ${align === "left" ? "left-0" : "right-0"}`}>
        <img
          src={image}
          alt={title}
          style={{ objectPosition: focus }}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-luxury ${
            hovered && !videoFailed ? "opacity-0 scale-105" : "opacity-100 scale-100 group-hover:scale-105"
          }`}
        />
        {!videoFailed && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            style={{ objectPosition: focus }}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-luxury ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-graphite/85 via-graphite/25 to-graphite/40" />

      <div
        className={`absolute inset-0 flex flex-col justify-end p-8 md:p-14 ${
          align === "left" ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <p className="eyebrow text-gold mb-3">{count}</p>
        <p className="font-heading text-3xl md:text-5xl text-cream leading-tight mb-4 max-w-xs">
          {title}
        </p>
        <span className="eyebrow text-cream/70 border-b border-gold/50 pb-1 group-hover:text-gold group-hover:border-gold transition-colors duration-500">
          Explore Collection
        </span>
      </div>
    </Link>
  );
}

interface CategoryDiptychProps {
  watchesImage: string;
  watchesVideo: string;
  watchesCount: number;
  moissaniteImage: string;
  moissaniteVideo: string;
  moissaniteCount: number;
}

export default function CategoryDiptych({
  watchesImage,
  watchesVideo,
  watchesCount,
  moissaniteImage,
  moissaniteVideo,
  moissaniteCount,
}: CategoryDiptychProps) {
  return (
    <div className="relative w-full h-[420px] md:h-[560px]">
      <Panel
        to="/watches"
        title="Luxury Watches"
        count={`${watchesCount} Timepieces`}
        image={watchesImage}
        video={watchesVideo}
        align="left"
        clipPath="polygon(0 0, 55% 0, 45% 100%, 0% 100%)"
      />
      <Panel
        to="/moissanite"
        title="Moissanite Jewellery"
        count={`${moissaniteCount} Fine Pieces`}
        image={moissaniteImage}
        video={moissaniteVideo}
        align="right"
        focus="center 75%"
        clipPath="polygon(55% 0, 100% 0, 100% 100%, 45% 100%)"
      />

      {/* Medallion marking the seam — the detail that turns two photos into one composed piece */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cream border border-gold flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <span className="font-heading text-xl md:text-2xl text-forest">
            S<span className="text-gold">&amp;</span>G
          </span>
        </div>
      </div>
    </div>
  );
}
