exports.calculateDynamicPrice = (basePrice, isRainy, distance) => {
    let multiplier = 1.0;
    if (isRainy) multiplier += 0.5; // Surcharge for rainy season in Gembu
    if (distance > 10) multiplier += 0.2;
    return basePrice * multiplier;
};