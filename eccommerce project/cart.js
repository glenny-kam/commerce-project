// Cart and Hamburger Menu Functionality
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

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    function addToCart(productName, price, imageSrc) {
        const item = {
            id: Date.now(),
            name: productName,
            price: price,
            image: imageSrc,
            quantity: 1
        };
        
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        
        // Show success message
        showNotification(`${productName} added to cart!`);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #0db4ac;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

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

    // Initialize cart display
    updateCartDisplay();
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 