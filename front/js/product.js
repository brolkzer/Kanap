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
    productColors.innerHTML = (
        `<option value="">--SVP, choisissez une couleur --</option>`
        +
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


let productFeatures = {
    name: product.name,
    id: product._id,
    color: productColor,
    quantity: productNumber,
    price: product.price,
};
console.log(productFeatures);


// let cart = [];

// const addToCart = async () => {
//     await showProduct();

//     const addBtn = document.getElementById('addToCart');

//     addBtn.addEventListener('click', () => { 
//         localStorage.setItem(`${product.name}` + ' ' + productColor, productNumber);
//         alert('Article ajouté dans votre panier');
//     })
// }

// addToCart();



