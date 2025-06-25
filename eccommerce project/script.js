// Product Image Gallery
const mainPic = document.getElementById('Mainpic');
const smallImgs = document.querySelectorAll('.small-img');
smallImgs.forEach(img => {
  img.addEventListener('click', function() {
    mainPic.src = this.src;
    smallImgs.forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// Q&A Toggle
const qnaQuestions = document.querySelectorAll('.qna-question');
qnaQuestions.forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.parentElement;
    item.classList.toggle('active');
  });
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productName, price, imageSrc = null) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            image: imageSrc
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Show success message
    showNotification(`${productName} added to cart!`, 'success');
}

// Remove from cart function
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart!', 'info');
}

// Update quantity function
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-container');
    const cartCount = document.getElementById('cart-count');
    
    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Your cart is empty</p>';
        } else {
            let cartHTML = '<div class="cart-items">';
            cart.forEach((item, index) => {
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image || 'banners/logo.jpeg'}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price}</p>
                            <div class="quantity-controls">
                                <button onclick="updateQuantity(${index}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateQuantity(${index}, 1)">+</button>
                            </div>
                        </div>
                        <div class="cart-item-total">
                            <p>$${item.price * item.quantity}</p>
                            <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
                        </div>
                    </div>
                `;
            });
            cartHTML += `
                <div class="cart-total">
                    <h3>Total: $${calculateTotal()}</h3>
                    <button onclick="checkout()" class="checkout-btn">Checkout</button>
                    <button onclick="clearCart()" class="clear-cart-btn">Clear Cart</button>
                </div>
            </div>`;
            cartContainer.innerHTML = cartHTML;
        }
    }
    
    // Update cart count in header
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Cart cleared!', 'info');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Here you would typically redirect to a checkout page
    // For now, we'll show a success message
    showNotification('Proceeding to checkout...', 'success');
    
    // You can add actual checkout logic here
    // window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('#navbar');
    const closeMenu = document.querySelector('.close-menu');

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        closeMenu.classList.toggle('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    // Close menu when X button is clicked
    closeMenu.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        closeMenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close menu when clicking on a navigation link
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            closeMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside the menu
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && !closeMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                closeMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Initialize cart display
    updateCartDisplay();

    // Add event listeners to all order buttons
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Get the product image if available
            const productContainer = this.closest('.one, .two, .three, .four, .five, .six, .seven, .eight, .nine, .product1, .product2, .product3, .product4, .product5, .product6, .product7, .product8, .product9');
            let imageSrc = null;
            if (productContainer) {
                const img = productContainer.querySelector('img');
                if (img) {
                    imageSrc = img.src;
                }
            }
            
            addToCart(productName, price, imageSrc);
        });
    });
});
