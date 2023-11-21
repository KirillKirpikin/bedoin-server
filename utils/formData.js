const formatDateTime = (dateTimeString) => {
    const dateObject = new Date(dateTimeString);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();


    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

module.exports = formatDateTime;