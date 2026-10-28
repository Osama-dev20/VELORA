import { Link } from "react-router-dom";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

// Adjust this path to where Categories.tsx lives in your project
import { products } from "../../assets/frontend_assets/assets";

import "./ProductCard.css";

// coverId = the product whose photo represents the category
const categories = [
  { name: "Men", coverId: "men-002" },
  { name: "Women", coverId: "women-012" },
  { name: "Kids", coverId: "kids-006" },
  { name: "Accessories", coverId: "acc-001" },
];

function ProductCard() {
  return (
    <section
      id="categories"
      className="categories"
      aria-labelledby="categories-title"
    >
      <div className="categories__inner">
        <header className="categories__header">
          <p className="categories__eyebrow">SHOP BY</p>
          <h2 id="categories-title" className="categories__title">
            Find your style
          </h2>
          <p className="categories__subtitle">
            Four collections, one wardrobe. Start with the one that fits you.
          </p>
        </header>

        <div className="categories__grid">
          {categories.map(({ name, coverId }) => {
            const cover =
              products.find((product) => product.id === coverId) ??
              products.find((product) => product.audience === name);
            const count = products.filter(
              (product) => product.audience === name,
            ).length;

            return (
              <Link
                key={name}
                to={`/products?audience=${encodeURIComponent(name)}`}
                className="categories__card"
              >
                <div className="categories__media">
                  {cover && (
                    <img
                      className="categories__image"
                      src={cover.image}
                      alt=""
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="categories__info">
                  <div>
                    <h3 className="categories__name">{name}</h3>
                    <p className="categories__count">{count} pieces</p>
                  </div>
                  <ArrowRightAltIcon
                    className="categories__arrow"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductCard;