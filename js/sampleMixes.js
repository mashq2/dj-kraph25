// Sample Mixes for Demo/Testing
const SAMPLE_MIXES = [];

// Function to load sample mixes if storage is empty
function loadSampleMixes() {
    const STORAGE_KEY = 'djkraph_mixes';
    const existingMixes = localStorage.getItem(STORAGE_KEY);
    
    if (!existingMixes || JSON.parse(existingMixes).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MIXES));
        console.log('✅ Sample mixes loaded!');
        return SAMPLE_MIXES;
    }
    
    return JSON.parse(existingMixes);
}

// Auto-load on page load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only load samples if we're NOT on the admin page
        if (!window.location.pathname.includes('admin.html')) {
            loadSampleMixes();
        }
    });
}
