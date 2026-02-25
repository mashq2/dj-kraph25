// Shopping Cart Manager
const CART_STORAGE_KEY = 'djkraph_cart';

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener('addToCart', (e) => {
            this.addToCart(e.detail.mix);
        });
    }

    addToCart(mix) {
        const existingItem = this.cart.find(item => item.id === mix.id);
        
        if (existingItem) {
            alert('Mix already in cart');
            return;
        }

        this.cart.push(mix);
        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${mix.title} added to cart!`);
    }

    removeFromCart(mixId) {
        this.cart = this.cart.filter(item => item.id !== mixId);
        this.saveCart();
        this.updateCartCount();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + item.price, 0);
    }

    saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
    }

    loadCart() {
        const data = localStorage.getItem(CART_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    getCart() {
        return this.cart;
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.style.display = this.cart.length > 0 ? 'block' : 'none';
        }
    }

    displayCart() {
        const cartContainer = document.getElementById('cartItems');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }

        cartContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3>${item.title}</h3>
                    <p>by ${item.artist}</p>
                    <p class=\"cart-item-price\">KSh ${item.price.toLocaleString()}</p>
                </div>
                <button onclick="cartManager.removeFromCart(${item.id})" class="btn-remove-cart">Remove</button>
            </div>
        `).join('');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    getCheckoutSummary() {
        return {
            items: this.cart,
            itemCount: this.cart.length,
            subtotal: this.getTotal(),
            currency: 'KES',
            timestamp: new Date().toISOString(),
            reference: 'CART_' + Date.now()
        };
    }

    getCartDescription() {
        if (this.cart.length === 0) return 'Empty cart';
        if (this.cart.length === 1) return this.cart[0].title;
        return this.cart.length + ' mixes - ' + this.cart[0].title + ' + more';
    }
}

let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
    if (document.getElementById('cartItems')) {
        cartManager.displayCart();
    }
    cartManager.updateCartCount();
});
