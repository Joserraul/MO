import Navbar from "../Components/navbar";
import { useEffect, useState } from "react";


function home() {
  const [spells, setSpells] = useState([]);

 /*  useEffect(() => {
    fetch("http://localhost:3000/api/spells")
      .then(response => response.json())
      .then(data => setSpells(data))
      .catch(error => console.error("Error fetching spells:", error));
  }, []); */


  return (
    <>
      <div>
        <Navbar />
      </div>
        <main class="container main">

    <div class="hero">
      <h2 class="hero-title">Belleza que habla por ti</h2>
      <p class="hero-sub">Descubre nuestra colección curada de productos de maquillaje premium.</p>
    </div>


    <div class="categories"><button class="cat-btn active" onclick="filterCategory('Todos',this)">Todos</button>
<button class="cat-btn" onclick="filterCategory('Labios',this)">Labios</button>
<button class="cat-btn" onclick="filterCategory('Rostro',this)">Rostro</button>
<button class="cat-btn" onclick="filterCategory('Ojos',this)">Ojos</button>
<button class="cat-btn" onclick="filterCategory('Cejas',this)">Cejas</button>
<button class="cat-btn" onclick="filterCategory('Mejillas',this)">Mejillas</button>
</div>


    <div class="product-grid" id="product-grid">
    <div class="product-card" data-category="Labios">
      <div class="product-img-wrap" onclick="openDetail('1')">
        {/* <img src="img/velvet-lip-tint.jpg" alt="Velvet Lip Tint" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Rosé Studio</p>
        <h3 class="product-name" onclick="openDetail('1')">Velvet Lip Tint</h3>
        <p class="product-price">$24.50</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-1" style="display:none">
          <button onclick="changeQty('1',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-1">0</span>
          <button onclick="changeQty('1',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-1" onclick="changeQty('1',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Rostro">
      <div class="product-img-wrap" onclick="openDetail('2')">
        {/* <img src="img/luminous-skin-serum.jpg" alt="Luminous Skin Serum" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Glow Lab</p>
        <h3 class="product-name" onclick="openDetail('2')">Luminous Skin Serum</h3>
        <p class="product-price">$38.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-2" style="display:none">
          <button onclick="changeQty('2',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-2">0</span>
          <button onclick="changeQty('2',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-2" onclick="changeQty('2',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Rostro">
      <div class="product-img-wrap" onclick="openDetail('3')">
        {/* <img src="img/silk-foundation.jpg" alt="Silk Foundation" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Rosé Studio</p>
        <h3 class="product-name" onclick="openDetail('3')">Silk Foundation</h3>
        <p class="product-price">$42.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-3" style="display:none">
          <button onclick="changeQty('3',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-3">0</span>
          <button onclick="changeQty('3',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-3" onclick="changeQty('3',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Cejas">
      <div class="product-img-wrap" onclick="openDetail('4')">
        {/* <img src="img/brow-sculptor.jpg" alt="Brow Sculptor" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Arch Atelier</p>
        <h3 class="product-name" onclick="openDetail('4')">Brow Sculptor</h3>
        <p class="product-price">$18.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-4" style="display:none">
          <button onclick="changeQty('4',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-4">0</span>
          <button onclick="changeQty('4',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-4" onclick="changeQty('4',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Mejillas">
      <div class="product-img-wrap" onclick="openDetail('5')">
        {/* <img src="img/cloud-blush.jpg" alt="Cloud Blush" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Petal Beauty</p>
        <h3 class="product-name" onclick="openDetail('5')">Cloud Blush</h3>
        <p class="product-price">$28.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-5" style="display:none">
          <button onclick="changeQty('5',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-5">0</span>
          <button onclick="changeQty('5',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-5" onclick="changeQty('5',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Ojos">
      <div class="product-img-wrap" onclick="openDetail('6')">
        {/* <img src="img/midnight-mascara.jpg" alt="Midnight Mascara" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Lash Co.</p>
        <h3 class="product-name" onclick="openDetail('6')">Midnight Mascara</h3>
        <p class="product-price">$22.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-6" style="display:none">
          <button onclick="changeQty('6',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-6">0</span>
          <button onclick="changeQty('6',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-6" onclick="changeQty('6',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Ojos">
      <div class="product-img-wrap" onclick="openDetail('7')">
        {/* <img src="img/palette-terre.jpg" alt="Palette Terre" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Rosé Studio</p>
        <h3 class="product-name" onclick="openDetail('7')">Palette Terre</h3>
        <p class="product-price">$45.00</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-7" style="display:none">
          <button onclick="changeQty('7',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-7">0</span>
          <button onclick="changeQty('7',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-7" onclick="changeQty('7',1)">+ Agregar</button>
      </div>
    </div>
    <div class="product-card" data-category="Rostro">
      <div class="product-img-wrap" onclick="openDetail('8')">
        {/* <img src="img/dewy-setting-spray.jpg" alt="Dewy Setting Spray" loading="lazy"> */}
      </div>
      <div class="product-info">
        <p class="product-brand">Glow Lab</p>
        <h3 class="product-name" onclick="openDetail('8')">Dewy Setting Spray</h3>
        <p class="product-price">$19.50</p>
      </div>
      <div class="product-actions">
        <div class="qty-controls" id="qty-8" style="display:none">
          <button onclick="changeQty('8',-1)" class="qty-btn">−</button>
          <span class="qty-num" id="qty-num-8">0</span>
          <button onclick="changeQty('8',1)" class="qty-btn">+</button>
        </div>
        <button class="add-btn" id="add-8" onclick="changeQty('8',1)">+ Agregar</button>
      </div>
    </div></div>
  </main>
    
    </> );
}

export default home