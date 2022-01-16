let cartItems = document.getElementById('cart__items');
let cart = JSON.parse(localStorage.getItem('products'));
const items = document.getElementById("items");
let products;

const fetchProducts = async () => {
    /**
     * Request data from api as a json file
     * @param { string } Url
     */
    products = await fetch("http://localhost:3000/api/products").then(res => res.json());
};

fetchProducts();

const fetchPrice = async () => {
    
    for (const prod of cart) {
        await fetch(`http://localhost:3000/api/products/${prod.id}`).then(res => res.json()).then((data) => console.log(data.price));
    }
}
fetchPrice();


const showCart = async () => {
    await fetchProducts();

    cartItems.innerHTML = (
        cart.map(prod => (

            `<article class="cart__item" data-id="${prod.id}" data-color="${prod.color}">
            <div class="cart__item__img">
              <img src="${prod.image}" alt="${prod.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${prod.name}</h2>
                <p>${prod.color}</p>
                <p>42,00 € </p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : ${prod.quantity}</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${prod.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
        ))
    )
};
showCart();