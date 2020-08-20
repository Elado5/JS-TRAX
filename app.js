//משתנים

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
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
                add to cart
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
                    this.addCartItem(cartItem);
                    // show the cart
                    this.showCart();

                    this.cartLogic();
                });
            });
        }
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
        }
        addCartItem(item){
            //יוצר DIV
            //מכניס אותו לקונסט
            const div = document.createElement('div');
            //מכניס את הקלאס קארט-אייטם לתוך הדיב
            div.classList.add('cart-item');
            div.innerHTML = ` <img src=${item.image} alt="product">

                
            <div>
            <h4>${item.title}</h4>
            <h5>₪${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class ="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
            `;
            cartContent.appendChild(div);
        }
        showCart() {
            cartOverlay.classList.add("transparentBcg");
            cartDOM.classList.add("showCart");
            }

        setupAPP() {
            cart = Storage.getCart();
            this.setCartValues(cart);
            this.populateCart(cart); 
            cartBtn.addEventListener('click', this.showCart);
            closeCartBtn.addEventListener('click', this.hideCart);
        }
            

            populateCart(cart){
                cart.forEach(item =>this.addCartItem(item));
            }

            hideCart(){
                cartOverlay.classList.remove("transparentBcg");
                cartDOM.classList.remove("showCart");
            }

            clearCart() {
                //תחזיר לי את מספר האיידי של המוצר בעגלה ושמור בקארטאייטמס
                let cartItems = cart.map(item => item.id);

                console.log(cart);
                //תריץ מתודה שמסירה את המוצרים במערך הזה
                cartItems.forEach(id => this.removeItem(id));

                //כל עוד יש ילדים בעגלה זה יסיר אותם אחד אחד עד הסוף
                while (cartContent.children.length>0) {
                    cartContent.removeChild(cartContent.children[0]);
                }
                this.hideCart();
            }

            removeItem(id){
                    //תחזיר לי את כל המוצרים שהאיידי שלהם לא זהה לאיידי שניתן בפונקציה
                cart = cart.filter(item => item.id !==id);
                    // תגיד את הערכים בעגלה למה שהתקבל
                this.setCartValues(cart);
                    //שמור את השינוי
                Storage.saveCart(cart);
                let button = this.getSingleButton(id);
                button.disabled = false;
                button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
            }

            cartLogic(){
                //clear cart button
                clearCartBtn.addEventListener("click", () => {
                    this.clearCart();
                });
                //cart functionality
                cartContent.addEventListener('click', event=>{
                    //אם מה שלחצתי עליו מכיל את הקלאס רימוב אייטם נמשיך עם הפונקציה
                    if(event.target.classList.contains('remove-item'))
                    {
                        let removeItem = event.target; //המוצר עם כפתור ההסרה
                        let id = removeItem.dataset.id; //האיידי של המוצר
                        //צריך לגשת לסבא של האלמנט כדי שנסיר את המוצר עם כל התת-דיבים שלו
                        cartContent.removeChild(removeItem.parentElement.parentElement);
                        this.removeItem(id);
                    }
                    
                    //מוסיף את הפונקציונליות של הקליקים על החצים
                    else if (event.target.classList.contains("fa-chevron-up")){
                        let addAmount = event.target;
                        let id = addAmount.dataset.id;
                        //שמור במשתנה את המוצר הנוכחי בעגלה
                        let tempItem = cart.find(item => item.id===id); 
                        tempItem.amount = tempItem.amount +1;
                        Storage.saveCart(cart); //שימוש בפונקציית שמירת עגלה
                        this.setCartValues(cart);
                        addAmount.nextElementSibling.innerText = tempItem.amount;
                    }

                    else if (event.target.classList.contains("fa-chevron-down")){
                        let lowerAmount = event.target;
                        let id = lowerAmount.dataset.id;
                        //שמור במשתנה את המוצר הנוכחי בעגלה
                        let tempItem = cart.find(item => item.id===id); 
                        tempItem.amount = tempItem.amount -1;
                        if(tempItem.amount > 0){
                        Storage.saveCart(cart); //שימוש בפונקציית שמירת עגלה
                        this.setCartValues(cart);
                        lowerAmount.previousElementSibling.innerText = tempItem.amount;}
                        else{
                            Storage.saveCart(cart); //שימוש בפונקציית שמירת עגלה
                        this.setCartValues(cart);
                                                    cartContent.removeChild(lowerAmount.parentElement.parentElement);

                        }
                    }
                });
            }
            getSingleButton(id){
                return buttonsDOM.find(button => button.dataset.id === id);
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

    //האם המוצר קיים או לא
    //אם קיים באחסון המקומי, תביא לי אותו משם, אם לא אז תחזיר מערך ריק
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products();

// setup app
ui.setupAPP();

    //get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });

})

