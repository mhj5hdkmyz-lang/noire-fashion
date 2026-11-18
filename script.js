(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const drawer = $("#drawer"), bagItems = $("#bagItems"), bagCount = $("#bagCount"), bagTotal = $("#bagTotal");
  const checkoutButton = $("#checkoutButton"), checkoutMessage = $("#checkoutMessage");
  const dialog = $("#productDialog"), detailImage = $("#detailImage"), detailTitle = $("#detailTitle");
  const detailDescription = $("#detailDescription"), detailPrice = $("#detailPrice"), detailSize = $("#detailSize");
  const sizeError = $("#sizeError"), detailAdd = $("#detailAdd");
  const money = new Intl.NumberFormat("de-DE", {style:"currency",currency:"EUR"});
  const STORAGE_KEY = "noire-bag-v2";
  let cart = [], activeProduct = null, returnFocus = null;

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(stored)) cart = stored.filter(p =>
      p && typeof p.name === "string" && Number.isFinite(Number(p.price)) &&
      Number(p.price) >= 0 && typeof p.size === "string" &&
      Number.isInteger(Number(p.quantity)) && Number(p.quantity) > 0
    ).map(p => ({name:p.name, price:Number(p.price), size:p.size, quantity:Number(p.quantity)}));
  } catch { cart = []; }

  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {}
  };

  const renderBag = () => {
    const quantity = cart.reduce((sum,p)=>sum+p.quantity,0);
    const subtotal = cart.reduce((sum,p)=>sum+p.price*p.quantity,0);
    bagCount.textContent = String(quantity);
    bagCount.setAttribute("aria-label", `${quantity} Artikel in der Bag`);
    bagTotal.textContent = money.format(subtotal);
    if (checkoutButton) checkoutButton.disabled = cart.length === 0;
    if (checkoutMessage) checkoutMessage.textContent = "";
    bagItems.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement("p");
      empty.className = "bag-empty";
      empty.textContent = "Deine Bag ist noch leer.";
      bagItems.append(empty);
    } else {
      cart.forEach((p,index) => {
        const row = document.createElement("div"); row.className = "bag-item";
        const details = document.createElement("div"); details.className = "bag-item-details";
        const name = document.createElement("span"); name.className = "bag-item-name"; name.textContent = p.name;
        const variant = document.createElement("small"); variant.className = "bag-item-variant"; variant.textContent = `Größe ${p.size}`;
        const price = document.createElement("small"); price.textContent = money.format(p.price);
        details.append(name,variant,price);
        const actions = document.createElement("div"); actions.className = "bag-item-actions";
        const line = document.createElement("strong"); line.textContent = money.format(p.price*p.quantity);
        const qty = document.createElement("div"); qty.className = "bag-qty";
        const minus = document.createElement("button"); minus.type="button"; minus.dataset.qty="-1"; minus.dataset.index=String(index); minus.setAttribute("aria-label","Menge verringern"); minus.textContent="−";
        const qtyText = document.createElement("span"); qtyText.textContent=String(p.quantity);
        const plus = document.createElement("button"); plus.type="button"; plus.dataset.qty="1"; plus.dataset.index=String(index); plus.setAttribute("aria-label","Menge erhöhen"); plus.textContent="+";
        qty.append(minus,qtyText,plus);
        const remove = document.createElement("button"); remove.type="button"; remove.className="bag-remove"; remove.dataset.remove=String(index); remove.textContent="Entfernen";
        actions.append(line,qty,remove); row.append(details,actions); bagItems.append(row);
      });
    }
    save();
  };

  const openBag = () => {
    drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false");
    document.body.classList.add("drawer-is-open");
    $("#bagOpen")?.setAttribute("aria-expanded","true");
    $("#bagClose")?.focus();
  };
  const closeBag = (restore=true) => {
    drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true");
    document.body.classList.remove("drawer-is-open");
    $("#bagOpen")?.setAttribute("aria-expanded","false");
    if (restore) $("#bagOpen")?.focus();
  };

  const openProduct = (card, trigger) => {
    const button = $(".add",card), image = $(".product-photo img",card), meta = $(".meta",card);
    const name = button?.dataset.name;
    const price = Number(button?.dataset.price);
    if (!name || !Number.isFinite(price)) return;
    activeProduct = {name,price};
    returnFocus = trigger || button;
    detailImage.src = image?.src || "";
    detailImage.alt = image?.alt || name;
    detailTitle.textContent = meta?.querySelector("span")?.childNodes[0]?.textContent?.trim() || name;
    detailDescription.textContent = meta?.querySelector("small")?.textContent?.trim() || "NOIRÉ · Modern Luxury";
    detailPrice.textContent = money.format(price);
    detailSize.value = "";
    sizeError.textContent = "";
    dialog.classList.add("open");
    dialog.setAttribute("aria-hidden","false");
    document.body.classList.add("dialog-is-open");
    window.setTimeout(()=>detailSize.focus(),100);
  };
  const closeProduct = () => {
    dialog.classList.remove("open"); dialog.setAttribute("aria-hidden","true");
    document.body.classList.remove("dialog-is-open");
    activeProduct = null;
    if (returnFocus?.focus) returnFocus.focus();
  };

  $$(".products article").forEach(card => {
    const link = $(".product-link",card);
    const details = $(".product-details-trigger",card);
    const open = (event) => { event.preventDefault(); window.location.href = link?.href || "#shop"; };
    link?.addEventListener("click",open);
    details?.addEventListener("click",open);
    $(".add",card)?.addEventListener("click",event=>{ event.preventDefault(); openProduct(card,event.currentTarget); });
  });

  detailAdd?.addEventListener("click",()=>{
    if (!activeProduct) return;
    const size = detailSize.value;
    if (!size) { sizeError.textContent="Bitte wähle zuerst deine Größe."; detailSize.focus(); return; }
    const existing = cart.find(p=>p.name===activeProduct.name && p.size===size);
    if (existing) existing.quantity += 1;
    else cart.push({...activeProduct,size,quantity:1});
    renderBag();
    closeProduct();
    openBag();
  });
  detailSize?.addEventListener("change",()=>{sizeError.textContent="";});
  $("#detailClose")?.addEventListener("click",closeProduct);
  dialog?.addEventListener("click",e=>{if(e.target===dialog) closeProduct();});

  bagItems?.addEventListener("click",e=>{
    const qty=e.target.closest("[data-qty]");
    const remove=e.target.closest("[data-remove]");
    if (qty) {
      const index=Number(qty.dataset.index), item=cart[index];
      if (!item) return;
      item.quantity += Number(qty.dataset.qty);
      if (item.quantity<=0) cart.splice(index,1);
      renderBag();
    } else if (remove) {
      cart.splice(Number(remove.dataset.remove),1);
      renderBag();
    }
  });

  checkoutButton?.addEventListener("click", async () => {
    if (!cart.length || checkoutButton.disabled) return;
    checkoutButton.disabled = true;
    checkoutButton.textContent = "WIRD VORBEREITET …";
    checkoutMessage.textContent = "Du wirst sicher zur Kasse weitergeleitet.";
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({items: cart.map(({name,size,quantity}) => ({name,size,quantity}))})
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout momentan nicht verfügbar.");
      window.location.assign(data.url);
    } catch (error) {
      checkoutMessage.textContent = error.message || "Bitte versuche es später erneut.";
      checkoutButton.disabled = cart.length === 0;
      checkoutButton.textContent = "WEITER ZUR KASSE";
    }
  });

  $("#bagOpen")?.addEventListener("click",openBag);
  $("#bagClose")?.addEventListener("click",()=>closeBag());
  drawer?.addEventListener("click",e=>{if(e.target===drawer) closeBag();});

  $$(".filters button").forEach(button=>{
    button.setAttribute("aria-pressed",String(button.classList.contains("selected")));
    button.addEventListener("click",()=>{
      $$(".filters button").forEach(other=>{
        const selected=other===button;
        other.classList.toggle("selected",selected);
        other.setAttribute("aria-pressed",String(selected));
      });
      const filter=button.dataset.filter||"all";
      $$(".products article").forEach(card=>{
        card.hidden=filter!=="all" && !(card.dataset.kind||"").split(/\s+/).includes(filter);
      });
    });
  });

  const menuButton=$("#hamb"), nav=$("#nav");
  menuButton?.setAttribute("aria-controls","nav");
  menuButton?.setAttribute("aria-expanded","false");
  menuButton?.addEventListener("click",()=>{
    const opened=nav?.classList.toggle("open")||false;
    menuButton.setAttribute("aria-expanded",String(opened));
    menuButton.setAttribute("aria-label",opened?"Menü schließen":"Menü öffnen");
  });
  $$("#nav a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded","false");
    menuButton?.setAttribute("aria-label","Menü öffnen");
  }));

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){
      if(dialog?.classList.contains("open")) closeProduct();
      else if(drawer?.classList.contains("open")) closeBag();
      nav?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded","false");
    }
  });

  drawer?.setAttribute("aria-hidden","true");
  const panel=drawer?.querySelector("aside");
  panel?.setAttribute("role","dialog"); panel?.setAttribute("aria-modal","true"); panel?.setAttribute("aria-label","Deine Bag");
  $("#bagOpen")?.setAttribute("aria-controls","drawer");
  $("#bagOpen")?.setAttribute("aria-expanded","false");
  renderBag();
  if (new URLSearchParams(window.location.search).get("bag") === "1") openBag();
})();