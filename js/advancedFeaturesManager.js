// Enhanced Features Manager
const ANALYTICS_KEY = 'djkraph_analytics';
const PROMO_CODES_KEY = 'djkraph_promo_codes';
const ACHIEVEMENTS_KEY = 'djkraph_achievements';

class AdvancedFeaturesManager {
    constructor() {
        this.analytics = this.loadAnalytics();
        this.promoCodes = this.loadPromoCodes();
        this.achievements = this.loadAchievements();
        this.initializePromoSystem();
    }

    // ==================== PROMO CODE SYSTEM ====================
    initializePromoSystem() {
        // Create default promo codes for testing
        if (this.promoCodes.length === 0) {
            this.addPromoCode({
                code: 'WELCOME20',
                discount: 20,
                type: 'percentage',
                maxUses: 100,
                usedCount: 0,
                active: true,
                description: 'Welcome discount - 20% off'
            });
            this.addPromoCode({
                code: 'SUMMER500',
                discount: 500,
                type: 'fixed',
                maxUses: 50,
                usedCount: 0,
                active: true,
                description: 'Summer special - KSh 500 off'
            });
        }
    }

    addPromoCode(code) {
        code.id = Date.now();
        code.createdAt = new Date().toISOString();
        this.promoCodes.push(code);
        this.savePromoCodes();
    }

    validatePromoCode(code) {
        const promo = this.promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
        
        if (!promo) return { valid: false, message: 'Promo code not found' };
        if (!promo.active) return { valid: false, message: 'Promo code expired' };
        if (promo.usedCount >= promo.maxUses) return { valid: false, message: 'Promo code limit reached' };
        
        return { valid: true, discount: promo.discount, type: promo.type, id: promo.id };
    }

    applyPromoCode(total, promoCode) {
        const validation = this.validatePromoCode(promoCode);
        if (!validation.valid) {
            return { success: false, message: validation.message, finalTotal: total };
        }

        let discount = 0;
        if (validation.type === 'percentage') {
            discount = (total * validation.discount) / 100;
        } else {
            discount = validation.discount;
        }

        // Mark as used
        const promo = this.promoCodes.find(p => p.id === validation.id);
        if (promo) {
            promo.usedCount++;
            this.savePromoCodes();
        }

        return {
            success: true,
            discount: discount,
            finalTotal: Math.max(0, total - discount),
            message: `Promo code applied! You saved KSh ${discount}`
        };
    }

    // ==================== ACHIEVEMENT BADGES ====================
    unlockAchievement(userId, achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        if (!authManager?.currentUser) return;
        
        const userAchievements = this.achievements.filter(a => 
            a.userId === authManager.currentUser.id && a.unlockedAt
        );

        if (!userAchievements.find(a => a.id === achievementId)) {
            achievement.userId = authManager.currentUser.id;
            achievement.unlockedAt = new Date().toISOString();
            this.saveAchievements();
        }
    }

    checkAchievements(userId) {
        if (!authManager?.isLoggedIn()) return;

        const purchases = authManager.currentUser.purchases?.length || 0;
        const reviews = reviewsManager?.reviews?.filter(r => r.userId === userId).length || 0;
        const wishlist = authManager.currentUser.wishlist?.length || 0;

        // First Purchase
        if (purchases === 1) this.unlockAchievement(userId, 'first_purchase');
        
        // Collector (5 purchases)
        if (purchases >= 5) this.unlockAchievement(userId, 'collector');
        
        // Super Fan (10+ purchases)
        if (purchases >= 10) this.unlockAchievement(userId, 'superfan');
        
        // Critic (5 reviews)
        if (reviews >= 5) this.unlockAchievement(userId, 'critic');
        
        // Curator (10 playlists/items)
        if (wishlist >= 10) this.unlockAchievement(userId, 'curator');
    }

    // ==================== ANALYTICS ====================
    trackMixView(mixId) {
        if (!this.analytics.mixViews) this.analytics.mixViews = {};
        this.analytics.mixViews[mixId] = (this.analytics.mixViews[mixId] || 0) + 1;
        this.saveAnalytics();
    }

    trackMixPurchase(mixId, amount) {
        if (!this.analytics.purchases) this.analytics.purchases = [];
        this.analytics.purchases.push({
            mixId,
            amount,
            timestamp: new Date().toISOString()
        });
        this.saveAnalytics();
    }

    getTopMixes() {
        const views = this.analytics.mixViews || {};
        return Object.entries(views)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([mixId, views]) => ({ mixId: parseInt(mixId), views }));
    }

    getRevenueTrend() {
        const purchases = this.analytics.purchases || [];
        const today = new Date().toISOString().split('T')[0];
        const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        return {
            today: purchases.filter(p => p.timestamp.startsWith(today))
                .reduce((sum, p) => sum + p.amount, 0),
            week: purchases.filter(p => p.timestamp >= week)
                .reduce((sum, p) => sum + p.amount, 0),
            total: purchases.reduce((sum, p) => sum + p.amount, 0)
        };
    }

    // ==================== RECOMMENDATIONS ====================
    recommendMixes(currentMixId, limit = 4) {
        const allMixes = mixManager?.mixes || [];
        const currentMix = allMixes.find(m => m.id === currentMixId);
        
        if (!currentMix) return [];

        // Find mixes with same genre, similar price, good rating
        return allMixes
            .filter(m => m.id !== currentMixId && m.genre === currentMix.genre)
            .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
            .slice(0, limit);
    }

    // ==================== STORAGE ====================
    saveAnalytics() {
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.analytics));
    }

    loadAnalytics() {
        const data = localStorage.getItem(ANALYTICS_KEY);
        return data ? JSON.parse(data) : { mixViews: {}, purchases: [] };
    }

    savePromoCodes() {
        localStorage.setItem(PROMO_CODES_KEY, JSON.stringify(this.promoCodes));
    }

    loadPromoCodes() {
        const data = localStorage.getItem(PROMO_CODES_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveAchievements() {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const existingData = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (existingData) return JSON.parse(existingData);

        // Default achievements
        return [
            { id: 'first_purchase', name: '🎯 First Mix', description: 'Buy your first mix', icon: '🎯' },
            { id: 'collector', name: '👑 Collector', description: 'Buy 5 mixes', icon: '👑' },
            { id: 'superfan', name: '⭐ Super Fan', description: 'Buy 10+ mixes', icon: '⭐' },
            { id: 'critic', name: '📝 Critic', description: 'Leave 5 reviews', icon: '📝' },
            { id: 'curator', name: '🎵 Curator', description: 'Add 10+ to wishlist', icon: '🎵' }
        ];
    }
}

// Social Sharing Manager
class SocialShareManager {
    generateShareLink(mixId, mixTitle) {
        const mix = mixManager?.mixes.find(m => m.id === mixId);
        if (!mix) return null;

        const domain = window.location.origin;
        const referralLink = `${domain}/index.html?ref=${mixId}`;
        return referralLink;
    }

    shareToTwitter(mixTitle, mixUrl) {
        const text = `🔥 Check out this amazing mix: "${mixTitle}" on DJ Kraph! 🎵`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(mixUrl)}`;
        window.open(twitterUrl, '_blank');
    }

    shareToFacebook(mixUrl) {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mixUrl)}`;
        window.open(fbUrl, '_blank');
    }

    shareToWhatsApp(mixTitle, mixUrl) {
        const text = `🎵 Check out: ${mixTitle} on DJ Kraph! 🔥 ${mixUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
    }
}

let advancedFeaturesManager;
let socialShareManager;

document.addEventListener('DOMContentLoaded', () => {
    advancedFeaturesManager = new AdvancedFeaturesManager();
    socialShareManager = new SocialShareManager();
});
