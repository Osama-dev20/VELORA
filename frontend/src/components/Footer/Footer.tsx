import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

import "./Footer.css";

const shopLinks = ["Men", "Women", "Kids", "Accessories"];

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "All products", to: "/products" },
  { label: "VELORA Studio", to: "/#studio" },
  { label: "Shopping bag", to: "/cart" },
];

// TODO: replace with your real social accounts
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/", Icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/", Icon: FacebookIcon },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: YouTubeIcon },
];

function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: send the email to your backend or a newsletter service
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label="VELORA Home">
              VELORA<span>.</span>
            </Link>
            <p className="footer__about">
              Timeless clothing for men, women and kids. Find the look that
              feels like you.
            </p>

            <div className="footer__socials">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="footer__social"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <nav className="footer__column" aria-label="Shop">
            <h2 className="footer__heading">Shop</h2>
            <ul className="footer__list">
              {shopLinks.map((name) => (
                <li key={name}>
                  <Link
                    to={`/products?audience=${encodeURIComponent(name)}`}
                    className="footer__link"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Explore */}
          <nav className="footer__column" aria-label="Explore">
            <h2 className="footer__heading">Explore</h2>
            <ul className="footer__list">
              {exploreLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="footer__column footer__newsletter">
            <h2 className="footer__heading">Stay in the loop</h2>
            <p className="footer__about">
              New arrivals and offers, straight to your inbox.
            </p>

            {subscribed ? (
              <p className="footer__success" role="status">
                Thank you for subscribing.
              </p>
            ) : (
              <form className="footer__form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  name="email"
                  className="footer__input"
                  placeholder="Your email"
                  aria-label="Email address"
                  autoComplete="email"
                  required
                />
                <button type="submit" className="footer__submit">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} VELORA. All rights reserved.
          </p>

          <p className="footer__credit">
            Designed &amp; built by{" "}
            <a
              href="https://github.com/Osama-dev20/VELORA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Osama
            </a>
          </p>

          <button
            type="button"
            className="footer__top"
            onClick={scrollToTop}
          >
            Back to top <ArrowUpwardIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;