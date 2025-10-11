// Clear all localStorage data and force refresh
function clearCache() {
    localStorage.clear();
    window.location.reload();
}

// Export for manual use in browser console
window.clearHotelCache = clearCache;

console.log("To clear cache and see Marathi names, run: clearHotelCache() in console");