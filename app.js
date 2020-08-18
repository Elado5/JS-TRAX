//משתנים

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartMain = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const productsMain = document.querySelector(".products-center");

// עגלה

let cart = [];

// קלאס שאחראי על השגת המוצרים
class Products {

    //מגדירים איך המוצרים מהג'ייסון נותנים את הדאטה שלהם
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item =>{
              //תביא לי את שתי התכונות האלה של החפצים מהמערך
                const {title,price} = item.fields;
             //תביא לי את האיידי של החפצים מהמערך
                const {id} = item.sys;
            //תביא לי את התמונה של החפצים מהמערך
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image}
                //it's like " title = title, price = price" and so on
             })
             return products
        } catch (error) {
            console.log(error);
        }
    }
}

//קלאס שאחראי על הצגת המוצרים
//כל מה שמופיע על המסך מסודר פה
class UI {
displayProducts(products) {
    let result = '';
    products.forEach(product => {
        result += `
        <article class="product">
        <div class="img-container">
            <img 
            src=${product.image}
            alt=${product.title}
            class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
            </button>

        </div>
        <h3>${product.title}</h3>
        <h4>₪${product.price}</h4>
        </article>
            <!-- end of single product -->
        `
     })
    }
}

//אחסון מקומי - local storage
class Storage {

}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();

    //get all products
    products.getProducts().then(products => ui.displayProducts(products));
})