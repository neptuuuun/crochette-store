// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
            initMobileMenu();
        });

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer').innerHTML = html;
            document.getElementById('currentYear').textContent = new Date().getFullYear();
        });

    // Form handling
    const orderForm = document.getElementById('crochetOrderForm');
    if (orderForm) {
        setupForm();
    }

    // Set minimum date for delivery date input
    const deliveryDate = document.getElementById('deliveryDate');
    if (deliveryDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        deliveryDate.min = minDate;
    }

    // Scroll to form when Order Now button is clicked
    const orderNowBtn = document.getElementById('orderNowBtn');
    if (orderNowBtn) {
        orderNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Populate wilayas dropdown
    populateWilayas();
});

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Setup form validation and dynamic fields
function setupForm() {
    const form = document.getElementById('crochetOrderForm');
    const orderItems = document.querySelectorAll('input[name="orderItems"]');
    const bagColorGroup = document.getElementById('bagColorGroup');
    const topColorGroup = document.getElementById('topColorGroup');
    const discountMessage = document.getElementById('discountMessage');

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
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
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
            // Send form data to Formspree
            const formData = new FormData(form);
            
            // Add selected products to form data
            const orderItems = [];
            document.querySelectorAll('input[name="orderItems"]:checked').forEach(item => {
                const itemName = item.value === 'bag' ? 'Sac' : 
                               item.value === 'cropTop' ? 'Crop Top' : 'Ensemble (Sac + Crop Top)';
                orderItems.push(itemName);
            });
            formData.set('order_items', orderItems.join(', '));
            
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
}

// Wilayas data with delivery prices and sample communes
const wilayasData = [
    { 
        id: 1, 
        name: 'Adrar', 
        home: 1100, 
        stopdesk: 600,
        communes: ['Adrar']
    },
    { 
        id: 2, 
        name: 'Chlef', 
        home: 700, 
        stopdesk: 400,
        communes: ['Chlef']
    },
    {
        id: 3, 
        name: 'Laghouat', 
        home: 900, 
        stopdesk: 500,
        communes: ['Laghouat']
    },
    {
        id: 4, 
        name: 'Oum El Bouaghi', 
        home: 700, 
        stopdesk: 500,
        communes: ['Ain Fekroune']
    },
    {
        id: 5, 
        name: 'Batna', 
        home: 600,  
        stopdesk: 400,
        communes: ['Batna']
    },
    {
        id: 6, 
        name: 'Bejaia', 
        home: 600,  
        stopdesk: 400,
        communes: ['Bejaia']
    },
    {
        id: 7, 
        name: 'Biskra', 
        home: 800,  
        stopdesk: 500,
        communes: ['Biskra']
    },
    {
        id: 8, 
        name: 'Bechar', 
        home: 1100,  
        stopdesk: 600,
        communes: ['Bechar']
    },
    {
        id: 9, 
        name: 'Blida', 
        home: 500,  
        stopdesk: 400,
        communes: ['Beni Mered', 'Boufarik', 'Ouled Yaich']
    },
    {
        id: 10, 
        name: 'Bouira', 
        home: 700,  
        stopdesk: 400,
        communes: ['Bouira']
    },
    {
        id: 11, 
        name: 'Tamanrasset', 
        home: 1300,  
        stopdesk: 800,
        communes: ['Tamanrasset']
    },
    {
        id: 12, 
        name: 'Tebessa', 
        home: 800,  
        stopdesk: 400,
        communes: ['Tebessa']
    },
    {
        id: 13, 
        name: 'Tlemcen', 
        home: 800,  
        stopdesk: 400,
        communes: ['Sebdou', 'Tlemcen']
    },
    {
        id: 14, 
        name: 'Tiaret', 
        home: 800,  
        stopdesk: 400,
        communes: ['Ksar Chellala', 'Tiaret']
    },
    {
        id: 15, 
        name: 'Tizi Ouzou', 
        home: 700,  
        stopdesk: 400,
        communes: ['Tizi Ouzou']
    },
    { 
        id: 16, 
        name: 'Alger', 
        home: 500, 
        stopdesk: 350,
        communes: ['Bab El Oued', 'Bab Ezzouar', 'Bir Touta', 'Birkhadem', 'cheraga', 'Reghaia']
    },
    {
        id: 17, 
        name: 'Djelfa', 
        home: 900,  
        stopdesk: 500,
        communes: ['Ain Oussera', 'Djelfa']
    },
    {
        id: 18, 
        name: 'Jijel', 
        home: 600,  
        stopdesk: 400,
        communes: ['Jijel']
    },
        { 
        id: 19, 
        name: 'Sétif', 
        home: 400, 
        stopdesk: 250,
        communes: ['Sétif', 'El Eulma']
    },
    {
        id: 20, 
        name: 'Saida', 
        home: 800,  
        stopdesk: 400,
        communes: ['Saida']
    },
    {
        id: 21, 
        name: 'Skikda', 
        home: 650,  
        stopdesk: 400,
        communes: ['Skikda']
    },
    {
        id: 22, 
        name: 'Sidi Bel Abbes', 
        home: 800,  
        stopdesk: 400,
        communes: ['Sidi Bel Abbes']
    },
    {
        id: 23, 
        name: 'Annaba', 
        home: 700,  
        stopdesk: 400,
        communes: ['Annaba']
    },
    {
        id: 24, 
        name: 'Guelma', 
        home: 700,  
        stopdesk: 400,
        communes: ['Guelma']
    },
    { 
        id: 25, 
        name: 'Constantine', 
        home: 600, 
        stopdesk: 400,
        communes: ['Constantine']
    },
    {
        id: 26, 
        name: 'Medea', 
        home: 700,  
        stopdesk: 400,
        communes: ['Medea']
    },
    {
        id: 27, 
        name: 'Mostaganem', 
        home: 700,  
        stopdesk: 400,
        communes: ['Mostaganem']
    },
    {
        id: 28, 
        name: 'Msila', 
        home: 700,  
        stopdesk: 400,
        communes: ['Msila, Bou Saada']
    },
    {
        id: 29, 
        name: 'Mascara', 
        home: 700,  
        stopdesk: 400,
        communes: ['Mascara']
    },
    {
        id: 30, 
        name: 'Ouargla', 
        home: 1000,  
        stopdesk: 500,
        communes: ['Ouargla']
    },
    { 
        id: 31, 
        name: 'Oran', 
        home: 700, 
        stopdesk: 400,
        communes: ['Oran', 'Bir El Djir']
    },
    {
        id: 32, 
        name: 'El Bayadh', 
        home: 1000,  
        stopdesk: 500,
        communes: ['El Bayadh']
    },
    {
        id: 33, 
        name: 'Illizi', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Illizi']
    },
    {
        id: 34, 
        name: 'Bordj Bou Arreridj', 
        home: 600,  
        stopdesk: 400,
        communes: ['Bordj Bou Arreridj']
    },
    {
        id: 35, 
        name: 'Boumerdes', 
        home: 700,  
        stopdesk: 400,
        communes: ['Boumerdes']
    },
    {
        id: 36, 
        name: 'El Tarf', 
        home: 700,  
        stopdesk: 400,
        communes: ['El Tarf']
    },
    {
        id: 37, 
        name: 'Tindouf', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Tindouf']
    },
    {
        id: 38, 
        name: 'Tissemsilt', 
        home: 800,  
        stopdesk: 400,
        communes: ['Tissemsilt']
    },
    {
        id: 39, 
        name: 'El Oued', 
        home: 900,  
        stopdesk: 500,
        communes: ['El Oued']
    },
    {
        id: 40, 
        name: 'Khenchela', 
        home: 700,  
        stopdesk: 500,
        communes: ['Khenchela']
    },
    {
        id: 41, 
        name: 'Souk Ahras', 
        home: 800,  
        stopdesk: 500,
        communes: ['Souk Ahras']
    },
    {
        id: 42, 
        name: 'Tipaza', 
        home: 700,  
        stopdesk: 400,
        communes: ['Kolea', 'Tipaza']
    },
    {
        id: 43, 
        name: 'Mila', 
        home: 600,  
        stopdesk: 400,
        communes: ['Mila']
    },
    {
        id: 44, 
        name: 'Aïn Defla', 
        home: 700,  
        stopdesk: 400,
        communes: ['Aïn Defla, Khemis Miliana']
    },
    {
        id: 45, 
        name: 'Naâma', 
        home: 1000,  
        stopdesk: 500,
        communes: ['Mecheria']
    },
    {
        id: 46, 
        name: 'Aïn Témouchent', 
        home: 800,  
        stopdesk: 400,
        communes: ['Aïn Témouchent']
    },
    {
        id: 47, 
        name: 'Ghardaïa', 
        home: 900,  
        stopdesk: 500,
        communes: ['Bordj Bou Arreridj']
    },
    {
        id: 48, 
        name: 'Relizane', 
        home: 700,  
        stopdesk: 400,
        communes: ['Relizane']
    },
    {
        id: 49, 
        name: 'Timimoun', 
        home: 1300,  
        stopdesk: 600,
        communes: ['Timimoun']
    },
    {
        id: 51, 
        name: 'Ouled Djellal', 
        home: 900,  
        stopdesk: 500,
        communes: ['Ouled Djellal']
    },
    {
        id: 52, 
        name: 'Beni Abbes', 
        home: 1300,  
        stopdesk: null,
        communes: null
    },
    {
        id: 53, 
        name: 'In Salah', 
        home: 1300,  
        stopdesk: 600,
        communes: ['In Salah']
    },
    {
        id: 55, 
        name: 'Touggourt', 
        home: 900,  
        stopdesk: 500,
        communes: ['Touggourt']
    },
    {
        id: 57, 
        name: 'El MGhair', 
        home: 900,  
        stopdesk: null,
        communes: null
    },
    {
        id: 58, 
        name: 'El Meniaa', 
        home: 1000,  
        stopdesk: 500,
        communes: ['El Meniaa']
    },
];

// Initialize delivery form
function initDeliveryForm() {
    const wilayaSelect = document.getElementById('wilaya');
    const deliveryTypeGroup = document.getElementById('deliveryTypeGroup');
    const homeDeliveryRadio = document.querySelector('input[value="home"]');
    const officeDeliveryRadio = document.querySelector('input[value="office"]');
    
    // Populate wilayas dropdown
    if (wilayaSelect) {
        // Clear existing options
        wilayaSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre wilaya</option>';
        
        // Add wilayas to the dropdown
        wilayasData.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.dataset.homePrice = wilaya.home;
            option.dataset.stopdeskPrice = wilaya.stopdesk;
            option.textContent = wilaya.name;
            wilayaSelect.appendChild(option);
        });
        
        // Handle wilaya selection
        wilayaSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const homePrice = selectedOption.dataset.homePrice || '0';
            const stopdeskPrice = selectedOption.dataset.stopdeskPrice || '0';
            
            // Update delivery price displays
            document.getElementById('homeDeliveryPrice').textContent = `- ${homePrice} DA`;
            document.getElementById('stopDeskPrice').textContent = `- ${stopdeskPrice} DA`;
            
            // Update radio button data attributes
            if (homeDeliveryRadio) homeDeliveryRadio.dataset.price = homePrice;
            if (officeDeliveryRadio) officeDeliveryRadio.dataset.price = stopdeskPrice;
            
            // Show delivery type options if a wilaya is selected
            if (this.value) {
                deliveryTypeGroup.style.display = 'block';
                // Reset any previous selection
                if (homeDeliveryRadio) homeDeliveryRadio.checked = false;
                if (officeDeliveryRadio) officeDeliveryRadio.checked = false;
                resetDeliveryOptions();
            } else {
                deliveryTypeGroup.style.display = 'none';
                resetDeliveryOptions();
            }
        });
    }
    
    // Handle delivery method selection
    document.querySelectorAll('input[name="delivery_method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                updateDeliveryPrice(this.value);
            }
        });
    });
}

// Update delivery prices based on selected wilaya (kept for backward compatibility)
function updateDeliveryPrices() {
    const wilayaSelect = document.getElementById('wilaya');
    if (!wilayaSelect) return;
    
    const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
    if (!selectedOption) return;
    
    const homePrice = selectedOption.dataset.homePrice || '0';
    const stopdeskPrice = selectedOption.dataset.stopdeskPrice || '0';
    
    // Update price displays
    const homePriceEl = document.getElementById('homeDeliveryPrice');
    const stopDeskPriceEl = document.getElementById('stopDeskPrice');
    
    if (homePriceEl) homePriceEl.textContent = `- ${homePrice} DA`;
    if (stopDeskPriceEl) stopDeskPriceEl.textContent = `- ${stopdeskPrice} DA`;
    
    // Update radio button data attributes
    const homeDeliveryRadio = document.querySelector('input[value="home"]');
    const officeDeliveryRadio = document.querySelector('input[value="office"]');
    
    if (homeDeliveryRadio) homeDeliveryRadio.dataset.price = homePrice;
    if (officeDeliveryRadio) officeDeliveryRadio.dataset.price = stopdeskPrice;
}

// Update the selected delivery price
function updateDeliveryPrice(deliveryType) {
    const priceInput = document.getElementById('deliveryPriceValue');
    if (!priceInput) return;
    
    const radio = document.querySelector(`input[value="${deliveryType}"]`);
    if (!radio) return;
    
    const price = radio.dataset.price || '0';
    priceInput.value = price;
    
    // Update order summary
    updateOrderSummary(parseInt(price) || 0);
}

// Reset delivery options
function resetDeliveryOptions() {
    const priceInput = document.getElementById('deliveryPriceValue');
    if (priceInput) {
        priceInput.value = '0';
    }
    
    // Uncheck all delivery method radio buttons but don't reset the order summary
    document.querySelectorAll('input[name="delivery_method"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Only update the delivery cost in the summary, not the entire order
    const deliveryCostSummary = document.getElementById('deliveryCostSummary');
    if (deliveryCostSummary) {
        deliveryCostSummary.textContent = '0 DA';
    }
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initDeliveryForm();
    populateWilayas();
    setupProductSelection();
    setupForm();
    initMobileMenu();
    initProductGallery();
});

// Initialize product gallery functionality
function initProductGallery() {
    const images = document.querySelectorAll('.product-image');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.gallery-nav-btn.prev');
    const nextBtn = document.querySelector('.gallery-nav-btn.next');
    let currentIndex = 0;

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
        images[index].classList.add('active');
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
    
    if (wilayaSelect) {
        // Remove the default disabled option
        wilayaSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre wilaya</option>';
        
        // Add wilayas to the dropdown
        wilayasData.forEach(wilaya => {
            const option = document.createElement('option');
            option.value = wilaya.name;
            option.dataset.homePrice = wilaya.home;
            option.dataset.stopdeskPrice = wilaya.stopdesk;
            option.textContent = wilaya.name;
            wilayaSelect.appendChild(option);
        });
        
        // Handle wilaya selection change
        wilayaSelect.addEventListener('change', function() {
            const selectedWilayaName = this.value;
            const selectedWilaya = wilayasData.find(w => w.name === selectedWilayaName);
            
            // Reset and hide dependent fields
            resetDeliveryOptions();
            
            if (selectedWilaya) {
                // Show commune group
                communeGroup.style.display = 'block';
                communeSelect.disabled = false;
                
                // Populate communes
                communeSelect.innerHTML = '<option value="" disabled selected>Sélectionnez votre commune</option>';
                if (selectedWilaya.communes && selectedWilaya.communes.length > 0) {
                    selectedWilaya.communes.forEach(commune => {
                        const option = document.createElement('option');
                        option.value = commune;
                        option.textContent = commune;
                        communeSelect.appendChild(option);
                    });
                }
                
                // Show delivery type options
                deliveryTypeGroup.style.display = 'block';
                
                // Update delivery prices
                updateDeliveryPrices(selectedWilaya.home, selectedWilaya.stopdesk);
            } else {
                communeGroup.style.display = 'none';
                communeSelect.disabled = true;
                deliveryTypeGroup.style.display = 'none';
            }
        });
        
        // Handle commune selection
        communeSelect.addEventListener('change', function() {
            // Enable/disable delivery options based on commune selection
            const deliveryMethodInputs = document.querySelectorAll('input[name="delivery_method"]');
            deliveryMethodInputs.forEach(input => {
                input.disabled = !this.value;
            });
        });
    }
}

// Update delivery prices in the UI
function updateDeliveryPrices(homePrice, stopdeskPrice) {
    const homePriceElement = document.getElementById('homeDeliveryPrice');
    const stopdeskPriceElement = document.getElementById('stopDeskPrice');
    
    if (homePriceElement) homePriceElement.textContent = `${homePrice} DA`;
    if (stopdeskPriceElement) stopdeskPriceElement.textContent = `${stopdeskPrice} DA`;
    
    // Set data attributes on radio inputs for price calculation
    const homeRadio = document.querySelector('input[value="home"]');
    const stopdeskRadio = document.querySelector('input[value="office"]');
    
    if (homeRadio) homeRadio.dataset.price = homePrice;
    if (stopdeskRadio) stopdeskRadio.dataset.price = stopdeskPrice;
}

// Product prices
const productPrices = {
    'bag': 2500,
    'top': 3000,
    'both': 5000  // Updated to 5000 DA for the bundle
};

// Update delivery price based on selected wilaya and delivery method
function updateDeliveryPrice(event) {
    // If this was called from an event, prevent default behavior
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    const wilayaSelect = document.getElementById('wilaya');
    const deliveryPriceElement = document.getElementById('deliveryPrice');
    const deliveryPriceAmount = document.getElementById('deliveryPriceAmount');
    const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
    const deliveryMethod = document.querySelector('input[name="delivery_method"]:checked');
    
    // If we have a selected wilaya but no delivery method yet, just return early
    // This prevents clearing the order summary when just selecting a wilaya
    if (selectedOption.value && !deliveryMethod) {
        return;
    }
    
    if (selectedOption.value && deliveryMethod) {
        const isHomeDelivery = deliveryMethod.value === 'home';
        const price = isHomeDelivery ? 
            parseInt(selectedOption.dataset.homePrice) : 
            parseInt(selectedOption.dataset.stopdeskPrice);
            
        if (price > 0) {
            if (deliveryPriceAmount) {
                deliveryPriceAmount.textContent = price;
            }
            if (deliveryPriceElement) {
                deliveryPriceElement.style.display = 'block';
            }
            
            // Update the hidden input for form submission
            const deliveryPriceInput = document.getElementById('deliveryPriceValue');
            if (deliveryPriceInput) {
                deliveryPriceInput.value = price;
            }
            
            // Enable/disable submit button based on delivery availability
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
            }
        } else {
            if (deliveryPriceAmount) {
                deliveryPriceAmount.textContent = '0';
            }
            if (deliveryPriceElement) {
                deliveryPriceElement.textContent = 'Livraison non disponible pour cette wilaya';
                deliveryPriceElement.style.display = 'block';
            }
            
            // Disable submit button if delivery is not available
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
            }
        }
        
        // Update order summary with the new delivery price
        updateOrderSummary(price);
    } else {
        if (deliveryPriceElement) {
            deliveryPriceElement.style.display = 'none';
        }
        
        // Disable submit button if wilaya or delivery method is not selected
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }
    }
}

// Update order summary with selected items and total
function updateOrderSummary(deliveryPrice = 0) {
    const orderItemsSummary = document.getElementById('orderItemsSummary');
    const deliveryCostSummary = document.getElementById('deliveryCostSummary');
    const orderTotalElement = document.getElementById('orderTotal');
    
    // Get selected products
    const selectedProducts = [];
    document.querySelectorAll('input[name="orderItems"]:checked').forEach(checkbox => {
        selectedProducts.push(checkbox.value);
    });
    
    // Calculate subtotal
    let subtotal = 0;
    let itemsHtml = '';
    
    if (selectedProducts.includes('both')) {
        subtotal = productPrices.both;
        itemsHtml = `
            <div class="order-summary-item">
                <span>Sac</span>
                <span>${productPrices.bag} DA</span>
            </div>
            <div class="order-summary-item">
                <span>Crop Top</span>
                <span>${productPrices.top} DA</span>
            </div>
            <div class="order-summary-item" style="font-weight: bold; color: #b47b84;">
                <span>Réduction pour l'ensemble</span>
                <span>-${(productPrices.bag + productPrices.top - productPrices.both)} DA</span>
            </div>
            <div class="order-summary-item" style="border-top: 1px solid #eee; margin-top: 5px; padding-top: 5px;">
                <span>Total articles</span>
                <span>${productPrices.both} DA</span>
            </div>
        `;
    } else {
        selectedProducts.forEach(item => {
            const price = productPrices[item];
            subtotal += price;
            const itemName = item === 'bag' ? 'Sac' : 'Crop Top';
            itemsHtml += `
                <div class="order-summary-item">
                    <span>${itemName}</span>
                    <span>${price} DA</span>
                </div>
            `;
        });
    }
    
    // Update the order items
    orderItemsSummary.innerHTML = itemsHtml || '<div class="order-summary-item">Aucun article sélectionné</div>';
    
    // Update delivery cost
    deliveryCostSummary.textContent = `${deliveryPrice} DA`;
    
    // Calculate and update total
    const total = subtotal + deliveryPrice;
    orderTotalElement.textContent = `${total} DA`;
    
    // Update the hidden input for form submission
    const totalInput = document.getElementById('orderTotalValue');
    if (totalInput) {
        totalInput.value = total;
    }
}

// Add event listeners for product selection
function setupProductSelection() {
    const productCheckboxes = document.querySelectorAll('input[name="orderItems"]');
    productCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // If 'both' is selected, uncheck individual items
            if (checkbox.value === 'both' && checkbox.checked) {
                document.querySelectorAll('input[name="orderItems"]:not([value="both"])').forEach(cb => {
                    cb.checked = false;
                });
            } 
            // If individual item is selected, uncheck 'both'
            else if (checkbox.checked) {
                document.querySelector('input[value="both"]').checked = false;
            }
            
            // Update order summary
            updateOrderSummary(parseInt(document.getElementById('deliveryPriceValue').value) || 0);
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
