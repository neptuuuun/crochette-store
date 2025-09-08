// Product prices configuration
const productPrices = {
    'bag': 2500,
    'top': 3000,
    'both': 5000,
    'tools-kit': 3100
};

// Page type handlers
const pageHandlers = {
    'bag-top-set': {
        init: function() {
            const bagColorGroup = document.getElementById('bagColorGroup');
            const topColorGroup = document.getElementById('topColorGroup');
            const discountMessage = document.getElementById('discountMessage');
            const orderItems = document.querySelectorAll('input[name="orderItems"]');
            
            // Initially hide color inputs
            bagColorGroup.style.display = 'none';
            topColorGroup.style.display = 'none';
            discountMessage.style.display = 'none';
            
            // Handle order items selection
            orderItems.forEach(item => {
                item.addEventListener('change', function() {
                    // If "Both" is selected, uncheck other checkboxes
                    if (this.id === 'bothItems' && this.checked) {
                        document.querySelectorAll('input[name="orderItems"]').forEach(box => {
                            if (box.id !== 'bothItems') box.checked = false;
                        });
                        bagColorGroup.style.display = 'block';
                        topColorGroup.style.display = 'block';
                        discountMessage.style.display = 'block';
                    } else if (this.checked) {
                        // If any other checkbox is checked, uncheck "Both"
                        const bothCheckbox = document.getElementById('bothItems');
                        if (bothCheckbox) bothCheckbox.checked = false;
                        
                        // Show/hide color inputs based on selection
                        if (this.value === 'bag') {
                            bagColorGroup.style.display = 'block';
                            topColorGroup.style.display = 'none';
                        } else if (this.value === 'top') {
                            bagColorGroup.style.display = 'none';
                            topColorGroup.style.display = 'block';
                        }
                        discountMessage.style.display = 'none';
                    } else {
                        // Hide color inputs if nothing is selected
                        if (!Array.from(orderItems).some(box => box.checked)) {
                            bagColorGroup.style.display = 'none';
                            topColorGroup.style.display = 'none';
                            discountMessage.style.display = 'none';
                        }
                    }
                    updateOrderSummary();
                });
            });
        },
        
        getSelectedProducts: function() {
            const selectedItems = [];
            const checkboxes = document.querySelectorAll('input[name="orderItems"]:checked');
            
            checkboxes.forEach(checkbox => {
                if (checkbox.value === 'both') {
                    selectedItems.push('bag', 'top');
                } else {
                    selectedItems.push(checkbox.value);
                }
            });
            
            return selectedItems;
        },
        
        validateForm: function() {
            const selectedItems = document.querySelectorAll('input[name="orderItems"]:checked');
            if (selectedItems.length === 0) {
                alert('Veuillez sélectionner au moins un article');
                return false;
            }
            return true;
        }
    },
    
    'tools-kit': {
        init: function() {
            // Ensure the checkbox is checked by default for tools kit
            const checkbox = document.querySelector('input[name="orderItems"]');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.disabled = true; // Prevent unchecking
            }
        },
        
        getSelectedProducts: function() {
            return ['tools-kit'];
        },
        
        validateForm: function() {
            return true; // Always valid since it's pre-checked and disabled
        }
    }
};

// Initialize the page based on the product type
function initializePage() {
    const pageType = document.body.dataset.product;
    const handler = pageHandlers[pageType];
    
    if (handler) {
        handler.init();
        setupForm(handler);
    }
}

// Setup form validation and submission
function setupForm(handler) {
    const form = document.getElementById('crochetOrderForm');
    if (!form) return;
    
    // Set minimum date for delivery date input
    const deliveryDate = document.getElementById('deliveryDate');
    if (deliveryDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        deliveryDate.min = minDate;
    }

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form using the specific handler
        if (!handler.validateForm()) {
            return;
        }
        
        // Basic form validation
        const instagramInput = document.getElementById('instagram');
        if (!instagramInput.value.trim()) {
            alert('Veuillez entrer votre nom d\'utilisateur Instagram');
            instagramInput.focus();
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Envoi en cours...';

        try {
            // Get selected products from the handler
            const selectedProducts = handler.getSelectedProducts();
            const productNames = selectedProducts.map(product => {
                const names = {
                    'bag': 'Sac',
                    'top': 'Crop Top',
                    'tools-kit': 'Kit d\'outils de crochet'
                };
                return names[product] || product;
            });
            
            // Calculate total price including delivery
            const subtotal = selectedProducts.reduce((sum, product) => sum + (productPrices[product] || 0), 0);
            const deliveryPrice = parseFloat(document.getElementById('deliveryPriceValue')?.value) || 0;
            const totalPrice = subtotal + deliveryPrice;
            
            // Prepare form data
            const formData = new FormData(form);
            formData.set('order_items', productNames.join(', '));
            formData.set('total_price', totalPrice.toString());
            
            // Add delivery method in a readable format
            const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked');
            if (deliveryMethod) {
                formData.set('delivery_method_text', deliveryMethod.value === 'home' ? 'À domicile' : 'Au bureau');
            }
            
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Show success message
                form.innerHTML = `
                    <div class="success-message">
                        <h3>Merci ! 🎉</h3>
                        <p>Votre commande a été envoyée. Nous allons vous contacter sur Instagram bientôt.</p>
                        <p>📦 Livraison disponible partout en Algérie</p>
                        <p>Suivez-nous sur <a href="https://www.instagram.com/crochette.store" target="_blank" class="instagram-link">@crochette.store</a> pour les mises à jour !</p>
                    </div>
                `;
            } else {
                throw new Error('Erreur lors de l\'envoi du formulaire');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Désolé, une erreur s\'est produite. Veuillez réessayer ou nous contacter directement sur Instagram.');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
    
    // Update order summary when form changes
    form.addEventListener('change', function() {
        updateOrderSummary();
    });
    
    // Initial order summary update
    updateOrderSummary();
}

// Note: Wilaya data is now imported from wilaya-data.js

// Update order summary - unified function
function updateOrderSummary() {
    const summaryElement = document.getElementById('orderItemsSummary');
    const deliveryCostElement = document.getElementById('deliveryCostSummary');
    const totalElement = document.getElementById('orderTotal');
    const totalInput = document.getElementById('orderTotalValue');
    
    if (!summaryElement) return;
    
    // Get current page handler
    const pageType = document.body.dataset.product;
    const handler = pageHandlers[pageType];
    
    if (!handler) return;
    
    // Get selected products
    const selectedProducts = handler.getSelectedProducts();
    const deliveryPrice = parseFloat(document.getElementById('deliveryPriceValue')?.value) || 0;
    
    // Calculate subtotal
    let subtotal = 0;
    let summaryHTML = '';
    
    if (selectedProducts.includes('bag') && selectedProducts.includes('top')) {
        // Both items selected (discount case)
        subtotal = productPrices.both;
        summaryHTML = `
            <div class="summary-item">
                <span>Sac:</span>
                <span>${productPrices.bag} DA</span>
            </div>
            <div class="summary-item">
                <span>Crop Top:</span>
                <span>${productPrices.top} DA</span>
            </div>
            <div class="summary-item" style="color: #b47b84; font-weight: bold;">
                <span>Réduction ensemble:</span>
                <span>-${(productPrices.bag + productPrices.top - productPrices.both)} DA</span>
            </div>
        `;
    } else {
        // Individual items
        selectedProducts.forEach(product => {
            const price = productPrices[product] || 0;
            subtotal += price;
            
            const productNames = {
                'bag': 'Sac',
                'top': 'Crop Top',
                'tools-kit': 'Kit d\'outils de crochet'
            };
            
            summaryHTML += `
                <div class="summary-item">
                    <span>${productNames[product] || product}:</span>
                    <span>${price} DA</span>
                </div>
            `;
        });
    }
    
    // Update summary elements
    summaryElement.innerHTML = summaryHTML || '<div class="summary-item">Aucun article sélectionné</div>';
    
    if (deliveryCostElement) {
        deliveryCostElement.textContent = `${deliveryPrice} DA`;
    }
    
    // Calculate and update total
    const total = subtotal + deliveryPrice;
    if (totalElement) {
        totalElement.textContent = `${total} DA`;
    }
    if (totalInput) {
        totalInput.value = total;
    }
}

// Initialize mobile menu
function initMobileMenu() {
  // try both selectors (id preferred)
  const mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-menu-btn');
  const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');

  if (!mobileMenuBtn || !navMenu) return; // nothing to do if missing

  // remove any inline onclick reference (prevent double-binding)
  mobileMenuBtn.onclick = null;

  // ensure we don't add multiple identical listeners if initMobileMenu runs twice
  if (!mobileMenuBtn._menuInitialized) {
    mobileMenuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });

    // close menu when any nav link is clicked (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      });
    });

    // close when clicking outside
    document.addEventListener('click', (ev) => {
      if (!navMenu.contains(ev.target) && !mobileMenuBtn.contains(ev.target)) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
      }
    });

    mobileMenuBtn._menuInitialized = true;
  }
}


// Initialize product gallery functionality
function initProductGallery() {
    const images = document.querySelectorAll('.product-image');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.gallery-nav-btn.prev');
    const nextBtn = document.querySelector('.gallery-nav-btn.next');
    let currentIndex = 0;

    if (images.length === 0) return;

    // Show initial image
    showImage(currentIndex);

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    // Navigation buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });
    }

    // Auto-advance gallery
    let slideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }, 5000);

    // Pause auto-advance on hover
    const gallery = document.querySelector('.product-gallery');
    if (gallery) {
        gallery.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        gallery.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                showImage(currentIndex);
            }, 5000);
        });
    }

    function showImage(index) {
        // Hide all images
        images.forEach(img => img.classList.remove('active'));
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show selected image
        if (images[index]) {
            images[index].classList.add('active');
        }
        // Update active dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }
}

// Populate wilayas dropdown and set up event listeners
function populateWilayas() {
    const wilayaSelect = document.getElementById('wilaya');
    const communeSelect = document.getElementById('commune');
    const communeGroup = document.getElementById('communeGroup');
    const deliveryTypeGroup = document.getElementById('deliveryTypeGroup');
    
    if (!wilayaSelect) return;
    
    // Clear and populate wilayas using wilayaData from wilaya-data.js
    wilayaSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre wilaya</option>';
    
    wilayaData.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya.id;
        option.dataset.homePrice = wilaya.home;
        option.dataset.stopdeskPrice = wilaya.stopdesk || 0;
        option.textContent = wilaya.name;
        wilayaSelect.appendChild(option);
    });
    
    // Handle wilaya selection change
    wilayaSelect.addEventListener('change', function() {
        const selectedWilayaId = this.value;
        const selectedWilaya = wilayaData.find(w => w.id == selectedWilayaId);
        
        if (selectedWilaya) {
            // Update delivery price displays
            const homePrice = document.getElementById('homeDeliveryPrice');
            const stopdeskPrice = document.getElementById('stopDeskPrice');
            
            if (homePrice) homePrice.textContent = `${selectedWilaya.home} DA`;
            if (stopdeskPrice) stopdeskPrice.textContent = `${selectedWilaya.stopdesk || 0} DA`;
            
            // Show commune group if communes exist
            if (communeSelect && communeGroup) {
                communeGroup.style.display = 'block';
                communeSelect.disabled = false;
                communeSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre commune</option>';
                
                if (selectedWilaya.communes) {
                    selectedWilaya.communes.forEach(commune => {
                        const option = document.createElement('option');
                        option.value = commune;
                        option.textContent = commune;
                        communeSelect.appendChild(option);
                    });
                }
            }
            
            // Show delivery type options
            if (deliveryTypeGroup) {
                deliveryTypeGroup.style.display = 'block';
            }
            
            // Set up delivery method radio buttons with prices
            const homeRadio = document.querySelector('input[value="home"]');
            const officeRadio = document.querySelector('input[value="office"]');
            
            if (homeRadio) homeRadio.dataset.price = selectedWilaya.home;
            if (officeRadio) officeRadio.dataset.price = selectedWilaya.stopdesk || 0;
            
            // Clear previous selections
            document.querySelectorAll('input[name="delivery_method"]').forEach(radio => {
                radio.checked = false;
            });
            
            // Reset delivery price
            const deliveryPriceInput = document.getElementById('deliveryPriceValue');
            if (deliveryPriceInput) deliveryPriceInput.value = '0';
            
            updateOrderSummary();
        }
    });
    
    // Handle commune selection
    if (communeSelect) {
        communeSelect.addEventListener('change', function() {
            // Enable delivery method selection after commune is selected
            document.querySelectorAll('input[name="delivery_method"]').forEach(input => {
                input.disabled = !this.value;
            });
        });
    }
    
    // Handle delivery method selection
    document.querySelectorAll('input[name="delivery_method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const price = parseInt(this.dataset.price) || 0;
                const deliveryPriceInput = document.getElementById('deliveryPriceValue');
                if (deliveryPriceInput) {
                    deliveryPriceInput.value = price.toString();
                }
                updateOrderSummary();
            }
        });
    });
}

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('components/header.html')
    .then(r => r.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
        initMobileMenu(); // <-- important: init AFTER insertion
    })
    .catch(err => console.error('Header load failed:', err));

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer').innerHTML = html;
            const yearElement = document.getElementById('currentYear');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        })
        .catch(error => console.log('Footer loading failed:', error));

    // Initialize the page
    initializePage();
    
    // Initialize other components
    populateWilayas();
    initProductGallery();
    
    // Scroll to form when Order Now button is clicked
    const orderNowBtn = document.getElementById('orderNowBtn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const orderForm = document.getElementById('orderForm');
            if (orderForm) {
                orderForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Smooth scrolling
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

// Function to show shop (can be used to navigate to shop page)
function showShop() {
    document.querySelector('#shop').scrollIntoView({
        behavior: 'smooth'
    });
}