import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

// Adjust this path to where Hero.tsx lives in your project
import { assets, products } from "../../assets/frontend_assets/assets";

import "./Hero.css";

const AUTOPLAY_MS = 6000;

// Numbers come straight from your products data
const minPrice = Math.min(...products.map((product) => product.price));
const collectionCount = new Set(products.map((product) => product.audience)).size;

const stats = [
  { value: String(products.length), label: "Pieces" },
  { value: String(collectionCount), label: "Collections" },
  { value: `$${minPrice}`, label: "Starting at" },
];

// featuredId = the product shown in the floating card on that slide
const slides = [
  {
    image: assets.heroSection1,
    alt: "Racks of clothing inside the VELORA store",
    eyebrow: "NEW COLLECTION",
    title: "Dress the way you feel",
    text: "Timeless pieces for men, women and kids.",
    cta: { label: "Shop now", to: "/products" },
    secondary: { label: "Try VELORA Studio", to: "/#studio" },
    featuredId: "men-004",
  },
  {
    image: assets.heroSection2,
    alt: "VELORA store interior with clothing displays",
    eyebrow: "VELORA STUDIO",
    title: "See it on before you buy",
    text: "Pick pieces from the rail and find the look that feels right.",
    cta: { label: "Try VELORA Studio", to: "/#studio" },
    secondary: { label: "Shop all", to: "/products" },
    featuredId: "women-005",
  },
  {
    image: assets.heroSection3,
    alt: "Clothing and accessories displayed in the VELORA store",
    eyebrow: "EVERYDAY ESSENTIALS",
    title: "Simple pieces, endless looks",
    text: `Hoodies, denim and accessories from $${minPrice}.`,
    cta: { label: "Explore categories", to: "/#categories" },
    secondary: { label: "Shop all", to: "/products" },
    featuredId: "acc-001",
  },
];

const pad = (value: number) => String(value).padStart(2, "0");

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
          const feature = products.find(
            (product) => product.id === slide.featuredId,
          );
          const tab = isActive ? 0 : -1;

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
                <div className="hero__copy">
                  <p className="hero__eyebrow">{slide.eyebrow}</p>
                  <Heading className="hero__title">{slide.title}</Heading>
                  <p className="hero__text">{slide.text}</p>

                  <div className="hero__actions">
                    <Link
                      to={slide.cta.to}
                      className="hero__button hero__button--primary"
                      tabIndex={tab}
                    >
                      {slide.cta.label}
                    </Link>
                    <Link
                      to={slide.secondary.to}
                      className="hero__button hero__button--ghost"
                      tabIndex={tab}
                    >
                      {slide.secondary.label}
                    </Link>
                  </div>

                  <dl className="hero__stats">
                    {stats.map((stat) => (
                      <div key={stat.label} className="hero__stat">
                        <dt>{stat.label}</dt>
                        <dd>{stat.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {feature && (
                  <Link
                    to={`/products/${feature.id}`}
                    className="hero__feature"
                    tabIndex={tab}
                  >
                    <span className="hero__feature-media">
                      <img src={feature.image} alt="" loading="lazy" />
                    </span>
                    <span className="hero__feature-info">
                      <span className="hero__feature-label">Featured piece</span>
                      <span className="hero__feature-name">{feature.name}</span>
                      <span className="hero__feature-price">
                        ${feature.price.toFixed(2)}
                        <ArrowRightAltIcon aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="hero__controls">
        <div className="hero__thumbs">
          <span className="hero__counter" aria-hidden="true">
            {pad(index + 1)} / {pad(slides.length)}
          </span>

          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              className={`hero__thumb ${i === index ? "hero__thumb--active" : ""}`}
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
            >
              <img src={slide.image} alt="" loading="lazy" />
            </button>
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