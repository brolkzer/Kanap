function saveCart (cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart () {
    let cart = localStorage.getItem("cart");
    if (cart ==nul) {
        return [];
    }
    else {
        return JSON.parse(cart);
    }
}

function addCart (product) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity++
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    saveCart(cart);
}

function removeCart (product) {
    let cart = getCart();
    cart = cart.filter(p => p.id != product.id);
    saveCart(cart);
}

function changeQuantity (product,quantity) {
    let cart = getcart();
    let foundProduct = cart.find(p => p.id == product.id);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
        if (foundProduct.quantity <= 0) {
            removeCart(foundProduct)
        } else {
            saveCart(cart)
        }        
    }
}

function getProdutNumber () {
    let cart = getCart();
    let number = 0;
    for ( let product of cart) {
        number += product.quantity;
    }
    return number;
}

function totalPrice () {
    let cart = getCart();
    let total = 0;
    for ( let product of cart) {
        tal += product.quantity * product.price;
    }
    return total; 
}

