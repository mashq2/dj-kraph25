// Authentication Manager - Handle user accounts
const AUTH_STORAGE_KEY = 'djkraph_users';
const CURRENT_USER_KEY = 'djkraph_current_user';

// The single admin email — only this account can access the Admin Dashboard
const ADMIN_EMAIL = 'admin@djkraph.com';

class AuthManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initEventListeners();
        this.updateNavigation();
    }

    initEventListeners() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
    }

    handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const username = document.getElementById('username').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            this.showMessage('Email already registered', 'error');
            return;
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password: btoa(password), // Basic encoding (use bcrypt in production)
            createdAt: new Date().toISOString(),
            purchases: [],
            wishlist: [],
            reviews: []
        };

        users.push(newUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
        this.currentUser = newUser;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        this.showMessage(`Welcome ${username}! Account created.`, 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === btoa(password));

        if (user) {
            this.currentUser = user;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            this.showMessage(`Welcome back, ${user.username}!`, 'success');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            this.showMessage('Invalid email or password', 'error');
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem(CURRENT_USER_KEY);
            this.currentUser = null;
            this.showMessage('Logged out successfully', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
    }

    getUsers() {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    getCurrentUser() {
        const data = localStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.isLoggedIn() && this.currentUser.email === ADMIN_EMAIL;
    }

    updateNavigation() {
        const navAuth = document.getElementById('navAuth');
        if (!navAuth) return;

        if (this.isLoggedIn()) {
            navAuth.innerHTML = `
                <div style="color: #FFD700; margin-right: 20px;">Welcome, <strong>${this.currentUser.username}</strong></div>
                <button id="logoutBtn" style="padding: 8px 16px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        } else {
            navAuth.innerHTML = `
                <a href="login.html" style="color: #FFD700; text-decoration: none; margin-right: 15px; font-weight: bold;">Login</a>
                <a href="signup.html" style="color: #999; text-decoration: none; font-size: 10px; padding: 4px 8px; background: rgba(255, 215, 0, 0.1); border: 1px solid #333; border-radius: 3px; font-weight: normal;">Sign Up</a>
            `;
        }
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            setTimeout(() => messageEl.className = 'message', 4000);
        }
    }

    addToWishlist(mixId) {
        if (!this.isLoggedIn()) {
            alert('Please login to add to wishlist');
            return;
        }
        if (!this.currentUser.wishlist.includes(mixId)) {
            this.currentUser.wishlist.push(mixId);
            this.saveCurrentUser();
            return true;
        }
        return false;
    }

    removeFromWishlist(mixId) {
        this.currentUser.wishlist = this.currentUser.wishlist.filter(id => id !== mixId);
        this.saveCurrentUser();
    }

    saveCurrentUser() {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(this.currentUser));
        }
    }
}

let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
});
