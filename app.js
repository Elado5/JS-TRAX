//משתנים

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartMain = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartContent = document.querySelector(".products-center");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const productsMain = document.querySelector(".products-center");

// עגלה

let cart =[];

// קלאס שאחראי על השגת המוצרים
class products{

}

//קלאס שאחראי על הצגת המוצרים
class UI {

}

//אחסון מקומי - local storage
class Storage{

}

document.addEventListener("DOMContentLoaded",()=>{
const ui = new UI()
const products = new Products();
})