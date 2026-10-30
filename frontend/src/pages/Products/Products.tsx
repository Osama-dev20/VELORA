import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";

// استيراد المنتجات مباشرة من ملف الـ assets (تأكد أن المسار دقيق حسب مكان ملفك الحالي)
import { products } from "../../assets/frontend_assets/assets";

import "./Products.css";

/* ---------- Types & Constants ---------- */

const AUDIENCES = ["Men", "Women", "Kids", "Accessories"] as const;
type Audience = (typeof AUDIENCES)[number];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
] as const;
type SortValue = (typeof SORTS)[number]["value"];

// تعريف نوع المنتج محلياً لمنع أي خطأ استيراد للـ types
type ProductItem = {
  id: string;
  name: string;
  category: string;
  audience: string;
  image: string;
  price: number;
  badge?: string;
  sizes?: string[];
};

const prices = products.map((product) => product.price);
const PRICE_MIN = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
const PRICE_MAX = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

const countFor = (name: Audience | "All") =>
  name === "All"
    ? products.length
    : products.filter((product) => product.audience === name).length;

const matchesQuery = (product: ProductItem, query: string) => {
  if (!query) return true;
  const text =
    `${product.name} ${product.category} ${product.audience}`.toLowerCase();
  return text.includes(query.toLowerCase().trim());
};

/* ---------- Component ---------- */

function Products() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const audienceParam = params.get("audience");
  const audience: Audience | "All" =
    AUDIENCES.find((name) => name === audienceParam) ?? "All";

  const query = params.get("q") ?? "";

  const sortParam = params.get("sort");
  const sort: SortValue =
    SORTS.find((item) => item.value === sortParam)?.value ?? "featured";

  const maxParam = Number(params.get("max"));
  const maxPrice =
    !isNaN(maxParam) && maxParam >= PRICE_MIN && maxParam <= PRICE_MAX
      ? maxParam
      : PRICE_MAX;

  // Categories available for the selected collection
  const categoryOptions = useMemo(() => {
    const base =
      audience === "All"
        ? products
        : products.filter((product) => product.audience === audience);
    return Array.from(new Set(base.map((product) => product.category)));
  }, [audience]);

  const activeCategories = (params.get("category")?.split(",") ?? []).filter(
    (category) => categoryOptions.includes(category),
  );
  const categoryKey = activeCategories.join(",");

  const activeCount =
    (audience !== "All" ? 1 : 0) +
    activeCategories.length +
    (maxPrice < PRICE_MAX ? 1 : 0);

  /* ---------- URL helpers ---------- */

  const setParam = (key: string, value: string | null) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };

  const changeAudience = (name: Audience | "All") => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (name === "All") next.delete("audience");
        else next.set("audience", name);
        next.delete("category");
        return next;
      },
      { replace: true },
    );
  };

  const toggleCategory = (category: string) => {
    const next = activeCategories.includes(category)
      ? activeCategories.filter((item) => item !== category)
      : [...activeCategories, category];
    setParam("category", next.length > 0 ? next.join(",") : null);
  };

  const changeMaxPrice = (value: number) => {
    setParam("max", value >= PRICE_MAX ? null : String(value));
  };

  const clearFilters = () => {
    setParams(new URLSearchParams(), { replace: true });
  };

  /* ---------- Results ---------- */

  const results = useMemo(() => {
    const list = products.filter(
      (product: ProductItem) =>
        (audience === "All" || product.audience === audience) &&
        (categoryKey === "" || categoryKey.split(",").includes(product.category)) &&
        product.price <= maxPrice &&
        matchesQuery(product, query),
    );

    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [audience, categoryKey, maxPrice, query, sort]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Shop | VELORA";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const title = audience === "All" ? "All products" : audience;

  return (
    <div className="products">
      <div className="products__inner">
        {/* Header */}
        <header className="products__header">
          <nav className="products__breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            {audience === "All" ? (
              <span aria-current="page">Shop</span>
            ) : (
              <>
                <Link to="/products">Shop</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{audience}</span>
              </>
            )}
          </nav>

          <h1 className="products__title">{title}</h1>
          <p className="products__count" aria-live="polite">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
        </header>

        {/* Toolbar */}
        <div className="products__toolbar">
          <div className="products__search">
            <SearchIcon aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Search products"
              aria-label="Search products"
              onChange={(event) => setParam("q", event.target.value || null)}
            />
          </div>

          <button
            type="button"
            className="products__filter-toggle"
            aria-expanded={filtersOpen}
            aria-controls="product-filters"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <TuneIcon aria-hidden="true" />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>

          <label className="products__sort">
            <span className="products__sort-label">Sort by</span>
            <select
              value={sort}
              onChange={(event) =>
                setParam(
                  "sort",
                  event.target.value === "featured" ? null : event.target.value,
                )
              }
            >
              {SORTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="products__layout">
          {/* Filters */}
          <aside
            id="product-filters"
            className={`products__filters ${
              filtersOpen ? "products__filters--open" : ""
            }`}
            aria-label="Filters"
          >
            <fieldset className="products__group">
              <legend className="products__legend">Collection</legend>
              {(["All", ...AUDIENCES] as const).name?.length ?? (["All", ...AUDIENCES] as const).map((name) => (
                <label key={name} className="products__option">
                  <input
                    type="radio"
                    name="audience"
                    checked={audience === name}
                    onChange={() => changeAudience(name)}
                  />
                  <span>{name}</span>
                  <span className="products__option-count">{countFor(name)}</span>
                </label>
              ))}
            </fieldset>

            {categoryOptions.length > 1 && (
              <fieldset className="products__group">
                <legend className="products__legend">Category</legend>
                {categoryOptions.map((category) => (
                  <label key={category} className="products__option">
                    <input
                      type="checkbox"
                      checked={activeCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="products__group">
              <label htmlFor="max-price" className="products__legend">
                Max price: <strong>${maxPrice}</strong>
              </label>
              <input
                id="max-price"
                type="range"
                className="products__range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={maxPrice}
                onChange={(event) => changeMaxPrice(Number(event.target.value))}
              />
              <div className="products__range-labels" aria-hidden="true">
                <span>${PRICE_MIN}</span>
                <span>${PRICE_MAX}</span>
              </div>
            </div>

            {activeCount > 0 && (
              <button
                type="button"
                className="products__clear"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="products__results">
            {results.length > 0 ? (
              <div className="products__grid">
                {results.map((product: ProductItem) => (
                  <div key={product.id} className="product-card-fallback" style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#fff" }}>
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
                    <h3 style={{ fontSize: "16px", marginTop: "10px" }}>{product.name}</h3>
                    <p style={{ fontWeight: "bold", color: "#333", marginTop: "5px" }}>${product.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="products__empty">
                <h2>No pieces match your search</h2>
                <p>Try removing a filter or searching for something else.</p>
                <button
                  type="button"
                  className="products__button"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;