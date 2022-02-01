/**
 * Display the order ID to the user, minus one character which is a question mark
 * @param { string } URL
 * @param { string } orderId
 * @param { string } search.params
 */

let url = new URL(window.location);
let search_params = new URLSearchParams(url.search); 
if(search_params.has('orderId')) {
  let orderId = search_params.get('orderId');
  document.getElementById('orderId').innerText = orderId;
}