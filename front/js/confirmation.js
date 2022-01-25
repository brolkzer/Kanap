/**
 * Display the order ID to the user, minus one character which is a question mark
 * @param { string } orderId
 */
document.getElementById('orderId').innerText = document.location.search.substr(1);