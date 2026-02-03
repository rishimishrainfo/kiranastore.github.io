
        // Preloader
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hidden');
            }, 500);
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile Navigation
        function toggleMobileNav() {
            const mobileNav = document.getElementById('mobileNav');
            const overlay = document.getElementById('overlay');
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        // Products Data
        const products = [
            {
                id: 1,
                name: "Organic Basmati Rice",
                price: 120,
                originalPrice: 150,
                category: "groceries",
                image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Best Seller"
            },
            {
                id: 2,
                name: "Pure Cow Ghee",
                price: 450,
                originalPrice: 500,
                category: "groceries",
                image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Pure"
            },
            {
                id: 3,
                name: "Fresh Vegetables Box",
                price: 299,
                originalPrice: 350,
                category: "groceries",
                image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Fresh"
            },

            {
                id: 4,
                name: "Mixed Namkeen Pack",
                price: 180,
                originalPrice: 220,
                category: "snacks",
                image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.&auto=format&fit=crop&w=400&q=80",
                tag: "Popular"
                },{
                id: 5,
                name: "orted Biscuits",
                price: 240,
                originalPrice: 280,
                category: "snacks",
                image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Combo"
            },
            {
                id: 6,
                name: "Toor Dal Premium",
                price: 140,
                originalPrice: 160,
                category: "groceries",
                image: "https://imagessplash.com/photo-1610725664285-7c7761f73127?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Quality"
            },
            {
                id: 7,
                name: "Organic Honey",
                price: 280,
                originalPrice: 320,
                category: "groceries",
                image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Organic"
            },
            {
                id: 8,
                name: "Detergent Powder",
                price: 199,
                originalPrice: 240,
                category: "household",
                image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                tag: "Value Pack"
            }
        ];

        let cartCount = 0;

        // Render Products
        function renderProducts(filter = 'all') {
            const grid = document.getElementById('productsGrid');
            grid.innerHTML = '';
            
            const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
            
            filtered.forEach((product, index) => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.style.setProperty('--i', index);
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <span class="product-tag">${product.tag}</span>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            ₹${product.price}
                            <span class="original">₹${product.originalPrice}</span>
                        </div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                `;
                grid.appendChild(card);
                
                // Animate in
                setTimeout(() => {
                    card.classList.add('visible');
                }, 100 * index);
            });
        }

        function filterProducts(category) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if(btn.textContent.toLowerCase().includes(category) || (category === 'all' && btn.textContent === 'All')) {
                    btn.classList.add('active');
                }
            });
            renderProducts(category);
        }

        function addToCart(id) {
            cartCount++;
            document.getElementById('cartCount').textContent = cartCount;
            showNotification('Item added to cart!');
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            document.getElementById('notificationText').textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate stats counter
                    if (entry.target.classList.contains('stat-number')) {
                        animateCounter(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();
            
            document.querySelectorAll('.about-image, .about-content, .service-card, .product-card').forEach(el => {
                observer.observe(el);
            });
            
            document.querySelectorAll('.stat-number').forEach(el => {
                observer.observe(el);
            });
        });

        // Counter Animation
        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
                }
            }, 16);
        }

        // Testimonial Slider
        let currentIndex = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.slider-dot');

        function currentSlide(index) {
           Slide(index);
        }

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentIndex = index;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            
            slides[currentIndex].classList.add('active');
            dots[currentIndex].class.add('active');
        }

        // Auto slide
        setInterval(() => {
            currentIndex++;
            showSlide(currentIndex);
        }, 5000);

        // Contact Form Handler
        function handleContactSubmit(e) {
            e.preventDefault();
            const btn = e.target.querySelector('.submit-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                btn.style.background = '#28a745';
                showNotification('Message sent successfully!');
                e.target.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            }, 2000);
        }

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
 const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Modal functions
        function openModal(product) {
            const modal = document.getElementById('productModal');
            const modalBody = document.getElementById('modalBody');
            
            modalBody.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="modal-image">
                <h2>${product.name}</h2>
                <div class="product-price" style="font-size: 1.5rem; margin: 1rem 0;">
                    ₹${product.price} <span class="original">₹${product.originalPrice}</span>
                </div>
                <p style="color: #666; line-height: 1.8; margin-bottom: 1.5rem;">
                    Premium quality product sourced directly from trusted suppliers. 
                    Fresh stock guaranteed. Best before 6 months from packaging.
                </p>
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();" style="width: 100%;">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            document.getElementById('productModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Close modal on outside click
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') closeModal();
        });

        // Add this to your existing addToCart function in script.js
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    
    showNotification(`${product.name} added to cart!`);
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };
  
  // Show loading state
  const submitBtn = this.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  
  const result = await submitContactForm(formData);
  
  if (result.status === 'success') {
    alert(result.message);
    this.reset();
  } else {
    alert('Error: ' + result.message);
  }
  
  // Restore button
  submitBtn.innerHTML = originalText;
  submitBtn.disabled = false;
});
