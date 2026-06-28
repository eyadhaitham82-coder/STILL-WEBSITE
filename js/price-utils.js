function parsePrice(str) {
    const num = String(str || '').replace(/[^0-9.]/g, '');
    return parseFloat(num) || 0;
}

function formatPrice(amount) {
    const value = Math.round(parseFloat(amount) || 0);
    return value.toLocaleString('en-EG') + ' EGP';
}
