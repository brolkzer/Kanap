let products;
const items = document.getElementById("items");

const fetchProducts = async () => {
    /**
     * Request data from api as a json file
     * @param { string } Url
     */
    products = await fetch("http://localhost:3000/api/products").then(res => res.json());
};

fetchProducts();

const showProducts = async () => {
    await fetchProducts();

    items.innerHTML = (
        /**
         * Create a new article for each product listed in the api
         * @param { object[] } product
         * @param { string } product[].imageUrl
         * @param { string } product[].altTxt
         * @param { string } product[].name
         * @param { string } product[].description
         * 
        */
        products.map(product => (
            `          
                <a href="./product.html?id=${product._id}">
                    <article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}" />
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                    </article>
                </a>
            `
            )).join('')
    );
};

showProducts();