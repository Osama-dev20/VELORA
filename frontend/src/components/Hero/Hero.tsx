import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Adjust this path to where Hero.tsx lives in your project
import { assets, products } from "../../assets/frontend_assets/assets";

import "./Hero.css";

const AUTOPLAY_MS = 6000;
const minPrice = Math.min(...products.map((product) => product.price));

const slides = [
  {
    image: assets.heroSection1,
    alt: "Racks of clothing inside the VELORA store",
    eyebrow: "NEW COLLECTION",
    title: "Dress the way you feel",
    text: "Timeless pieces for men, women and kids.",
    cta: { label: "Shop now", to: "/products" },
  },
  {
    image: assets.heroSection2,
    alt: "VELORA store interior with clothing displays",
    eyebrow: "VELORA STUDIO",
    title: "See it on before you buy",
    text: "Try pieces on a model and find the look that feels right.",
    cta: { label: "Try VELORA Studio", to: "/#studio" },
  },
  {
    image: assets.heroSection3,
    alt: "Clothing and accessories displayed in the VELORA store",
    eyebrow: "EVERYDAY ESSENTIALS",
    title: "Simple pieces, endless looks",
    text: `Hoodies, denim and accessories from $${minPrice}.`,
    cta: { label: "Explore categories", to: "/#categories" },
  },
];

function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const goTo = useCallback((next: number) => {
    setIndex((next + slides.length) % slides.length);
  }, []);

  // Autoplay: stops on hover/focus and for users who prefer reduced motion
  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearTimeout(timer);
  }, [index, paused, reduceMotion]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="hero__slides"
        aria-live={paused || reduceMotion ? "polite" : "off"}
      >
        {slides.map((slide, i) => {
          const isActive = i === index;
          const Heading = i === 0 ? "h1" : "h2";

          return (
            <div
              key={slide.title}
              className={`hero__slide ${isActive ? "hero__slide--active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              aria-hidden={!isActive}
            >
              <img
                className="hero__image"
                src={slide.image}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="hero__overlay" />

              <div className="hero__content">
                <p className="hero__eyebrow">{slide.eyebrow}</p>
                <Heading className="hero__title">{slide.title}</Heading>
                <p className="hero__text">{slide.text}</p>

                <div className="hero__actions">
                  <Link
                    to={slide.cta.to}
                    className="hero__button hero__button--primary"
                    tabIndex={isActive ? 0 : -1}
                  >
                    {slide.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="hero__controls">
        <div className="hero__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              className={`hero__dot ${i === index ? "hero__dot--active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div className="hero__arrows">
          <button
            type="button"
            className="hero__arrow"
            aria-label="Previous slide"
            onClick={() => goTo(index - 1)}
          >
            <ArrowBackIosNewIcon />
          </button>
          <button
            type="button"
            className="hero__arrow"
            aria-label="Next slide"
            onClick={() => goTo(index + 1)}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;