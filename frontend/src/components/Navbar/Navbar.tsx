import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CloseIcon from "@mui/icons-material/Close";

import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Men", path: "/products?audience=Men" },
  { label: "Women", path: "/products?audience=Women" },
  { label: "Kids", path: "/products?audience=Kids" },
  { label: "VELORA Studio", path: "/studio" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `navbar__link ${
                  isActive ? "navbar__link--active" : ""
                } ${link.label === "VELORA Studio" ? "navbar__studio" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="navbar__actions">
          <button
            className="navbar__icon-button navbar__search"
            type="button"
            aria-label="Search"
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            <SearchIcon />
          </button>

          <button
            className="navbar__icon-button navbar__favorite"
            type="button"
            aria-label="Favorites"
          >
            <FavoriteBorderIcon />
          </button>

          <button
            className="navbar__icon-button navbar__account"
            type="button"
            aria-label="Account"
          >
            <AccountCircleIcon />
          </button>

          <Link
            to="/cart"
            className="navbar__icon-button navbar__cart"
            aria-label="Shopping bag"
          >
            <LocalMallIcon />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar__icon-button navbar__menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
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
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.path}
            end={link.path === "/"}
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className={({ isActive }) =>
              `navbar__mobile-link ${
                isActive ? "navbar__mobile-link--active" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
