//משתנים

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartMain = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const productsDOM = document.querySelector(".products-center");

// עגלה



let cart = [];

//buttons
let buttonsDOM = [];

// קלאס שאחראי על השגת המוצרים
class Products {

    //מגדירים איך המוצרים מהג'ייסון נותנים את הדאטה שלהם
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();

            let products = data.items;
            products = products.map(item => {
                //תביא לי את שתי התכונות האלה של החפצים מהמערך
                const {
                    title,
                    price
                } = item.fields;
                //תביא לי את האיידי של החפצים מהמערך
                const {
                    id
                } = item.sys;
                //תביא לי את התמונה של החפצים מהמערך
                const image = item.fields.image.fields.file.url;
                return {
                    title,
                    price,
                    id,
                    image
                }
                //it's like " title = title, price = price" and so on
            })
            return products
        } catch (error) {
            console.log(error);
        }
    }
}

//קלאס שאחראי על הצגת המוצרים
// הפונקציה אומרת, על כל מוצר שקיים במאגר תכניס את הקוד הבא לתוצאה, תשלוף את הפרטים של המוצר ובסוף תהפוך את התוצאה הזאת לאינר אייצ' טי אם אל
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
        });
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        console.log(buttons);
        
        //[...] נוסף כדי ליצור מערך במקום נודליסט
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            //בדיקה האם האייטם בעגלה
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }
                button.addEventListener('click',(event)=> {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    // get product from products based on id we're getting from the bottom
                    // {... } lets me turn it into an array and add the ''amount:1" section
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    
                    // add product to the cart
                    cart = [...cart, cartItem]; // cart = כל המוצרים שיש כרגע בעגלה + המוצר שהרגע נוסף
                    // save cart in local storage
                    Storage.saveCart(cart)
                    // set cart values
                    this.setCartValues(cart);
                    // display cart item
                    // show the cart
                });
            })
        };
        setCartValues(cart){
            let tempTotal = 0;
            let itemsTotal = 0;
            //map() יוצרת מערך חדש מהתוצאות שמתקבלות מהפונקציה שמחילים על המערך הקיים
            cart.map(item =>{
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            })
            //בגלל שלהכפיל מספרים עם שברים נרצה להשתמש ב-TOFIX
            //מחזירים לפלואוט את הסטרינג שמתקבל מטופיקס לשתי נקודות עשרוניות
            cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
            cartItems.innerText = itemsTotal;
            console.log(cartTotal, cartItems);
        }
    }
    

//אחסון מקומי - local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
        
    }

    //מחזיר את המוצר אם האיידי שלו תואם את האיידי שמוזן בפונקציה
    static getProduct(id){
        //json.parse כי המרנו לסטרינג מקודם
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();

    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });

})