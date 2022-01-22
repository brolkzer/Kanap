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


const showCart = async () => {
  await fetchProducts();

  let productData = "";

  for (const prod of cart) {
      productData = await fetch(`http://localhost:3000/api/products/${prod.id}`).then(res => res.json());
      
      cartItems.innerHTML += (        

            `<article class="cart__item" data-id="${prod.id}" data-color="${prod.color}">
                <div class="cart__item__img">
                  <img src="${productData.imageUrl}" alt="${prod.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${prod.color}</p>
                    <p>${productData.price * prod.quantity} €</p>
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
    )
  } 

  const modifyCart = async () =>  {  
    const inputs = document.querySelectorAll('input[type="number"]');
    const deleteBtns = document.querySelectorAll('.deleteItem')
    
    inputs.forEach((input) => {
      let priceProduct = "";

      input.addEventListener('change', (e) => {
        let cart = JSON.parse(localStorage.getItem('products'));
        let prodIdInput = e.target.closest(".cart__item").dataset.id;
        let prodColorInput = e.target.closest(".cart__item").dataset.color;

        let foundProductCart = cart.find((p) => p.id == prodIdInput);
        let foundColorCart = cart.find((p) => p.color == prodColorInput);
        let foundProductColorCart = cart.filter((p) => p.color == prodColorInput).find((p) => p.id == prodIdInput);
        

        const fetchPrice = async () => {
          priceProduct = await fetch(`http://localhost:3000/api/products/${prodIdInput}`).then(res => res.json()).then((data) => data.price);
        }

        function updateQuantityCart() {
          const i = cart.findIndex((p) => p.id == prodIdInput && p.color == prodColorInput);
          cart[i].quantity = e.target.value
          localStorage.products = JSON.stringify(cart);
        }        
  
        if (foundProductColorCart != undefined) {
          const priceDisplay = document.querySelector('.cart__item__content__description p:last-child')
          const quantityDisplay = document.querySelector('.cart__item__content__settings__quantity p')
          foundColorCart.quantity = e.target.value;
          updateQuantityCart();
          fetchPrice()
          .then(() => priceDisplay.innerHTML = eval(foundProductColorCart.quantity * priceProduct) + "€")
          .then(() => quantityDisplay.innerHTML = foundProductColorCart.quantity)
          
          
          if (foundProductColorCart.quantity < 0) {
            // supprimer l'objet
          }
        }
      })
    })

    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', (e) => {
        let cart = JSON.parse(localStorage.getItem('products'));
        let prodId = e.target.closest(".cart__item").dataset.id;
        let prodColor = e.target.closest(".cart__item").dataset.color;
        // console.log(cart)
        // console.log(e.target.closest(".cart__item").dataset.id)
        // console.log(e.target.closest(".cart__item").dataset.color)
        let foundProductCart = cart.find((p) => p.id == `${prodId}`);
        let foundColorCart = cart.find((p) => p.color == `${prodColor}`);
        let foundProductColorCart = cart.filter((p) => p.color == `${prodColor}`).find((p) => p.id == `${prodId}`);
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

