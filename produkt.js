(async()=>{
  const money=new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'});
  const slug=new URLSearchParams(location.search).get('product');
  const feedback=document.getElementById('feedback');
  const button=document.getElementById('addToBag');
  let added=false;
  try {
    const response=await fetch('products.json');
    if(!response.ok) throw new Error('Produktdaten konnten nicht geladen werden.');
    const products=await response.json();
    const p=products.find(x=>x.slug===slug);
    if(!p) throw new Error('Dieses Produkt wurde nicht gefunden.');
    document.title=p.name+' | NOIRÉ';
    document.getElementById('crumb').textContent=p.name.toUpperCase();
    const image=document.getElementById('productImage'); image.src=p.image; image.alt=p.alt||p.name;
    document.getElementById('productName').textContent=p.name;
    document.getElementById('productSubtitle').textContent=p.subtitle;
    document.getElementById('productPrice').textContent=money.format(p.price);
    document.getElementById('productDescription').textContent=p.description;
    button.addEventListener('click',()=>{
      if(added){location.href='index.html?bag=1';return;}
      const size=document.getElementById('productSize').value;
      if(!size){feedback.textContent='Bitte wähle zuerst deine Größe.';document.getElementById('productSize').focus();return;}
      const key='noire-bag-v2'; let cart=[];
      try{cart=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(cart))cart=[];}catch{cart=[];}
      const found=cart.find(x=>x.name===p.cartName&&x.size===size);
      if(found)found.quantity++; else cart.push({name:p.cartName,price:p.price,size,quantity:1});
      localStorage.setItem(key,JSON.stringify(cart)); added=true;
      feedback.style.color='#486b50'; feedback.textContent='In deine Bag gelegt. Größe '+size+' wurde gespeichert.';
      button.textContent='ZUR BAG';
    });
  } catch(error) {
    document.getElementById('productName').textContent='Produkt derzeit nicht verfügbar';
    feedback.textContent=error.message;
    button.disabled=true;
  }
})();
