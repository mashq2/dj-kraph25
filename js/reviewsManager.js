// Ratings and Reviews Manager
const REVIEWS_STORAGE_KEY = 'djkraph_reviews';

class ReviewsManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.initEventListeners();
    }

    initEventListeners() {
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
        }
    }

    handleReviewSubmit(e) {
        e.preventDefault();

        if (!authManager?.isLoggedIn()) {
            alert('Please login to leave a review');
            return;
        }

        const mixId = parseInt(document.getElementById('reviewMixId').value);
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value;

        if (rating < 1 || rating > 5) {
            alert('Please select a valid rating');
            return;
        }

        const review = {
            id: Date.now(),
            mixId,
            userId: authManager.currentUser.id,
            username: authManager.currentUser.username,
            rating,
            comment,
            date: new Date().toISOString(),
            helpful: 0
        };

        this.reviews.push(review);
        this.saveReviews();
        this.updateMixRating(mixId);
        this.displayReviews(mixId);
        this.showMessage('Review posted successfully!', 'success');
        document.getElementById('reviewForm').reset();
    }

    getReviewsForMix(mixId) {
        return this.reviews.filter(r => r.mixId === mixId);
    }

    getAverageRating(mixId) {
        const mixReviews = this.getReviewsForMix(mixId);
        if (mixReviews.length === 0) return 0;
        const sum = mixReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / mixReviews.length).toFixed(1);
    }

    updateMixRating(mixId) {
        if (mixManager) {
            const mix = mixManager.mixes.find(m => m.id === mixId);
            if (mix) {
                mix.averageRating = this.getAverageRating(mixId);
                mix.reviewCount = this.getReviewsForMix(mixId).length;
                mixManager.saveMixes();
            }
        }
    }

    displayReviews(mixId) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        if (!reviewsContainer) return;

        const mixReviews = this.getReviewsForMix(mixId);

        if (mixReviews.length === 0) {
            reviewsContainer.innerHTML = '<p style="text-align: center; color: #999;">No reviews yet. Be the first to review!</p>';
            return;
        }

        const avgRating = this.getAverageRating(mixId);
        reviewsContainer.innerHTML = `
            <div class="reviews-summary">
                <h3>Reviews (${mixReviews.length})</h3>
                <div class="rating-summary">
                    <span class="rating-stars">${this.renderStars(avgRating)}</span>
                    <span class="rating-number">${avgRating}/5</span>
                </div>
            </div>
            <div class="reviews-list">
                ${mixReviews.map(review => `
                    <div class="review-item">
                        <div class="review-header">
                            <strong>${review.username}</strong>
                            <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div class="review-rating">${this.renderStars(review.rating)}</div>
                        <p class="review-comment">${review.comment}</p>
                        <button class="btn-helpful">👍 Helpful (${review.helpful})</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderStars(rating) {
        const stars = Math.round(rating);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    }

    saveReviews() {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(this.reviews));
    }

    loadReviews() {
        const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    deleteReview(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (!review) return;

        if (authManager?.currentUser?.id !== review.userId) {
            alert('You can only delete your own reviews');
            return;
        }

        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.saveReviews();
        this.updateMixRating(review.mixId);
        this.displayReviews(review.mixId);
    }

    showMessage(text, type) {
        const messageEl = document.getElementById('reviewMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            setTimeout(() => messageEl.className = 'message', 4000);
        }
    }
}

let reviewsManager;
document.addEventListener('DOMContentLoaded', () => {
    reviewsManager = new ReviewsManager();
});
