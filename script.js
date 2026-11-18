const products = [
 {id:1,name:"Essential Heavy Tee",cat:"Herren",type:"T-SHIRT",price:49.00,color:"Obsidian",img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",tag:"CORE"},
 {id:2,name:"Relaxed Signature Hoodie",cat:"Unisex",type:"HOODIE",price:89.00,color:"Ivory",img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",tag:"NEW"},
 {id:3,name:"Everyday Sweatshirt",cat:"Damen",type:"SWEATSHIRT",price:79.00,color:"Stone",img:"https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=900&q=80",tag:"CORE"},
 {id:4,name:"Studio Relaxed Tee",cat:"Damen",type:"T-SHIRT",price:45.00,color:"Ivory",img:"https://images.unsplash.com/photo-1564257577-9d2f5c6b8c1f?auto=format&fit=crop&w=900&q=80",tag:""},
 {id:5,name:"NOIRÉ Zip Hoodie",cat:"Herren",type:"ZIP HOODIE",price:99.00,color:"Black",img:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80",tag:"LIMITED"},
 {id:6,name:"Soft Form Jogger",cat:"Unisex",type:"PANTS",price:75.00,color:"Stone",img:"https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=80",tag:""},
 {id:7,name:"Cropped Everyday Crew",cat:"Damen",type:"SWEATSHIRT",price:69.00,color:"Sand",img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80",tag:""},
 {id:8,name:"Heavyweight Box Tee",cat:"Herren",type:"T-SHIRT",price:52.00,color:"Black",img:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",tag:"CORE"}
];
let activeFilter="Alle", cart=[];
const euro=n=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(n);
const grid=document.getElementById("productGrid");
function renderProducts(){
 let list=products.filter(p=>(activeFilter==="Alle"||p.cat===activeFilter)&&(`${p.name} ${p.type} ${p.color}`).toLowerCase().includes((document.getElementById("searchInput")?.value||"").toLowerCase()));
 const sort=document.getElementById("sortSelect").value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-image-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="quick-add" data-add="${p.id}">ADD TO BAG　＋</button></div><div class="product-meta"><span>${p.name}</span><strong>${euro(p.price)}</strong></div><div class="product-category">${p.type} · ${p.color.toUpperCase()}</div></article>`).join("")||"<p>Keine Produkte gefunden.</p>";
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("drawerCount").textContent=`(${cart.reduce((s,x)=>s+x.qty,0)})`;
 document.getElementById("subtotal").textContent=euro(cart.reduce((s,x)=>s+x.price*x.qty,0));
 document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><img src="${x.img}" alt=""><div><strong>${x.name}</strong><p>${euro(x.price)} · Menge ${x.qty}</p><button data-remove="${x.id}">Entfernen</button></div><span>${euro(x.price*x.qty)}</span></div>`).join(""):'<p class="empty-cart">Dein Warenkorb ist noch leer.</p>';
}
function openCart(){document.body.classList.add("drawer-open")}
function closeCart(){document.body.classList.remove("drawer-open")}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"); if(add){const p=products.find(x=>x.id===Number(add.dataset.add));const old=cart.find(x=>x.id===p.id);old?old.qty++:cart.push({...p,qty:1});updateCart();toast(`${p.name} hinzugefügt`);}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));updateCart();}
 const f=e.target.closest("[data-filter]");if(f){activeFilter=f.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));renderProducts();if(f.tagName==="A")document.getElementById("mainNav").classList.remove("open");}
});
document.getElementById("cartToggle").onclick=openCart;document.getElementById("cartClose").onclick=closeCart;document.getElementById("drawerBackdrop").onclick=closeCart;
document.getElementById("menuToggle").onclick=()=>document.getElementById("mainNav").classList.toggle("open");
document.getElementById("sortSelect").onchange=renderProducts;
document.getElementById("searchToggle").onclick=()=>{document.getElementById("searchBar").classList.toggle("hidden");document.getElementById("searchInput").focus()};
document.getElementById("searchClose").onclick=()=>{document.getElementById("searchBar").classList.add("hidden");document.getElementById("searchInput").value="";renderProducts()};
document.getElementById("searchInput").oninput=renderProducts;
document.getElementById("checkoutButton").onclick=()=>toast("Demo-Checkout: Zahlungsanbieter noch nicht verbunden.");
document.getElementById("newsletterForm").onsubmit=e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="Danke! Das Formular ist noch nicht mit einem Newsletter-Dienst verbunden.";};
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCart();
