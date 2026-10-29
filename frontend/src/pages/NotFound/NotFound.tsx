import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./NotFound.css";

const collections = ["Men", "Women", "Kids", "Accessories"];

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | VELORA";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  // Go back if there is history, otherwise go home
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__inner">
        <svg
          className="not-found__hanger"
          viewBox="0 0 120 70"
          aria-hidden="true"
        >
          <path
            d="M60 36V26C60 20 68 18 68 11C68 6 64 3 60 3C55 3 52 6 52 11M60 36L8 60Q4 63 9 63H111Q116 63 112 60Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="not-found__code">404</p>
        <p className="not-found__eyebrow">PAGE NOT FOUND</p>

        <h1 id="not-found-title" className="not-found__title">
          We couldn&apos;t find that page
        </h1>
        <p className="not-found__text">
          Like our best pieces, it may have sold out, or the link may have
          changed. Try one of these instead.
        </p>

        <div className="not-found__actions">
          <Link to="/" className="not-found__button not-found__button--primary">
            Back to home
          </Link>
          <button
            type="button"
            className="not-found__button not-found__button--ghost"
            onClick={handleBack}
          >
            Go back
          </button>
        </div>

        <nav className="not-found__links" aria-label="Shop collections">
          <span className="not-found__links-label">Or shop</span>
          {collections.map((name) => (
            <Link
              key={name}
              to={`/products?audience=${encodeURIComponent(name)}`}
              className="not-found__chip"
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default NotFound;