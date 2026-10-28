import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";

import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Categories", sectionId: "categories" },
  { label: "Cards", sectionId: "cards" },
  { label: "VELORA Studio", sectionId: "studio", isStudio: true },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const toggleMenu = () => {
    setAccountOpen(false);
    setMenuOpen((open) => !open);
  };

  const toggleAccount = () => {
    setMenuOpen(false);
    setAccountOpen((open) => !open);
  };

  const handleFavorites = () => {
    closeMenu();
    navigate("/favorites");
  };

  const handleLogout = () => {
    closeMenu();
    // TODO: امسح حالة المستخدم/التوكن ثم انتقل لصفحة الدخول
    // navigate("/login");
  };

  const scrollToSection = (sectionId: string) => {
    closeMenu();

    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `/#${sectionId}`);
  };

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.slice(1);

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.pathname, location.hash]);

  // Close account dropdown on outside click or Escape
  useEffect(() => {
    if (!accountOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [accountOpen]);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link
          to="/"
          className="navbar__logo"
          aria-label="VELORA Home"
          onClick={closeMenu}
        >
          VELORA<span>.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.sectionId ? (
              <button
                key={link.label}
                type="button"
                className={`navbar__link ${
                  link.isStudio ? "navbar__studio" : ""
                }`}
                onClick={() => scrollToSection(link.sectionId!)}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.path!}
                className={`navbar__link ${
                  location.pathname === "/" && !location.hash
                    ? "navbar__link--active"
                    : ""
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        {/* Action Icons */}
        <div className="navbar__actions">
          <button
            className="navbar__icon-button"
            type="button"
            aria-label="Search products"
            onClick={() => navigate("/products")}
          >
            <SearchIcon />
          </button>

          {/* Account + Dropdown */}
          <div className="navbar__account" ref={accountRef}>
            <button
              className="navbar__icon-button"
              type="button"
              aria-label="Account"
              aria-expanded={accountOpen}
              aria-controls="account-dropdown"
              onClick={toggleAccount}
            >
              <AccountCircleIcon />
            </button>

            {accountOpen && (
              <div id="account-dropdown" className="navbar__dropdown">
                <button
                  type="button"
                  className="navbar__dropdown-item"
                  onClick={handleFavorites}
                >
                  <FavoriteBorderIcon />
                  <span>Favorites</span>
                </button>

                <div className="navbar__dropdown-divider" role="separator" />

                <button
                  type="button"
                  className="navbar__dropdown-item"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="navbar__icon-button"
            aria-label="Shopping bag"
            onClick={closeMenu}
          >
            <LocalMallIcon />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="navbar__icon-button navbar__menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`navbar__mobile-menu ${
          menuOpen ? "navbar__mobile-menu--open" : ""
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navLinks.map((link) =>
          link.sectionId ? (
            <button
              key={link.label}
              type="button"
              tabIndex={menuOpen ? 0 : -1}
              className={`navbar__mobile-link ${
                link.isStudio ? "navbar__studio" : ""
              }`}
              onClick={() => scrollToSection(link.sectionId!)}
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.label}
              to={link.path!}
              tabIndex={menuOpen ? 0 : -1}
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}

export default Navbar;