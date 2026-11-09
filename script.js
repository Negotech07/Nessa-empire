
/* =========================================
   NESSA'S EMPIRE - SHARED SHOPPING CART
========================================= */

// Both pages MUST use this exact same storage key.
const CART_STORAGE_KEY = "nessaEmpireCart";
const WHATSAPP_NUMBER = "2347031137848";


/* =========================================
   LOAD CART FROM LOCAL STORAGE
========================================= */

function loadCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {
            return [];
        }

        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart
            .filter(item =>
                item &&
                typeof item.name === "string" &&
                Number.isFinite(Number(item.quantity)) &&
                Number(item.quantity) > 0
            )
            .map(item => ({
                name: item.name,
                image: item.image || "",
                quantity: Math.floor(Number(item.quantity))
            }));

    } catch (error) {
        console.error("Unable to load saved cart:", error);
        return [];
    }
}

let cart = loadCart();


/* =========================================
   SAVE CART TO LOCAL STORAGE
========================================= */

function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Unable to save cart:", error);
        alert("Your cart could not be saved. Please check your browser storage.");
    }
}


/* =========================================
   GET PAGE ELEMENTS
========================================= */

const cartIcon = document.getElementById("cartIcon");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkout = document.getElementById("checkout");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");


/* =========================================
   SIDEBAR
========================================= */

const aside = document.getElementById("aside");
const openBtn = document.getElementById("openbtn");
const closeBtn = document.getElementById("closebtn");
const background = document.querySelector(".bg");

function openAside() {
    if (!aside) return;

    aside.style.display = "block";
    aside.classList.add("slideIn");

    if (background) {
        background.style.display = "block";
    }
}

function closeAside() {
    if (!aside) return;

    aside.style.display = "none";
    aside.classList.remove("slideIn");

    if (background) {
        background.style.display = "none";
    }
}

if (openBtn) {
    openBtn.addEventListener("click", openAside);
}

if (closeBtn) {
    closeBtn.addEventListener("click", closeAside);
}

if (background) {
    background.addEventListener("click", closeAside);
}


/* =========================================
   OPEN AND CLOSE CART
========================================= */

function openCart() {
    if (cartPanel) {
        cartPanel.classList.add("active");
    }
}

function closeCartPanel() {
    if (cartPanel) {
        cartPanel.classList.remove("active");
    }
}

if (cartIcon) {
    cartIcon.addEventListener("click", openCart);
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartPanel);
}


/* =========================================
   ADD PRODUCT TO CART
========================================= */

function addToCart(name, image) {

    if (!name) return;

    // Check whether this product is already in the cart.
    const existingItem = cart.find(item =>
        item.name === name && item.image === image
    );

    if (existingItem) {

        // Increase quantity if it already exists.
        existingItem.quantity++;

    } else {

        // Otherwise add a new product.
        cart.push({
            name: name,
            image: image || "",
            quantity: 1
        });
    }

    // Save immediately.
    saveCart();

    // Update the cart display.
    updateCart();
}


/* =========================================
   ADD TO CART BUTTONS
========================================= */

document.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (!button) return;

    const productName = button.dataset.product;

    if (!productName) {
        console.warn("This add-to-cart button has no data-product attribute.");
        return;
    }

    // Find the product image by checking its parent containers.
    let parent = button.parentElement;
    let productImage = "";

    while (parent) {

        const imageElement = parent.querySelector("img");

        if (imageElement) {
            productImage = imageElement.getAttribute("src") || "";
            break;
        }

        // Stop searching once we reach the product grid.
        if (parent.id === "productGrid") {
            break;
        }

        parent = parent.parentElement;
    }

    addToCart(productName, productImage);

});


/* =========================================
   UPDATE CART DISPLAY
========================================= */

function updateCart() {

    // Calculate total quantity of all products.
    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Update cart number on both pages.
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (!cartItems) return;

    cartItems.innerHTML = "";

    // Display empty cart message.
    if (cart.length === 0) {

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Your cart is empty.";

        cartItems.appendChild(emptyMessage);

        return;
    }

    // Display every product.
    cart.forEach((item, index) => {

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        // Product image.
        if (item.image) {

            const image = document.createElement("img");

            image.src = item.image;
            image.alt = item.name;

            image.onerror = function() {
                this.style.display = "none";
            };

            cartItem.appendChild(image);
        }

        // Product details.
        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h4");
        name.textContent = item.name;

        // Quantity controls.
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";
        decreaseButton.dataset.action = "decrease";
        decreaseButton.dataset.index = index;

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.dataset.action = "increase";
        increaseButton.dataset.index = index;

        quantityControls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        // Remove button.
        const removeButton = document.createElement("button");

        removeButton.textContent = "Remove";
        removeButton.className = "remove-item";
        removeButton.dataset.action = "remove";
        removeButton.dataset.index = index;

        details.append(
            name,
            quantityControls,
            removeButton
        );

        cartItem.appendChild(details);

        cartItems.appendChild(cartItem);

    });

}


/* =========================================
   INCREASE, DECREASE AND REMOVE PRODUCTS
========================================= */

if (cartItems) {

    cartItems.addEventListener("click", function(event) {

        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (!Number.isInteger(index) || !cart[index]) return;

        // Increase quantity.
        if (action === "increase") {
            cart[index].quantity++;
        }

        // Decrease quantity.
        else if (action === "decrease") {

            cart[index].quantity--;

            // Remove if quantity reaches zero.
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        // Remove product completely.
        else if (action === "remove") {
            cart.splice(index, 1);
        }

        // Save changes and refresh display.
        saveCart();
        updateCart();

    });

}


/* =========================================
   CHECKOUT
========================================= */

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function() {

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        if (checkout) {
            checkout.classList.add("active");
        }

    });

}


// Close checkout.
if (closeCheckout) {

    closeCheckout.addEventListener("click", function() {
        checkout.classList.remove("active");
    });

}


// Close checkout when clicking outside the form.
if (checkout) {

    checkout.addEventListener("click", function(event) {

        if (event.target === checkout) {
            checkout.classList.remove("active");
        }

    });

}


/* =========================================
   WHATSAPP ORDER
========================================= */

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const name = customerName.value.trim();
        const phone = customerPhone.value.trim();

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        // Build WhatsApp message.
        let message = "Hello Nessa's Empire! I want to place an order.\n\n";

        message += "CUSTOMER DETAILS\n";
        message += "Name: " + name + "\n";
        message += "Phone: " + phone + "\n\n";

        message += "ORDER DETAILS\n";

        cart.forEach((item, index) => {

            message +=
                (index + 1) + ". " +
                item.name +
                " - Quantity: " +
                item.quantity +
                "\n";

        });

        message += "\nPlease let me know the total price and delivery details.";

        const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank");

        // The cart is deliberately NOT cleared here.
        // It stays saved until the customer removes the items.

    });

}


/* =========================================
   HAIR PAGE SEARCH AND SORT
========================================= */

const productGrid = document.getElementById("productGrid");
const searchHair = document.getElementById("searchHair");
const sortHair = document.getElementById("sortHair");
const noResults = document.getElementById("noResults");

function filterProducts() {

    if (!productGrid) return;

    const products = Array.from(productGrid.children);

    const searchValue = searchHair
        ? searchHair.value.toLowerCase().trim()
        : "";

    let visibleProducts = 0;

    // Search products.
    products.forEach(product => {

        const productName = product.textContent.toLowerCase();

        const matches = productName.includes(searchValue);

        product.style.display = matches ? "" : "none";

        if (matches) {
            visibleProducts++;
        }

    });

    // Sort products alphabetically.
    if (sortHair && sortHair.value === "name") {

        const sortedProducts = [...products].sort((a, b) => {

            return a.textContent.trim().localeCompare(
                b.textContent.trim()
            );

        });

        sortedProducts.forEach(product => {
            productGrid.appendChild(product);
        });

    }

    // Show or hide no-results message.
    if (noResults) {

        noResults.style.display =
            visibleProducts === 0 ? "block" : "none";

    }

}

if (searchHair) {
    searchHair.addEventListener("input", filterProducts);
}

if (sortHair) {
    sortHair.addEventListener("change", filterProducts);
}


/* =========================================
   SYNC CART BETWEEN OPEN BROWSER TABS
========================================= */

// If the cart changes in another tab, update this page too.
window.addEventListener("storage", function(event) {

    if (event.key === CART_STORAGE_KEY) {

        cart = loadCart();

        updateCart();

    }

});


/* =========================================
   INITIALIZE CART ON EVERY PAGE LOAD
========================================= */

// This loads the saved cart whenever either page opens.
updateCart();

const year = new Date().getFullYear();
// console.log(year);
let mydate = document.querySelector('.dates')
mydate.innerHTML = year