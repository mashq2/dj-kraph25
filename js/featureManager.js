// Theme Manager - Dark/Light Theme Toggle
class ThemeManager {
    constructor() {
        this.theme = this.loadTheme();
        this.applyTheme();
        this.initToggle();
    }

    initToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.saveTheme();
        this.applyTheme();
    }

    applyTheme() {
        const html = document.documentElement;
        if (this.theme === 'light') {
            html.style.colorScheme = 'light';
            document.body.style.background = '#ffffff';
            document.body.style.color = '#000000';
        } else {
            html.style.colorScheme = 'dark';
            document.body.style.background = '#121212';
            document.body.style.color = '#ffffff';
        }
        
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    saveTheme() {
        localStorage.setItem('djkraph_theme', this.theme);
    }

    loadTheme() {
        return localStorage.getItem('djkraph_theme') || 'dark';
    }
}

// Playlist Manager
const PLAYLISTS_STORAGE_KEY = 'djkraph_playlists';

class PlaylistManager {
    constructor() {
        this.playlists = this.loadPlaylists();
        this.initEventListeners();
    }

    initEventListeners() {
        const playlistForm = document.getElementById('createPlaylistForm');
        if (playlistForm) {
            playlistForm.addEventListener('submit', (e) => this.handleCreatePlaylist(e));
        }
    }

    handleCreatePlaylist(e) {
        e.preventDefault();

        if (!authManager?.isLoggedIn()) {
            alert('Please login to create playlists');
            return;
        }

        const name = document.getElementById('playlistName').value;
        const description = document.getElementById('playlistDescription').value;

        const playlist = {
            id: Date.now(),
            userId: authManager.currentUser.id,
            name,
            description,
            mixes: [],
            createdAt: new Date().toISOString()
        };

        this.playlists.push(playlist);
        this.savePlaylists();
        this.showMessage('Playlist created!', 'success');
        document.getElementById('createPlaylistForm').reset();
    }

    getUserPlaylists() {
        if (!authManager?.isLoggedIn()) return [];
        return this.playlists.filter(p => p.userId === authManager.currentUser.id);
    }

    addMixToPlaylist(playlistId, mixId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.mixes.includes(mixId)) {
            playlist.mixes.push(mixId);
            this.savePlaylists();
            return true;
        }
        return false;
    }

    removeMixFromPlaylist(playlistId, mixId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (playlist) {
            playlist.mixes = playlist.mixes.filter(id => id !== mixId);
            this.savePlaylists();
        }
    }

    deletePlaylist(playlistId) {
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
    }

    savePlaylists() {
        localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(this.playlists));
    }

    loadPlaylists() {
        const data = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('playlistMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            setTimeout(() => messageEl.className = 'message', 4000);
        }
    }
}

// Analytics/Sales Manager
class AnalyticsManager {
    constructor() {
        this.sales = this.loadSales();
    }

    recordSale(mixId, userId, amount) {
        const sale = {
            id: Date.now(),
            mixId,
            userId,
            amount,
            date: new Date().toISOString()
        };
        this.sales.push(sale);
        this.saveSales();
        return sale;
    }

    getTotalRevenue() {
        return this.sales.reduce((sum, sale) => sum + sale.amount, 0);
    }

    getSalesByMix(mixId) {
        return this.sales.filter(s => s.mixId === mixId);
    }

    getMostPopularMixes(limit = 5) {
        const mixSales = {};
        this.sales.forEach(sale => {
            mixSales[sale.mixId] = (mixSales[sale.mixId] || 0) + 1;
        });
        return Object.entries(mixSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([mixId, count]) => ({ mixId: parseInt(mixId), count }));
    }

    saveSales() {
        localStorage.setItem('djkraph_sales', JSON.stringify(this.sales));
    }

    loadSales() {
        const data = localStorage.getItem('djkraph_sales');
        return data ? JSON.parse(data) : [];
    }
}

let themeManager;
let playlistManager;
let analyticsManager;

document.addEventListener('DOMContentLoaded', () => {
    themeManager = new ThemeManager();
    playlistManager = new PlaylistManager();
    analyticsManager = new AnalyticsManager();
});
