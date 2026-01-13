// /* global window, document, alert */

// class ServiceCart {
//   constructor() {
//     this.items = this.loadCart();
//     this.updateCartCount();
//   }

//   loadCart() {
//     const saved = sessionStorage.getItem('serviceCart');
//     return saved ? JSON.parse(saved) : [];
//   }

//   saveCart() {
//     sessionStorage.setItem('serviceCart', JSON.stringify(this.items));
//   }

//   addService(item) {
//     const exist = this.items.find(s => s.id === item.id);
//     if (exist) exist.qty++;
//     else this.items.push({ ...item, qty: 1 });

//     this.saveCart();
//     this.updateCartCount();
//     this.showToast(`${item.name} +1`);
//   }

//   removeItem(id) {
//     this.items = this.items.filter(i => i.id !== id);
//     this.saveCart();
//     this.updateCartCount();
//     loadCartUI();
//     loadCheckoutUI();
//   }

//   clearCart() {
//     this.items = [];
//     this.saveCart();
//     this.updateCartCount();
//     loadCartUI();
//     loadCheckoutUI();
//   }

//   updateCartCount() {
//     const cartCount = document.getElementById('service-cart-count');
//     if (!cartCount) return;
//     const total = this.items.reduce((sum, i) => sum + i.qty, 0);
//     cartCount.textContent = total;
//     cartCount.style.display = total > 0 ? 'inline-block' : 'none';
//   }

//   showToast(text) {
//     const toast = document.createElement('div');
//     toast.textContent = text;
//     toast.style.position = 'fixed';
//     toast.style.bottom = '30px';
//     toast.style.right = '30px';
//     toast.style.padding = '10px 18px';
//     toast.style.background = '#0a84ff';
//     toast.style.color = '#fff';
//     toast.style.borderRadius = '6px';
//     toast.style.zIndex = 2000;
//     toast.style.fontWeight = 600;
//     toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 1300);
//   }
// }

// window.serviceCart = new ServiceCart();

// /* CLICK THÊM */
// document.addEventListener('click', (e) => {
//   if (!e.target.classList.contains('add-service-btn')) return;

//   const card = e.target.closest('.service-card');
//   const item = {
//     id: card.dataset.id,
//     name: card.dataset.name,
//     price: Number(card.dataset.price),
//     image: card.dataset.image
//   };

//   window.serviceCart.addService(item);
// });

// /* UI CART PAGE */
// function loadCartUI() {
//   const cart = window.serviceCart.items;
//   const cartContainer = document.getElementById('cart-container');
//   if (!cartContainer) return;

//   const emptyCart = document.getElementById('empty-cart');
//   const summary = document.getElementById('cart-summary');
//   const totalDisplay = document.getElementById('cart-total');

//   if (!cart.length) {
//     cartContainer.innerHTML = '';
//     emptyCart.style.display = 'block';
//     summary.classList.add('hidden');
//     return;
//   }

//   emptyCart.style.display = 'none';
//   summary.classList.remove('hidden');

//   let total = 0;
//   cartContainer.innerHTML = cart.map(i => {
//     total += i.price * i.qty;
//     return `
//       <div class="cart-item">
//         <img src="${i.image || '/images/services/default.png'}" class="cart-thumb" />
//         <div class="cart-info">
//           <h3>${i.name}</h3>
//           <div class="qty-box">
//             <button class="qty-btn" onclick="changeQty('${i.id}', -1)">−</button>
//             <span class="qty-num">${i.qty}</span>
//             <button class="qty-btn" onclick="changeQty('${i.id}', 1)">+</button>
//           </div>
//         </div>
//         <div class="cart-price">${(i.price * i.qty).toLocaleString()}đ</div>
//       </div>`;
//   }).join('');

//   totalDisplay.textContent = total.toLocaleString('vi-VN') + 'đ';
// }

// /* CHECKOUT UI */
// function loadCheckoutUI() {
//   const list = document.getElementById('checkout-list');
//   if (!list) return;
//   const totalDom = document.getElementById('checkout-total');
//   const cart = window.serviceCart.items;

//   if (!cart.length) {
//     list.innerHTML = `<p>Giỏ hàng rỗng</p>`;
//     totalDom.textContent = "0đ";
//     return;
//   }

//   let total = 0;
//   list.innerHTML = cart.map(i => {
//     total += i.price * i.qty;
//     return `
//       <div class="checkout-item">
//         <span>${i.name} × ${i.qty}</span>
//         <span>${(i.price * i.qty).toLocaleString()}đ</span>
//       </div>`;
//   }).join('');

//   totalDom.textContent = total.toLocaleString('vi-VN') + 'đ';
// }

// window.changeQty = function(id, delta) {
//   const item = window.serviceCart.items.find(i => i.id === id);
//   if (!item) return;

//   item.qty += delta;
//   if (item.qty <= 0) return window.serviceCart.removeItem(id);

//   window.serviceCart.saveCart();
//   window.serviceCart.updateCartCount();
//   loadCartUI();
//   loadCheckoutUI();
// };

// window.clearServiceCart = function() {
//   window.serviceCart.clearCart();
// };

// window.confirmServicePayment = function() {
//   alert("Thanh toán thành công!");
//   window.serviceCart.clearCart();
//   window.location.href = "/services";
// };

// window.addEventListener('DOMContentLoaded', () => {
//   loadCartUI();
//   loadCheckoutUI();
// });

/* global window, document, alert */

/* ==================================================
   GIỎ HÀNG DỊCH VỤ — DÙNG DATABASE (KHÔNG SHARE CART)
   ================================================== */
   class ServiceCart {
    constructor() {
      this.items = [];
      this.loadFromServer();
    }
  
    async loadFromServer() {
      try {
        const res = await fetch('/api/giohangdv');
        if (!res.ok) throw new Error('Không load được giỏ hàng');
        this.items = await res.json();
        this.updateCartCount();
        loadCartUI();
        loadCheckoutUI();
      } catch (err) {
        console.error('Lỗi load giỏ hàng từ DB:', err);
      }
    }
  
    async addService(item) {
      try {
        await fetch('/api/giohangdv/add', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MaDV: item.id, SoLuong: 1 })
        });
      } catch (e) {
        console.error("ADD FAIL", e);
      }
  
      const exist = this.items.find(s => s.MaDV === item.id);
      if (exist) {
        exist.SoLuong++;
      } else {
        this.items.push({
          MaDV: item.id,
          TenDV: item.name,
          Gia: item.price,
          HinhAnh: item.image,
          SoLuong: 1
        });
      }
  
      this.saveLocal();
      this.updateCartCount();
      this.showToast(`${item.name} +1`);
    }
  
    async changeQty(id, delta) {
      try {
        await fetch('/api/giohangdv/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ MaDV: id, SoLuong: delta })
        });
      } catch (e) {
        console.error("UPDATE QTY FAIL", e);
      }
  
      const item = this.items.find(i => i.MaDV === id);
      if (!item) return;
  
      item.SoLuong += delta;
      if (item.SoLuong <= 0) {
        this.items = this.items.filter(i => i.MaDV !== id);
      }
  
      this.saveLocal();
      this.updateCartCount();
      loadCartUI();
      loadCheckoutUI();
    }
  
    async removeItem(id) {
      try {
        await fetch(`/api/giohangdv/remove/${id}`, { method: 'DELETE' });
      } catch (e) {
        console.error("REMOVE ONE FAIL", e);
      }
  
      this.items = this.items.filter(i => i.MaDV !== id);
      this.saveLocal();
      this.updateCartCount();
      loadCartUI();
      loadCheckoutUI();
    }
  
    async clearCart() {
      try {
        await fetch('/api/giohangdv/clear', { method: 'DELETE' });
      } catch (e) {
        console.error("CLEAR FAIL", e);
      }
  
      this.items = [];
      this.saveLocal();
      this.updateCartCount();
      loadCartUI();
      loadCheckoutUI();
    }
  
    /* ================== UI HELPERS ================== */
    saveLocal() {
      sessionStorage.setItem('serviceCart', JSON.stringify(this.items));
    }
  
    updateCartCount() {
      const cartCount = document.getElementById('service-cart-count');
      if (!cartCount) return;
      const total = this.items.reduce((sum, i) => sum + i.SoLuong, 0);
      cartCount.textContent = total;
      cartCount.style.display = total > 0 ? 'inline-block' : 'none';
    }
  
    showToast(text) {
      const toast = document.createElement('div');
      toast.textContent = text;
      toast.style.position = 'fixed';
      toast.style.bottom = '30px';
      toast.style.right = '30px';
      toast.style.padding = '10px 18px';
      toast.style.background = '#0a84ff';
      toast.style.color = '#fff';
      toast.style.borderRadius = '6px';
      toast.style.zIndex = 2000;
      toast.style.fontWeight = 600;
      toast.style.boxShadow = "0 4px 10px rgba(0,0,0,0.4)";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1300);
    }
  }
  
  window.serviceCart = new ServiceCart();
  
  /* ======================================
     CLICK THÊM
  ====================================== */
  document.addEventListener('click', async (e) => {
    if (!e.target.classList.contains('add-service-btn')) return;
    const card = e.target.closest('.service-card');
  
    const item = {
      id: Number(card.dataset.id),
      name: card.dataset.name,
      price: Number(card.dataset.price),
      image: card.dataset.image
    };
  
    await window.serviceCart.addService(item);
  });
  
  /* ======================================
     LOAD UI CART PAGE
  ====================================== */
  function loadCartUI() {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;
  
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    const totalDisplay = document.getElementById('cart-total');
  
    const items = window.serviceCart.items;
  
    if (!items.length) {
      cartContainer.innerHTML = '';
      emptyCart.style.display = 'block';
      summary.classList.add('hidden');
      return;
    }
  
    emptyCart.style.display = 'none';
    summary.classList.remove('hidden');
  
    let total = 0;
    cartContainer.innerHTML = items.map(i => {
      const line = i.Gia * i.SoLuong;
      total += line;
      return `
        <div class="cart-item">
          <img src="${i.HinhAnh || '/images/services/default.png'}" class="cart-thumb" />
          <div class="cart-info">
            <h3>${i.TenDV}</h3>
            <div class="qty-box">
              <button class="qty-btn" onclick="changeQty(${i.MaDV}, -1)">−</button>
              <span class="qty-num">${i.SoLuong}</span>
              <button class="qty-btn" onclick="changeQty(${i.MaDV}, 1)">+</button>
            </div>
          </div>
          <div class="cart-price">${line.toLocaleString()}đ</div>
        </div>`;
    }).join('');
  
    totalDisplay.textContent = total.toLocaleString('vi-VN') + 'đ';
  }
  
  /* ======================================
     LOAD UI CHECKOUT
  ====================================== */
  function loadCheckoutUI() {
    const list = document.getElementById('checkout-list');
    if (!list) return;
    const totalDom = document.getElementById('checkout-total');
  
    const items = window.serviceCart.items;
    if (!items.length) {
      list.innerHTML = `<p>Giỏ hàng rỗng</p>`;
      totalDom.textContent = "0đ";
      return;
    }
  
    let total = 0;
    list.innerHTML = items.map(i => {
      const line = i.Gia * i.SoLuong;
      total += line;
      return `
        <div class="checkout-item">
          <span>${i.TenDV} × ${i.SoLuong}</span>
          <span>${line.toLocaleString()}đ</span>
        </div>`;
    }).join('');
  
    totalDom.textContent = total.toLocaleString('vi-VN') + 'đ';
  }
  
  /* ======================================
     GLOBAL ACTIONS
  ====================================== */
  window.changeQty = async function(id, delta) {
    await window.serviceCart.changeQty(id, delta);
  };
  
  window.clearServiceCart = async function() {
    await window.serviceCart.clearCart();
  };
  
  window.confirmServicePayment = async function() {
    alert("Thanh toán thành công!");
    await window.serviceCart.clearCart();
    window.location.href = "/services";
  };
  
  window.addEventListener('DOMContentLoaded', () => {
    loadCartUI();
    loadCheckoutUI();
  });
  