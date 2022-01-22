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

async function getCartTotalQuantityOnLoad() {
  let cart = JSON.parse(localStorage.getItem('products'));
  let itemsQuantity = 0;

  for (const product of cart) {
    eval(itemsQuantity += parseInt(product.quantity))
  }
  document.getElementById('totalQuantity').innerText = itemsQuantity;
}

async function getCartTotalPriceOnLoad() {  
  let cart = JSON.parse(localStorage.getItem('products'));
  let itemsPrice = 0;
  let eachItemPrice = 0;

  for (const product of cart)  {
    eachItemPrice = await fetch(`http://localhost:3000/api/products/${product.id}`).then(res => res.json()).then((data) => data.price)
    eval(itemsPrice += parseInt(product.quantity) * parseInt(eachItemPrice))
  }
  document.getElementById('totalPrice').innerText = itemsPrice;
}

const showCart = async () => {
  await fetchProducts();
  await getCartTotalQuantityOnLoad();
  await getCartTotalPriceOnLoad();

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
        
        function deleteQuantity() {
          cart = cart.filter((p) => p.id != prodIdInput || p.color != prodColorInput);
          localStorage.products = JSON.stringify(cart);
          location.reload()
        }

        function getCartTotalQuantity() {
          let cart = JSON.parse(localStorage.getItem('products'));
          let itemsQuantity = 0;

          for (const product of cart) {
            eval(itemsQuantity += parseInt(product.quantity))
          }
          return itemsQuantity;
        }

        async function getCartTotalPrice() {  
          let cart = JSON.parse(localStorage.getItem('products'));
          let itemsPrice = 0;
          let eachItemPrice = 0;
          let totalItemsPrice = 0;
        
          for (const product of cart)  {
            eachItemPrice = await fetch(`http://localhost:3000/api/products/${product.id}`).then(res => res.json()).then((data) => data.price)
            itemsPrice += eval(parseInt(product.quantity) * parseInt(eachItemPrice))
          }
          console.log(itemsPrice)
          console.log(typeof itemsPrice)
          totalItemsPrice = itemsPrice;
          document.getElementById('totalPrice').innerText = totalItemsPrice;
        }

        if (foundProductColorCart != undefined) {
          let priceDisplay = e.target.closest(".cart__item__content").querySelector('.cart__item__content__description').querySelector('p:last-child')          
          let quantityDisplay = e.target.closest(".cart__item__content").querySelector('.cart__item__content__settings').querySelector('.cart__item__content__settings__quantity').querySelector('p')
          updateQuantityCart();
          fetchPrice()
          .then(() => priceDisplay.innerHTML = eval(foundProductColorCart.quantity * priceProduct) + "€")
          .then(() => quantityDisplay.innerHTML = `Qté : ` + foundProductColorCart.quantity)
          .then(() => document.getElementById('totalQuantity').innerText = eval(getCartTotalQuantity()))
          .then(() => getCartTotalPrice())         
          
          if (foundProductColorCart.quantity <= 0) {
            deleteQuantity();
            getCartTotalQuantity();
            getCartTotalPrice();
          }
        }
      })
    })

    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener('click', (e) => {
        let cart = JSON.parse(localStorage.getItem('products'));
        let prodId = e.target.closest(".cart__item").dataset.id;
        let prodColor = e.target.closest(".cart__item").dataset.color;

        let foundProductCart = cart.find((p) => p.id == `${prodId}`);
        let foundColorCart = cart.find((p) => p.color == `${prodColor}`);
        let foundProductColorCart = cart.filter((p) => p.color == `${prodColor}`).find((p) => p.id == `${prodId}`);

        function deleteProduct() {
          cart = cart.filter((p) => p.id != prodId || p.color != prodColor);
          localStorage.products = JSON.stringify(cart);
          location.reload()
        }

        if (foundProductColorCart != undefined) {
          deleteProduct();
          getCartTotalQuantity();
        }
      })
    })
  }
  modifyCart();

}
showCart();