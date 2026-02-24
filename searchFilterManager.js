// Search and Filter Manager
class SearchFilterManager {
    constructor() {
        this.initSearchFilters();
    }

    initSearchFilters() {
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.applyFilters();
            });
        }
        if (genreFilter) genreFilter.addEventListener('change', () => this.applyFilters());
        if (priceFilter) priceFilter.addEventListener('change', () => this.applyFilters());
        if (ratingFilter) ratingFilter.addEventListener('change', () => this.applyFilters());
    }

    searchMixes(mixes, query) {
        const q = query.toLowerCase();
        return mixes.filter(mix => 
            mix.title.toLowerCase().includes(q) ||
            mix.artist.toLowerCase().includes(q) ||
            (mix.description && mix.description.toLowerCase().includes(q))
        );
    }

    filterByGenre(mixes, genre) {
        if (!genre) return mixes;
        return mixes.filter(mix => mix.genre === genre);
    }

    filterByPrice(mixes, priceRange) {
        if (!priceRange) return mixes;
        const [min, max] = priceRange.split('-').map(Number);
        return mixes.filter(mix => mix.price >= min && mix.price <= max);
    }

    filterByRating(mixes, minRating) {
        if (!minRating) return mixes;
        return mixes.filter(mix => (mix.averageRating || 0) >= parseFloat(minRating));
    }

    applyFilters() {
        const searchInput = document.getElementById('searchInput');
        const genreFilter = document.getElementById('genreFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        const query = searchInput?.value || '';
        const genre = genreFilter?.value || '';
        const priceRange = priceFilter?.value || '';
        const minRating = ratingFilter?.value || '';

        // Get mixes from mixManager
        const allMixes = mixManager?.mixes || [];
        
        let filtered = allMixes;
        filtered = this.searchMixes(filtered, query);
        filtered = this.filterByGenre(filtered, genre);
        filtered = this.filterByPrice(filtered, priceRange);
        filtered = this.filterByRating(filtered, minRating);

        this.displayFilteredMixes(filtered);
    }

    displayFilteredMixes(mixes) {
        const mixGrid = document.getElementById('mixGrid');
        if (!mixGrid) return;

        if (mixes.length === 0) {
            mixGrid.innerHTML = '<div class="empty-result">No mixes found matching your criteria</div>';
            return;
        }

        mixGrid.innerHTML = mixes.map(mix => `
            <div class="mix-card">
                <div class="mix-image" style="background-image: url('${mix.image}'); background-size: cover; background-position: center; height: 200px; border-radius: 10px 10px 0 0;"></div>
                <div class="mix-content">
                    <div class="mix-genre" style="display: inline-block; background: #FFD700; color: #121212; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">${mix.genre || 'Mixed'}</div>
                    <h3>${mix.title}</h3>
                    <p class="mix-artist">${mix.artist}</p>
                    <p class="mix-meta">${mix.duration || '0:00'} • ${mix.bpm || '120'} BPM</p>
                    <div class="mix-rating">${this.renderStars(mix.averageRating || 0)} (${mix.reviewCount || 0})</div>
                    <p class="mix-description">${mix.description || ''}</p>
                    <div class="mix-footer">
                        <span class="mix-price">KSh ${mix.price}</span>
                        <div class="mix-buttons">
                            <button onclick="cartManager.addToCart(${JSON.stringify(mix).replace(/"/g, '&quot;')})" class="btn-add-cart">Add to Cart</button>
                            <button onclick="authManager?.currentUser ? authManager.addToWishlist(${mix.id}) : alert('Login to add to wishlist')" class="btn-wishlist" title="Add to Wishlist">♡</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const stars = Math.round(rating);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }
}

let searchFilterManager;
document.addEventListener('DOMContentLoaded', () => {
    searchFilterManager = new SearchFilterManager();
});
