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
  document.getElementById('totalPrice').innerText = new Intl.NumberFormat('fr-FR').format(itemsPrice);
}

const showCart = async () => {
  await fetchProducts();
  await getCartTotalQuantityOnLoad();
  await getCartTotalPriceOnLoad();

  let productData = "";

  for (const prod of cart.sort((a, b) => b.id < a.id)) {
      productData = await fetch(`http://localhost:3000/api/products/${prod.id}`).then(res => res.json());
      cart = cart;
      
      cartItems.innerHTML += (        

            `<article class="cart__item" data-id="${prod.id}" data-color="${prod.color}">
                <div class="cart__item__img">
                  <img src="${productData.imageUrl}" alt="${prod.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${prod.color}</p>
                    <p>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(eval(productData.price * prod.quantity))}</p>
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
          totalItemsPrice = itemsPrice;
          document.getElementById('totalPrice').innerText = new Intl.NumberFormat('fr-FR').format(totalItemsPrice);
        }

        if (foundProductColorCart != undefined) {
          let priceDisplay = e.target.closest(".cart__item__content").querySelector('.cart__item__content__description > p:last-child');         
          let quantityDisplay = e.target.closest(".cart__item__content").querySelector(".cart__item__content__settings > .cart__item__content__settings__quantity > p");
          updateQuantityCart();
          fetchPrice()
          .then(() => priceDisplay.innerHTML = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(eval(foundProductColorCart.quantity * priceProduct)))
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

const formInputs = document.querySelectorAll('input[type="text"], input[type="email"]');
const form = document.querySelector('.cart__order__form')

let firstName, lastName, address, city, email;

const errorDisplay = (tag, message, valid) => {
  const errorMsg = document.getElementById(tag + 'ErrorMsg');

  if (!valid) {
    errorMsg.textContent = message
  } else {
    errorMsg.textContent = message
  }
}

const firstNameChecker = (value) => {
  if (value.length > 0 && value.length < 3 || value.length > 20) {
    errorDisplay("firstName", "Le prénom doit faire entre 3 et 20 caractères");
    firstName = null;
  } else if (!value.match(/^[a-zA-Z0-9_.-]*$/)) {
    errorDisplay("firstName", "Le prénom ne doit pas contenir de caractères spéciaux");
    firstName = null;
  } else {
    errorDisplay("firstName", "", true);
    firstName = value;
  }
}

const lastNameChecker = (value) => {
  if (value.length > 0 && value.length < 3 || value.length > 20) {
    errorDisplay("lastName", "Le nom de famille doit faire entre 3 et 20 caractères");
    lastName = null;
  } else if (!value.match(/^[a-zA-Z0-9_.-]*$/)) {
    errorDisplay("lastName", "Le nom de famille ne doit pas contenir de caractères spéciaux");
    lastName = null;
  } else {
    errorDisplay("lastName", "", true);
    lastName = value;
  }
}

const addressChecker = (value) => {
  if (value.length > 0 && value.length < 3 || value.length > 50) {
    errorDisplay("address", "L'adresse doit faire entre 3 et 50 caractères");
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
}

const cityChecker = (value) => {
  if (value.length > 0 && value.length < 3 || value.length > 20) {
    errorDisplay("city", "Le nom de la ville doit faire entre 3 et 20 caractères");
    city = null;
  } else if (!value.match(/^[a-zA-Z0-9_.-]*$/)) {
    errorDisplay("city", "Le nom de la ville ne doit pas contenir de caractères spéciaux");
    city = null;
  } else {
    errorDisplay("city", "", true);
    city = value;
  }
}

const emailChecker = (value) => {
  if (!value.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay ("email", "", true);
    email = value;
  }
}

formInputs.forEach((formInput) => {
  formInput.addEventListener('input', (e) => {
    switch (e.target.id) {
      case "firstName":
        firstNameChecker(e.target.value);
        break;

      case "lastName":
        lastNameChecker(e.target.value)  ;
        break;

      case "address":
        addressChecker(e.target.value);
        break;

      case "city":
        cityChecker(e.target.value);
        break;

      case "email":
        emailChecker(e.target.value);
        break;

      default:
        null;
    }
  })
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const contact = {firstName, lastName, address, city, email};

  let cart = JSON.parse(localStorage.getItem('products'));
  let products = [];

  for (i = 0; i < cart.length; i++ ) {
    products.push(cart[i].id);
  }

  const postData = {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json"
    },

    body: JSON.stringify({contact, products}),
  };

  
  if (firstName && lastName && address && city && email) {
    
    const cartPost = async () => {
      dataPost = await fetch("http://localhost:3000/api/products/order", postData);
      
      const dataResponse = await dataPost.json();
      console.log(dataResponse);
      console.log(dataResponse.orderId)
      window.location.href=`http://127.0.0.1:5500/front/html/confirmation.html?${dataResponse.orderId}`;
    }
    cartPost(); 
    
    
  } else {
    alert('Veuillez remplir correctement les champs')
  }
})