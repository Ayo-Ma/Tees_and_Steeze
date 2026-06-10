import { useEffect, useRef, useState } from "react";
import {
  getHomepage,
  urlFor,
} from "../../tees-and-steeze/settings/src/lib/sanity";

const LAYOUT = [
  {
    top: "0%",
    left: "0%",
    width: "42%",
    aspectRatio: "3 / 4",
    rotate: "-1.5deg",
    zIndex: 2,
  },
  {
    top: "-3%",
    left: "48%",
    width: "30%",
    aspectRatio: "4 / 5",
    rotate: "2deg",
    zIndex: 1,
  },
  {
    top: "28%",
    left: "72%",
    width: "26%",
    aspectRatio: "1 / 1",
    rotate: "-2.5deg",
    zIndex: 3,
  },
  {
    top: "52%",
    left: "5%",
    width: "32%",
    aspectRatio: "4 / 5",
    rotate: "1.8deg",
    zIndex: 2,
  },
  {
    top: "48%",
    left: "35%",
    width: "38%",
    aspectRatio: "3 / 4",
    rotate: "-1deg",
    zIndex: 1,
  },
  {
    top: "70%",
    left: "70%",
    width: "28%",
    aspectRatio: "1 / 1",
    rotate: "3deg",
    zIndex: 3,
  },
];

function UGCImage({ image, layout, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = image.asset
    ? urlFor(image).width(500).quality(80).auto("format").url()
    : image.src || "/hero.jpg";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute overflow-hidden cursor-pointer"
      style={{
        top: layout.top,
        left: layout.left,
        width: layout.width,
        aspectRatio: layout.aspectRatio,
        transform: visible
          ? `rotate(${layout.rotate}) scale(1)`
          : `rotate(${layout.rotate}) scale(0.95)`,
        opacity: visible ? 1 : 0,
        zIndex: hovered ? 10 : layout.zIndex,
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imageUrl}
        alt={`Customer wearing Tee's and Steeze`}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {image.handle && (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-2"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 200ms ease",
          }}
        >
          <span className="caption" style={{ color: "var(--color-bone)" }}>
            {image.handle}
          </span>
        </div>
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: "1px solid rgba(245, 244, 240, 0.08)" }}
      />
    </div>
  );
}

function MobileUGCGrid({ images }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const mobileAspects = ["3/4", "1/1", "1/1", "3/4", "3/4", "1/1"];

  return (
    <div ref={ref} className="grid grid-cols-2 gap-2">
      {images.map((image, i) => {
        const imageUrl = image.asset
          ? urlFor(image).width(400).quality(80).auto("format").url()
          : image.src || "/hero.jpg";

        return (
          <div
            key={i}
            className="overflow-hidden"
            style={{
              aspectRatio: mobileAspects[i] || "1/1",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms`,
            }}
          >
            <img
              src={imageUrl}
              alt={`Customer wearing Tee's and Steeze`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function RealFits() {
  const headingRef = useRef(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [ugcImages, setUgcImages] = useState([]);
  const [headline, setHeadline] = useState("Worn, not modelled.");
  const [subheadline, setSubheadline] = useState(
    "Real people. Real fits. No casting calls.",
  );

  useEffect(() => {
    getHomepage()
      .then((data) => {
        if (data?.ugcImages) setUgcImages(data.ugcImages);
        if (data?.ugcHeadline) setHeadline(data.ugcHeadline);
        if (data?.ugcSubheadline) setSubheadline(data.ugcSubheadline);
      })
      .catch((err) => console.error("Failed to load UGC:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 },
    );
    if (headingRef.current) observer.observe(headingRef.current);
    return () => observer.disconnect();
  }, []);

  // Don't render if no UGC images
  if (ugcImages.length === 0) return null;

  return (
    <section aria-label="Community" className="section">
      <div className="container">
        <div
          ref={headingRef}
          className="mb-12 md:mb-16"
          style={{
            opacity: headingVisible ? 1 : 0,
            transform: headingVisible ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="display-md">{headline}</h2>
          <p className="body-sm mt-3" style={{ color: "var(--color-dim)" }}>
            {subheadline}
          </p>
        </div>

        <div
          className="relative hidden md:block"
          style={{
            paddingBottom:
              ugcImages.length <= 2
                ? "50%"
                : ugcImages.length <= 4
                  ? "70%"
                  : "95%",
          }}
        >
          {ugcImages.slice(0, 6).map((image, i) => (
            <UGCImage
              key={i}
              image={image}
              layout={LAYOUT[i % LAYOUT.length]}
              index={i}
            />
          ))}
        </div>
        <div className="block md:hidden">
          <MobileUGCGrid images={ugcImages.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}
