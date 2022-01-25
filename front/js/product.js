const productImage = document.querySelector('.item__img');
const productName = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productColors = document.getElementById('colors');

let urlSearch = new URLSearchParams(document.location.search);
let urlId = urlSearch.get('id');

let product;

const fetchProduct = async () => {
    /**
     * Fetch for specific products on the API via it's ID defined beyond with the URLSearchParams
     * @param { string } Url
     */
    product = await fetch(`http://localhost:3000/api/products/${urlId}`).then(res =>res.json());
};

const showProduct = async () => {
    await fetchProduct();
    const productClrs = product.colors;

    /**
     * Add dynamic data defined by the API response
     * @param { string } product. : imageUrl, altTxt, name, price, description, color;
     */

    productImage.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    productName.innerText = `${product.name}`;
    productPrice.innerText = `${product.price}`;
    productDescription.innerText = `${product.description}`;
    productColors.innerHTML += (
        productClrs.map(color => (
            `<option value="=${color}">${color}</option>`
        ))        
    );
};

showProduct();

const inputColor = document.getElementById('colors')
let productColor = "";

inputColor.addEventListener('input', (e) => {
    /**
     * Define productColor to be the input's chosen value minus first character which is a question mark 
     * @param { string } e.target.value
     */
    productColor = (e.target.value.substr(1));
});

const inputNumber = document.getElementById('quantity')
let productNumber = "";

inputNumber.addEventListener('input', (e) => {
    /** 
     * Define productNumber to be the input's chosen value
     * @param { number } e.target.value
     */
    productNumber = e.target.value;
});

let localCart = [];

function updateCart() {
    /** 
     * Set the localStorage objects to localCart if localStorage exists, if not, set localCart as an empty array
     * @param { array.<Object> } 
     */
    if (JSON.parse(localStorage.getItem('products'))) {
        localCart = JSON.parse(localStorage.getItem('products'))
    } else {
        localCart = [];
    }
}

function storeCart() {
    /**
     * Converts localCart as a JSON object to save in the localStorage
     * @param { array.<Object> }
     */
    localStorage.products = JSON.stringify(localCart);
};

const addToLocalCart = async () => {
    await fetchProduct();
    await updateCart();
    
    /**
     * Set the values of each object to save in the localStorage for each product
     * @param { string } id
     * @param { string } color
     * @param { number } quantity
     */
    let productFeatures = {
        id: `${product._id}`,
        color: productColor,
        quantity: productNumber,
    };

    let foundProduct = localCart.find((p) => p.id == `${product._id}`);
    let foundProductColor = localCart.filter((p) => p.color == productColor).find((p) => p.id == `${product._id}`);

    if (foundProductColor != undefined) {
        /**
         * If there is already a saved product with same id & color, just adds the input value to the existant saved quantity
         * @param { number } e.target.value
         */
        foundProductColor.quantity = eval(parseInt(foundProductColor.quantity) + parseInt(productNumber));
        storeCart();

    } else if (foundProduct != undefined) {
        /**
         * If there is already a saved product with same id but not same color, push a new object to the cart
         * @param { string } id
         * @param { string } color
         * @param { number } quantity
         */
        localCart.push(productFeatures);
        storeCart();

    } else {
        /**
         * If there is no product saved with the same id, push a new object to the cart
         * @param { string } id
         * @param { string } color
         * @param { number } quantity
         */
        localCart.push(productFeatures);
        storeCart();
    } 
};

const addBtn = document.getElementById('addToCart');

addBtn.addEventListener('click', () => {
    /**
     * Security conditions requiring to select a color and quantity in order to add a product to the cart
     * @param { string } color
     * @param { number } quantity
     */
    if (productColor && productNumber && productNumber != 0 && productNumber < 101) {
        addToLocalCart();
    } else {
        alert('Veuillez choisir la couleur de l\'article et le nombre d\'article.')
    }
});