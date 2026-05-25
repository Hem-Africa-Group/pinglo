// config.js
export const AppConfig = {
    region: 'us-east-1',
    HEM_CORE_ENDPOINT: 'https://core.hem-africa.com',
    // Regional Pricing Logic
    getPricing: (countryCode) => {
        return countryCode === 'NG' ? { premium: 2500, currency: 'NGN' } : { premium: 9.99, currency: 'USD' };
    },
    // Kidas Content Manager
    kidasFilter: (text) => {
        const blacklist = ['spam', 'ban_word_1', 'ban_word_2'];
        return blacklist.some(w => text.toLowerCase().includes(w)) ? 'REJECTED' : 'APPROVED';
    }
};