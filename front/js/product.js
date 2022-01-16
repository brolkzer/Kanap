const productImage = document.querySelector('.item__img');
const productName = document.getElementById('title');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productColors = document.getElementById('colors');

let urlSearch = new URLSearchParams(document.location.search);
let urlId = urlSearch.get('id');

let product;

const fetchProduct = async () => {
    product = await fetch(`http://localhost:3000/api/products/${urlId}`).then(res =>res.json());
};

const showProduct = async () => {
    await fetchProduct();
    const productClrs = product.colors;

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
    productColor = (e.target.value.substr(1));
    console.log(productColor)
});

const inputNumber = document.getElementById('quantity')
let productNumber = "";

inputNumber.addEventListener('input', (e) => {
    productNumber = e.target.value;
    console.log(productNumber)
});

let localCart = [];

function updateCart() {
    if (JSON.parse(localStorage.getItem('products'))) {
        localCart = JSON.parse(localStorage.getItem('products'))
    } else {
        localCart = [];
    }
}

function storeCart() {
    localStorage.products = JSON.stringify(localCart);
};

const addToLocalCart = async () => {
    await fetchProduct();
    await updateCart();
    
    let productFeatures = {
        id: `${product._id}`,
        color: productColor,
        quantity: productNumber,
        name: `${product.name}`,
        image: `${product.imageUrl}`,
        altTxt: `${product.altTxt}`
    };

    let foundProduct = localCart.find((p) => p.id == `${product._id}`);
    let foundColor = localCart.find((p) => p.color == productColor);
    let foundProductColor = localCart.filter((p) => p.color == productColor).find((p) => p.id == `${product._id}`);

    if (foundProduct != undefined && foundColor != undefined) {
        console.log('déjà stocké');
        foundProductColor.quantity = eval(parseInt(foundProductColor.quantity) + parseInt(productNumber));
        storeCart();

    } else if (foundProduct != undefined) {
        console.log('stocké mais pas cette couleur');
        localCart.push(productFeatures);
        storeCart();

    } else {
        console.log('pas stocké')
        localCart.push(productFeatures);
        storeCart();
    } 
};

const addBtn = document.getElementById('addToCart');

addBtn.addEventListener('click', () => {
    if (productColor && productNumber && productNumber != 0 && productNumber < 101) {
        addToLocalCart();
    } else {
        alert('Veuillez choisir la couleur de l\'article et le nombre d\'article.')
    }
});

let filterArrayColorAndId = "";