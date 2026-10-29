import { useMemo, useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import type { Product } from "../../type/product";

// Adjust this path to where Studio.tsx lives in your project
import { products } from "../../assets/frontend_assets/assets";

import "./Studio.css";

/* ---------- Types & constants ---------- */

type Zone = "top" | "bottom" | "shoes" | "head" | "face" | "hand" | "waist";
type Look = Partial<Record<Zone, Product>>;

const AUDIENCES = ["Men", "Women", "Kids"] as const;
type Audience = (typeof AUDIENCES)[number];

const TABS = [
  { id: "tops", label: "Tops", zones: ["top"] },
  { id: "bottoms", label: "Bottoms", zones: ["bottom"] },
  { id: "shoes", label: "Shoes", zones: ["shoes"] },
  { id: "accessories", label: "Accessories", zones: ["head", "face", "hand", "waist"] },
] as const;
type TabId = (typeof TABS)[number]["id"];

// Drawing order on the model (first = back, last = front)
const ZONE_ORDER: Zone[] = ["shoes", "bottom", "top", "waist", "hand", "face", "head"];

/* ---------- Helpers ---------- */

const isDress = (product: Product) => product.category === "Dresses";

// Decide where a product goes on the model
function zoneOf(product: Product): Zone | null {
  if (product.audience === "Accessories") {
    const name = product.name.toLowerCase();
    if (name.includes("cap")) return "head";
    if (name.includes("sunglasses")) return "face";
    if (name.includes("bag")) return "hand";
    if (name.includes("belt")) return "waist";
    return null;
  }
  if (product.category === "Shoes") return "shoes";
  if (product.category === "Pants") return "bottom";
  if (["T-shirts", "Hoodies", "Dresses"].includes(product.category)) return "top";
  return null;
}

// Pieces available for a zone (accessories are shared by every audience)
function piecesFor(zone: Zone, audience: Audience): Product[] {
  const isAccessoryZone = ["head", "face", "hand", "waist"].includes(zone);
  return products.filter(
    (product) =>
      zoneOf(product) === zone &&
      (isAccessoryZone
        ? product.audience === "Accessories"
        : product.audience === audience),
  );
}

function pick<T>(list: T[]): T | undefined {
  return list[Math.floor(Math.random() * list.length)];
}

// Simple color heuristic: neutrals are easy, bright colors are accents
const ACCENTS = ["burgundy", "green", "pink", "yellow", "blue"];

function accentOf(product: Product): string | null {
  const name = product.name.toLowerCase();
  if (name.includes("jeans")) return null; // denim reads as neutral
  return ACCENTS.find((color) => name.includes(color)) ?? null;
}

function styleTip(items: Product[]): string {
  if (items.length < 2) return "Pick a few pieces to see how they look together.";

  const accents = new Set(items.map(accentOf).filter(Boolean));

  if (accents.size === 0) return "Neutral palette: easy to wear and easy to mix.";
  if (accents.size === 1) return "One accent color: a confident, balanced look.";
  return "Several bold colors: try a neutral piece to calm the look.";
}

const Hanger = () => (
  <svg className="studio__hanger" viewBox="0 0 48 22" aria-hidden="true">
    <path
      d="M24 11V8.5C24 7 26 6.5 26 4.5C26 3 25 2 23.5 2C22 2 21 3 21 4.5M24 11L3 19Q2 20 3.5 20H44.5Q46 20 45 19Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ---------- Component ---------- */

function Studio() {
  const [audience, setAudience] = useState<Audience>("Women");
  const [tab, setTab] = useState<TabId>("tops");
  const [look, setLook] = useState<Look>({});
  const [added, setAdded] = useState(false);

  const activeTab = TABS.find((item) => item.id === tab)!;

  const railItems = useMemo(
    () => activeTab.zones.flatMap((zone) => piecesFor(zone, audience)),
    [activeTab, audience],
  );

  const items = ZONE_ORDER.map((zone) => look[zone]).filter(
    (product): product is Product => Boolean(product),
  );
  const total = items.reduce((sum, product) => sum + product.price, 0);

  const changeAudience = (next: Audience) => {
    setAudience(next);
    setLook({});
    setAdded(false);
  };

  // Add a piece to the model, or remove it if it is already there
  const choose = (product: Product) => {
    const zone = zoneOf(product);
    if (!zone) return;

    setLook((current) => {
      const next = { ...current };

      if (current[zone]?.id === product.id) {
        delete next[zone];
        return next;
      }

      next[zone] = product;
      if (isDress(product)) delete next.bottom; // a dress replaces the pants
      if (zone === "bottom" && current.top && isDress(current.top)) delete next.top;
      return next;
    });
    setAdded(false);
  };

  const removeZone = (zone: Zone) => {
    setLook((current) => {
      const next = { ...current };
      delete next[zone];
      return next;
    });
    setAdded(false);
  };

  const shuffle = () => {
    const next: Look = {};

    const top = pick(piecesFor("top", audience));
    if (top) next.top = top;

    if (top && !isDress(top)) {
      const bottom = pick(piecesFor("bottom", audience));
      if (bottom) next.bottom = bottom;
    }

    const shoes = pick(piecesFor("shoes", audience));
    if (shoes) next.shoes = shoes;

    const accessoryZone = pick<Zone>(["head", "face", "hand", "waist"]);
    const accessory = accessoryZone && pick(piecesFor(accessoryZone, audience));
    if (accessoryZone && accessory) next[accessoryZone] = accessory;

    setLook(next);
    setAdded(false);
  };

  const addLookToBag = () => {
    // TODO: connect to your cart (Context / Redux) when the cart is ready
    console.log(
      "Add look to bag:",
      items.map((product) => product.id),
    );
    setAdded(true);
  };

  return (
    <section id="studio" className="studio" aria-labelledby="studio-title">
      <div className="studio__inner">
        <header className="studio__header">
          <p className="studio__eyebrow">VELORA STUDIO</p>
          <h2 id="studio-title" className="studio__title">
            Build your look
          </h2>
          <p className="studio__subtitle">
            Pick pieces from the rail and see how they look together on the
            model.
          </p>
        </header>

        <div className="studio__layout">
          {/* Model stage */}
          <div className="studio__stage-wrap">
            <div
              className="studio__stage"
              role="img"
              aria-label={
                items.length
                  ? `Outfit preview: ${items.map((p) => p.name).join(", ")}`
                  : "Empty outfit preview"
              }
            >
              <svg className="studio__model" viewBox="0 0 300 560" aria-hidden="true">
                <circle cx="150" cy="48" r="30" />
                <rect x="138" y="74" width="24" height="22" rx="8" />
                <rect x="95" y="96" width="110" height="170" rx="40" />
                <rect x="62" y="104" width="28" height="160" rx="14" />
                <rect x="210" y="104" width="28" height="160" rx="14" />
                <rect x="108" y="258" width="40" height="270" rx="16" />
                <rect x="152" y="258" width="40" height="270" rx="16" />
              </svg>

              {ZONE_ORDER.map((zone) => {
                const product = look[zone];
                if (!product) return null;

                return (
                  <img
                    key={zone}
                    src={product.image}
                    alt=""
                    className={`studio__layer studio__layer--${zone} ${
                      isDress(product) ? "studio__layer--dress" : ""
                    }`}
                  />
                );
              })}

              {items.length === 0 && (
                <p className="studio__empty">Choose a piece from the rail</p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="studio__panel">
            <div className="studio__chips" role="group" aria-label="Collection">
              {AUDIENCES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`studio__chip ${
                    item === audience ? "studio__chip--active" : ""
                  }`}
                  aria-pressed={item === audience}
                  onClick={() => changeAudience(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="studio__chips" role="group" aria-label="Piece type">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`studio__chip studio__chip--tab ${
                    item.id === tab ? "studio__chip--active" : ""
                  }`}
                  aria-pressed={item.id === tab}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Clothes rail */}
            <ul className="studio__rail" aria-label={`${activeTab.label} rail`}>
              {railItems.map((product) => {
                const zone = zoneOf(product)!;
                const selected = look[zone]?.id === product.id;

                return (
                  <li key={product.id} className="studio__item">
                    <Hanger />
                    <button
                      type="button"
                      className={`studio__piece ${
                        selected ? "studio__piece--selected" : ""
                      }`}
                      aria-pressed={selected}
                      aria-label={`${product.name}, $${product.price}`}
                      onClick={() => choose(product)}
                    >
                      <span className="studio__piece-media">
                        <img src={product.image} alt="" loading="lazy" />
                      </span>
                      <span className="studio__piece-name">{product.name}</span>
                      <span className="studio__piece-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Summary */}
            <div className="studio__summary">
              <div className="studio__summary-head">
                <h3 className="studio__summary-title">Your look</h3>
                <div className="studio__tools">
                  <button type="button" className="studio__tool" onClick={shuffle}>
                    <ShuffleIcon aria-hidden="true" /> Surprise me
                  </button>
                  <button
                    type="button"
                    className="studio__tool"
                    onClick={() => {
                      setLook({});
                      setAdded(false);
                    }}
                    disabled={items.length === 0}
                  >
                    <RestartAltIcon aria-hidden="true" /> Reset
                  </button>
                </div>
              </div>

              {items.length > 0 && (
                <ul className="studio__selected">
                  {ZONE_ORDER.map((zone) => {
                    const product = look[zone];
                    if (!product) return null;

                    return (
                      <li key={zone} className="studio__tag">
                        <span>{product.name}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => removeZone(zone)}
                        >
                          <CloseIcon aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="studio__tip">
                <strong>Style tip:</strong> {styleTip(items)}
              </p>

              <div className="studio__checkout">
                <span className="studio__total">
                  Total <strong>${total.toFixed(2)}</strong>
                </span>
                <button
                  type="button"
                  className="studio__add"
                  disabled={items.length === 0}
                  onClick={addLookToBag}
                >
                  {added ? (
                    <>
                      <CheckIcon aria-hidden="true" /> Added to bag
                    </>
                  ) : (
                    "Add look to bag"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Studio;