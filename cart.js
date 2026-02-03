// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count on page load
updateCartCount();
renderCart();

// Function to add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            tag: product.tag,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Function to update quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = parseInt(newQuantity);
            saveCart();
            renderCart();
            updateCartCount();
        }
    }
}

// Function to remove item from cart
function removeFromCart(productId) {
    const item = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    
    saveCart();
    renderCart();
    updateCartCount();
    
    if (item) {
        showNotification(`${item.name} removed from cart`);
    }
}

// Function to clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        showNotification('Cart cleared');
    }
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Function to render cart items
function renderCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const recommendedSection = document.getElementById('recommendedSection');
    
    if (!cartItems) return; // Exit if not on cart page
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartItems.classList.remove('active');
        cartSummary.classList.remove('active');
        recommendedSection.classList.remove('active');
        return;
    }
    
    emptyCart.classList.add('hidden');
    cartItems.classList.add('active');
    cartSummary.classList.add('active');
    recommendedSection.classList.add('active');
    
    // Render cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                ${item.tag ? `<span class="cart-item-tag">${item.tag}</span>` : ''}
                <div class="cart-item-price">₹${item.price}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           min="1" max="99" onchange="updateQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryCharge = subtotal > 500 ? 0 : 30;
    const total = subtotal + deliveryCharge;
    
    // Update summary
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('totalAmount').textContent = total.toFixed(2);
    
    const deliveryChargeEl = document.getElementById('deliveryCharge');
    const deliveryMessage = document.getElementById('deliveryMessage');
    
    if (deliveryCharge === 0) {
        deliveryChargeEl.textContent = 'FREE';
        deliveryChargeEl.classList.add('free');
        deliveryMessage.innerHTML = '<i class="fas fa-check-circle"></i> Free delivery within 3km radius';
    } else {
        deliveryChargeEl.textContent = `₹${deliveryCharge}`;
        deliveryChargeEl.classList.remove('free');
        deliveryMessage.innerHTML = '<i class="fas fa-info-circle"></i> Add ₹' + (500 - subtotal).toFixed(2) + ' more for free delivery';
    }
    
    // Render recommended products
    renderRecommendedProducts();
}

// Function to render recommended products
function renderRecommendedProducts() {
    const recommendedProducts = document.getElementById('recommendedProducts');
    if (!recommendedProducts) return;
    
    // Get products not in cart
    const recommended = products.filter(p => !cart.find(item => item.id === p.id)).slice(0, 4);
    
    recommendedProducts.innerHTML = recommended.map((product, index) => `
        <div class="product-card" style="--i: ${index}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ₹${product.price}
                    ${product.originalPrice ? `<span class="original">₹${product.originalPrice}</span>` : ''}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Function to proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Here you would typically redirect to checkout page
    // For now, we'll show a confirmation
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = total > 500 ? 0 : 30;
    const finalTotal = total + deliveryCharge;
    
    alert(`Order Summary:\n\nTotal Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\nSubtotal: ₹${total.toFixed(2)}\nDelivery: ₹${deliveryCharge}\nTotal: ₹${finalTotal.toFixed(2)}\n\nProceeding to checkout...`);
    
    // You can redirect to checkout page or open a modal
    // window.location.href = 'checkout.html';
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('cartNotification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cartNotification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
async function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Get customer details (you can create a modal for this)
  const customerName = prompt('Enter your name:');
  const email = prompt('Enter your email:');
  const phone = prompt('Enter your phone number:');
  
  if (!customerName || !email || !phone) {
    alert('Please provide all details');
    return;
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = subtotal > 500 ? 0 : 30;
  const totalAmount = subtotal + deliveryCharge;
  
  const orderData = {
    customerName: customerName,
    email: email,
    phone: phone,
    cart: cart,
    totalAmount: totalAmount,
    deliveryCharge: deliveryCharge
  };
  
  const result = await submitOrder(orderData);
  
  if (result.status === 'success') {
    alert(`Order placed successfully!\nOrder ID: ${result.orderId}`);
    // Clear cart
    cart = [];
    saveCart();
    renderCart();
    updateCartCount();
  } else {
    alert('Error placing order: ' + result.message);
  }
}
