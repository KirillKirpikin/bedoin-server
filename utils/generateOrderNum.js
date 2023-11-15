const generateOrderNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const randomPart = Math.random().toString(36).substr(2, 4).toUpperCase(); // Генерируем случайные символы
    return `ORD-${year}${month}${day}${hour}${minute}${second}-${randomPart}`;
};

module.exports = generateOrderNumber;