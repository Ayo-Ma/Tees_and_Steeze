import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-QV42G64LF7");
};

export const logPageView = () => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
};




export const trackAddToCart = (product, size, quantity = 1) => {
  ReactGA.event("add_to_cart", {
    currency: "NGN",
    value: Number(product.price) * quantity,
    items: [
      {
        item_id: String(product.id),
        item_name: product.name || "",
        item_category: product.category || "Fashion",
        item_variant: size || "",
        price: Number(product.price) || 0,
        quantity,
      },
    ],
  });
};

export const trackRemoveFromCart = (item) => {
  ReactGA.event("remove_from_cart", {
    currency: "NGN",
    value: Number(item.price) * item.quantity,
    items: [
      {
        item_id: String(item.id),
        item_name: item.name || "",
        item_category: item.category || "Fashion",
        item_variant: item.size || "",
        price: Number(item.price) || 0,
        quantity: item.quantity || 1,
      },
    ],
  });
};