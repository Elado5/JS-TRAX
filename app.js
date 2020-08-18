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
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

//קלאס שאחראי על הצגת המוצרים
class UI {

}

//אחסון מקומי - local storage
class Storage {

}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();

    //get all products
    products.getProducts().then(data => console.log(data));
})