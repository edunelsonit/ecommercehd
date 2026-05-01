exports.calculateDeliveryFee = (distanceKm, isRainySeason) => {
    const baseFee = 300;
    const perKm = 100;
    let total = baseFee + (distanceKm * perKm);

    if (isRainySeason) {
        total *= 1.5; // 50% increase for difficult Gembu roads
    }
    return total;
};