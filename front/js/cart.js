let cartItems = document.getElementById('cart__items');
let cart = JSON.parse(localStorage.getItem('products'));
const items = document.getElementById("items");
let products;

const fetchProducts = async () => {
    /**
     * Fetch for all the products listed on the API
     * @param { string } Url
     */
    products = await fetch("http://localhost:3000/api/products").then(res => res.json());
};

fetchProducts();

async function getCartTotalQuantityOnLoad() {
  /**
   * get the localStorage content to give it to cart, 
   * for each element of cart add the quantity amount 
   * then display the result to the user
   * @param { Array.<object> }
   * @param { number } quantity
   * @param { number } itemsQuantity
   */
  let cart = JSON.parse(localStorage.getItem('products'));
  let itemsQuantity = 0;

  for (const product of cart) {
    eval(itemsQuantity += parseInt(product.quantity))
  }
  document.getElementById('totalQuantity').innerText = itemsQuantity;
}

async function getCartTotalPriceOnLoad() {
  /**
   * get the localStorage content to give it to cart, 
   * for each element of cart fetch it's price 
   * and compute it's price with it's quantity, 
   * then display the price to the user
   * @param { Array.<object> } 
   * @param { string } Url
   * @param { number } quantity
   * @param { number } price
   */
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

  /** 
   * Create a HTML element "article" for each product saved in the localStorage 
   * and sorts it by it's ID 
   * then fills it with data fecthed from API
   * @param { string } Url
   * @param { string } id
   * @param { string } color
   * @param { string } imageUrl
   * @param { string } altTxt
   * @param { string } name
   * @param { string } price
   */

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
          /**
           * Fetch for specific products on the API via it's ID defined beyond with closest method to get the dataset values
           * @param { string } Url
           * @param { string } prodIdInput
           * @param { string } prodColorInput
           */
          priceProduct = await fetch(`http://localhost:3000/api/products/${prodIdInput}`).then(res => res.json()).then((data) => data.price);
        }

        function updateQuantityCart() {
          /**
           * Defines i as the index of the object we want to update the quantity,
           * set his quantity from the input value, 
           * save the cart then resend it to localStorage
           * @param { string } i 
           * @param { string } quantity
           * @param { Array.<object> } 
           */
          const i = cart.findIndex((p) => p.id == prodIdInput && p.color == prodColorInput);
          cart[i].quantity = e.target.value
          localStorage.products = JSON.stringify(cart);
        }
        
        function deleteQuantity() {
          /**
           * Target a product with it's id & color, 
           * then defines the localCart as every that is not this target then save the localCart, 
           * send it to localStorage 
           * and reload the page
           * @param { Array.<object> }
           * @param { string } prodIdInput
           * @param { string } prodColorInput
           */
          cart = cart.filter((p) => p.id != prodIdInput || p.color != prodColorInput);
          localStorage.products = JSON.stringify(cart);
          location.reload()
        }

        function getCartTotalQuantity() {
          /**
           * Get localStorage,
           * for each product adds it's quantity to the itemsQuantity var,
           * then return result
           * @param { Array.<object> }
           * @param { number } quantity
           * @param { number } itemsQuantity
           * @return { number } 
           */
          let cart = JSON.parse(localStorage.getItem('products'));
          let itemsQuantity = 0;

          for (const product of cart) {
            eval(itemsQuantity += parseInt(product.quantity))
          }
          return itemsQuantity;
        }

        async function getCartTotalPrice() {  
          /**
           * Get localStorage,
           * for each product : Fetch it's data from the API by it's ID to get it's price
           * compute the price with it's quantity and set the result to itemsPrice var
           * then display the price to the user
           * @param { string } url 
           * @param { Array.<object> }
           * @param { number } quantity
           * @param { number } price
           * 
           */
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
          /**
           * If product exists, modify it's quantity in the cart Array, send cart to localStorage,
           * display it's price and quantity,
           * update totalPrice and totalQuantity values
           * Also, if quantity is inferior or equal to 0, delete the product from cart and send cart to localStorage
           * @param { Array.<object> } 
           * @param { number } priceDisplay
           * @param { number } quantityDisplay
           * @param { number } quantity
           */
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
          /**
           * Target a product with it's id & color, 
           * then defines the cart as every that is not this target then save the cart, 
           * send it to localStorage 
           * and reload the page
           * @param { Array.<object> }
           * @param { string } prodId
           * @param { string } prodColor
           */
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
  /**
   * Targets the input with the tag param + ErrorMsg HTML id to add text when conditions ask to
   * @param { string } tag
   * @param { string } message
   * @param { boolean } valid
   */
  const errorMsg = document.getElementById(tag + 'ErrorMsg');

  if (!valid) {
    errorMsg.textContent = message
  } else {
    errorMsg.textContent = message
  }
}

const firstNameChecker = (value) => {
  /**
   * Display the error message whenever first name length isn't between 3 to 20 characters and contains specials characters
   * When conditions are fulfilled, gives firstName var it's input value
   * @param { string } value
   * @param { number } value.length
   * @param { string } firstName
   * @param { * } REGEX
   */
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
  /**
   * Display the error message whenever last name length isn't between 3 to 20 characters and contains specials characters
   * When conditions are fulfilled, gives lastName var it's input value
   * * @param { string } value
   * @param { number } value.length
   * @param { string } lastName
   * @param { * } REGEX
   */
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
  /**
   * Display the error message whenever address length isn't between 3 to 50 characters
   * When conditions are fulfilled, gives address var it's input value
   * * @param { string } value
   * @param { number } value.length
   * @param { string } address
   */
  if (value.length > 0 && value.length < 3 || value.length > 50) {
    errorDisplay("address", "L'adresse doit faire entre 3 et 50 caractères");
    address = null;
  } else {
    errorDisplay("address", "", true);
    address = value;
  }
}

const cityChecker = (value) => {
  /**
   * Display the error message whenever city length isn't between 3 to 20 characters and contains specials characters
   * When conditions are fulfilled, gives city var it's input value
   * * @param { string } value
   * @param { number } value.length
   * @param { string } city
   */
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
  /**
   * Display the error message whenever email is not a valid email
   * When conditions are fulfilled, gives firstName var it's input value
   * * @param { string } value
   * @param { string } email
   * @param { * } REGEX
   */
  if (!value.match(/^[\w_-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    errorDisplay("email", "Le mail n'est pas valide");
    email = null;
  } else {
    errorDisplay ("email", "", true);
    email = value;
  }
}

formInputs.forEach((formInput) => {
  /**
   * Call for the function adapted to the input id that is getting used
   * @param { string, number } e.target.value
   * @param { string } e.target.id
   */
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
      /**
       * Checks if the inputs are filled, if so :  
       * Fetch the API with POST, sending contact object and products array containing id of products ordered, expecting an orderId in response
       * then redirects the user to the confirmation page
       * @param { string } Url
       * @param { object } postData
       * @param { reponse } dataPost
       * @param { string } Url
       */
      dataPost = await fetch("http://localhost:3000/api/products/order", postData);
      
      const dataResponse = await dataPost.json();
      window.location.href=`http://127.0.0.1:5500/front/html/confirmation.html?orderId=${dataResponse.orderId}`;
    }
    cartPost();     
    
  } else {
    alert('Veuillez remplir correctement les champs')
  }
})