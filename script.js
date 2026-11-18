(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const drawer = $("#drawer");
  const drawerPanel = drawer?.querySelector("aside");
  const items = $("#bagItems");
  const count = $("#bagCount");
  const total = $("#bagTotal");
  const bagOpen = $("#bagOpen");
  const bagClose = $("#bagClose");
  const menuButton = $("#hamb");
  const nav = $("#nav");
  const currency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  });

  if (!drawer || !items || !count || !total) return;

  const STORAGE_KEY = "noire-bag-v1";
  let cart = [];

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) {
      cart = saved.filter((item) =>
        item &&
        typeof item.name === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) >= 0 &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
      ).map((item) => ({
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity)
      }));
    }
  } catch {
    cart = [];
  }

  const saveCart = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // The bag remains usable for the current session if storage is unavailable.
    }
  };

  const render = () => {
    const quantity = cart.reduce((sum, product) => sum + product.quantity, 0);
    const subtotal = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
    count.textContent = String(quantity);
    count.setAttribute("aria-label", `${quantity} Artikel in der Bag`);
    total.textContent = currency.format(subtotal);
    items.replaceChildren();

    if (!cart.length) {
      const empty = document.createElement("p");
      empty.className = "bag-empty";
      empty.textContent = "Deine Bag ist noch leer.";
      items.append(empty);
      saveCart();
      return;
    }

    cart.forEach((product, index) => {
      const row = document.createElement("div");
      row.className = "bag-item";

      const details = document.createElement("div");
      details.className = "bag-item-details";

      const name = document.createElement("span");
      name.className = "bag-item-name";
      name.textContent = product.name;

      const price = document.createElement("small");
      price.textContent = `${product.quantity} × ${currency.format(product.price)}`;

      details.append(name, price);

      const actions = document.createElement("div");
      actions.className = "bag-item-actions";

      const lineTotal = document.createElement("strong");
      lineTotal.textContent = currency.format(product.price * product.quantity);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "bag-remove";
      remove.dataset.remove = String(index);
      remove.setAttribute("aria-label", `${product.name} entfernen`);
      remove.textContent = "Entfernen";

      actions.append(lineTotal, remove);
      row.append(details, actions);
      items.append(row);
    });

    saveCart();
  };

  const openDrawer = () => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-is-open");
    bagOpen?.setAttribute("aria-expanded", "true");
    window.setTimeout(() => bagClose?.focus(), 50);
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-is-open");
    bagOpen?.setAttribute("aria-expanded", "false");
    bagOpen?.focus();
  };

  $$(".filters button").forEach((button) => {
    button.setAttribute("aria-pressed", button.classList.contains("selected") ? "true" : "false");
    button.addEventListener("click", () => {
      $$(".filters button").forEach((other) => {
        const selected = other === button;
        other.classList.toggle("selected", selected);
        other.setAttribute("aria-pressed", String(selected));
      });

      const filter = button.dataset.filter || "all";
      $$(".products article").forEach((article) => {
        const kinds = (article.dataset.kind || "").split(/\s+/);
        article.hidden = filter !== "all" && !kinds.includes(filter);
      });
    });
  });

  $$(".add").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.name?.trim();
      const price = Number(button.dataset.price);
      if (!name || !Number.isFinite(price) || price < 0) return;

      const existing = cart.find((product) => product.name === name && product.price === price);
      if (existing) existing.quantity += 1;
      else cart.push({ name, price, quantity: 1 });

      render();
      openDrawer();
    });
  });

  items.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) return;
    cart.splice(Number(button.dataset.remove), 1);
    render();
  });

  bagOpen?.addEventListener("click", openDrawer);
  bagClose?.addEventListener("click", closeDrawer);
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) closeDrawer();
  });

  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-controls", "nav");
  menuButton?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open") ?? false;
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
  });

  $$("#nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Menü öffnen");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (drawer.classList.contains("open")) closeDrawer();
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Menü öffnen");
    }
  });

  drawer.setAttribute("aria-hidden", "true");
  drawerPanel?.setAttribute("role", "dialog");
  drawerPanel?.setAttribute("aria-modal", "true");
  drawerPanel?.setAttribute("aria-label", "Deine Bag");
  bagOpen?.setAttribute("aria-controls", "drawer");
  bagOpen?.setAttribute("aria-expanded", "false");
  render();
})();