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

function updateQuantityCart() {
  localStorage.products = JSON.stringify(cart);
}

const showCart = async () => {
  await fetchProducts();

  let productData = 0;

  for (const prod of cart) {
      productData = await fetch(`http://localhost:3000/api/products/${prod.id}`).then(res => res.json()).then((data) => data.price);
      
      cartItems.innerHTML += (        

            `<article class="cart__item" data-id="${prod.id}" data-color="${prod.color}">
            <div class="cart__item__img">
              <img src="${prod.image}" alt="${prod.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${prod.name}</h2>
                <p>${prod.color}</p>
                <p id="${prod.color} + ${prod.id}">${productData * prod.quantity} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p id="${prod.id + prod.color}">Qté : ${prod.quantity}</p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${prod.quantity}" id="${prod.id}" data-color="${prod.color}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`        
    )
  } 

  const modifyCart = async () =>  {  
    const inputs = document.querySelectorAll('input[type="number"]');
    const deleteBtns = document.querySelectorAll('.deleteItem')
    
    inputs.forEach((input) => {  

    let priceProduct = "";

    const fetchPrice = async () => {
      await fetch(`http://localhost:3000/api/products/${input.id}`).then(res => res.json()).then((data) => priceProduct = data.price)
    }

      input.addEventListener('change', (e) => {
        let foundProductCart = cart.find((p) => p.id == `${input.id}`);
        let foundColorCart = cart.find((p) => p.color == `${input.dataset.color}`);
        let foundProductColorCart = cart.filter((p) => p.color == `${input.dataset.color}`).find((p) => p.id == `${input.id}`);
  
        if (foundProductCart =! undefined && foundColorCart != undefined) {
          foundProductColorCart.quantity = e.target.value;
          const quantityDisplay = document.getElementById(`${input.id + input.dataset.color}`)
          const priceDisplay = document.getElementById(`${input.dataset.color} + ${input.id}`)
          fetchPrice()
          .then(() => quantityDisplay.innerHTML = foundProductColorCart.quantity)
          .then(() => priceDisplay.innerHTML = eval(foundProductColorCart.quantity * priceProduct) + "€");
          updateQuantityCart();
          
          if (foundProductColorCart.quantity < 0) {
            // supprimer l'objet
          }
        }
      })
    })

    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', () => {
        let foundProductCart = cart.find((p) => p.id == `${cart.id}`);
        let foundColorCart = cart.find((p) => p.color == `${cart.color}`);
        let foundProductColorCart = cart.filter((p) => p.color == `${cart.color}`).find((p) => p.id == `${cart.id}`);
        console.log(foundProductColorCart);
        console.log(foundColorCart);
        console.log(foundProductCart)

        if (foundProductCart =! undefined && foundColorCart != undefined) {
          // cart.filter()
          // updateQuantityCart();
          // location.reload();
        }
      })
    })



  }
  modifyCart()
}
showCart();

