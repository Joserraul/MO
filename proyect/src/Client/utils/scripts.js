const cart = {};
const products = [
  {id:"1",name:"Velvet Lip Tint",brand:"Rosé Studio",price:24.50,img:"velvet-lip-tint.jpg"},
  {id:"2",name:"Luminous Skin Serum",brand:"Glow Lab",price:38.00,img:"luminous-skin-serum.jpg"},
  {id:"3",name:"Silk Foundation",brand:"Rosé Studio",price:42.00,img:"silk-foundation.jpg"},
  {id:"4",name:"Brow Sculptor",brand:"Arch Atelier",price:18.00,img:"brow-sculptor.jpg"},
  {id:"5",name:"Cloud Blush",brand:"Petal Beauty",price:28.00,img:"cloud-blush.jpg"},
  {id:"6",name:"Midnight Mascara",brand:"Lash Co.",price:22.00,img:"midnight-mascara.jpg"},
  {id:"7",name:"Palette Terre",brand:"Rosé Studio",price:45.00,img:"palette-terre.jpg"},
  {id:"8",name:"Dewy Setting Spray",brand:"Glow Lab",price:19.50,img:"dewy-setting-spray.jpg"},
];

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] < 0) cart[id] = 0;
  updateUI(id);
  updateCart();
}

function updateUI(id) {
  const q = cart[id] || 0;
  // Card controls
  const qtyEl = document.getElementById('qty-' + id);
  const addEl = document.getElementById('add-' + id);
  const numEl = document.getElementById('qty-num-' + id);
  if (qtyEl) qtyEl.style.display = q > 0 ? 'inline-flex' : 'none';
  if (addEl) addEl.style.display = q > 0 ? 'none' : 'inline-block';
  if (numEl) numEl.textContent = q;
  // Modal controls
  const mqtyEl = document.getElementById('modal-qty-' + id);
  const maddEl = document.getElementById('modal-add-' + id);
  const mnumEl = document.getElementById('modal-qty-num-' + id);
  if (mqtyEl) mqtyEl.style.display = q > 0 ? 'inline-flex' : 'none';
  if (maddEl) maddEl.style.display = q > 0 ? 'none' : 'inline-block';
  if (mnumEl) mnumEl.textContent = q;
}

function updateCart() {
  let total = 0, count = 0;
  const itemsEl = document.getElementById('cart-items');
  itemsEl.innerHTML = '';
  for (const p of products) {
    const q = cart[p.id] || 0;
    if (q > 0) {
      count += q;
      total += p.price * q;
      itemsEl.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-img"><img src="img/${p.img}" alt="${p.name}"></div>
          <div class="cart-item-info">
            <p class="product-brand">${p.brand}</p>
            <p class="product-name">${p.name}</p>
            <p class="cart-item-price">$${(p.price * q).toFixed(2)}</p>
            <div class="qty-controls">
              <button onclick="changeQty('${p.id}',-1)" class="qty-btn">−</button>
              <span class="qty-num">${q}</span>
              <button onclick="changeQty('${p.id}',1)" class="qty-btn">+</button>
            </div>
          </div>
        </div>`;
    }
  }
  document.getElementById('cart-badge').textContent = count;
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
  document.getElementById('cart-empty').style.display = count > 0 ? 'none' : 'flex';
  document.getElementById('cart-footer').style.display = count > 0 ? 'flex' : 'none';
}

function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function openDetail(id) {
  document.getElementById('modal-' + id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetail(e, id) {
  if (e.target === e.currentTarget || e.currentTarget.classList.contains('modal-close')) {
    document.getElementById('modal-' + id).classList.remove('open');
    document.body.style.overflow = '';
  }
}

function filterCategory(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.dataset.hidden = cat === 'Todos' ? 'false' : card.dataset.category !== cat ? 'true' : 'false';
  });
}
