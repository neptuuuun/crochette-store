// Sample product data - In a real implementation, this would come from a database
const availableProducts = [
    {
        id: 1,
        name: "Crop Top",
        description: "A spacious tote bag in warm sunset colors with intricate stitch patterns. Perfect for daily adventures or beach trips.",
        price: 3000,
        image: "../images/product-set-3.jpg", // Would be actual image URL
        story: "Inspired by Mediterranean sunsets, this piece took 15 hours to complete using a unique color-changing technique.",
        available: true
    },
    {
        id: 2,
        name: "Eren Yeager Amigurumi",
        description: "Handcrafted Eren Yeager amigurumi doll, detailed with precision to capture his iconic look. A perfect collectible for anime fans.",
        price: 2000,
        image: "../images/eren.jpg",
        story: "Created during a full moon night, this piece features a rare vintage yarn that's no longer in production.",
        available: true
    },
    {
        id: 3,
        name: "Summer Bag",
        description: "A lightweight shawl that captures the essence of ocean waves with its flowing pattern and sea-blue tones.",
        price: 2500,
        image: "../images/product-set-1.jpg",
        story: "Inspired by early morning walks on the Mediterranean coast, using a technique passed down from my grandmother.",
        available: true
    },
];

// Archive (sold products) - proof of exclusivity
const archivedProducts = [
    
];

// Current page tracking
let currentPage = 'home';

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    loadAllProducts();
    loadArchivedProducts();
    setupFormSubmission();
});

// Page navigation
function showPage(page) {
    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected page
    document.getElementById(page).classList.add('active');
    
    // Update current page
    currentPage = page;

    // Close mobile menu if open
    document.getElementById('navMenu').classList.remove('active');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Mobile menu toggle
function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

// Load featured products for home page
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    const featured = availableProducts.slice(0, 3); // Show first 3 products
    
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Load all available products
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    container.innerHTML = availableProducts.map(product => createProductCard(product)).join('');
}

// Load archived (sold) products
function loadArchivedProducts() {
    const container = document.getElementById('archiveProducts');
    container.innerHTML = archivedProducts.map(product => createArchiveCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="exclusive-badge">
                <i class="fas fa-crown"></i> Only 1 Available
            </div>
            <div class="product-image-container">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="product-image">` : 
                    `<div class="product-placeholder"><i class="${product.icon}"></i></div>`
                }
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="current-price">${product.price} DA</span>
                </div>
                <div class="product-actions">
                    <button class="product-btn primary" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="product-btn secondary" onclick="purchaseProduct(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Create archive card HTML
function createArchiveCard(product) {
    return `
        <div class="archive-item">
            <div class="sold-badge">SOLD</div>
            <div class="archive-image">
                <i class="${product.icon}"></i>
            </div>
            <div class="archive-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p><strong>Sold:</strong> ${product.soldDate} for ${product.soldPrice} DA</p>
            </div>
        </div>
    `;
}

// Show product details (modal or new page)
function showProductDetails(productId) {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
        // Create a modal or redirect to product detail page
        alert(`Product Details:\n\n${product.name}\n\nPrice: ${product.price} DA\n\n${product.story}\n\nThis piece is completely unique and will never be recreated. Once sold, it joins our exclusive archive.\n\nWould you like to purchase it?`);
    }
}

// Purchase product function
function purchaseProduct(productId) {
    const product = availableProducts.find(p => p.id === productId);
    if (product) {
        // In a real implementation, this would redirect to a secure checkout
        // For now, we'll simulate with a form or redirect to contact
        const proceed = confirm(`Purchase "${product.name}" for ${product.price} DA?\n\nThis unique piece will be reserved for you once you confirm your order details.`);
        
        if (proceed) {
            // Create a quick purchase form or redirect to WhatsApp/email
            window.open(`https://wa.me/your-number?text=I'd like to purchase "${product.name}" for ${product.price} DA. Please send me payment details.`, '_blank');
        }
    }
}

// Setup form submission for custom requests
function setupFormSubmission() {
    document.getElementById('customRequestForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // In a real implementation, send this data to your backend
        console.log('Custom Request Data:', data);
        
        // Show success message
        document.getElementById('requestSuccessMessage').classList.add('show');
        
        // Reset form
        this.reset();
        
        // Scroll to success message
        document.getElementById('requestSuccessMessage').scrollIntoView({ 
            behavior: 'smooth' 
        });

        // In a real implementation, you could also:
        // - Send email via service like Formspree, EmailJS, or your own backend
        // - Save to database
        // - Send notification to your phone/email
        
        // Example with EmailJS (you'd need to set up EmailJS account):
        // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
        //     .then(() => console.log('Email sent successfully'));
    });
}

// Simulate product being sold (for demo purposes)
function simulateSale(productId) {
    const productIndex = availableProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const soldProduct = availableProducts.splice(productIndex, 1)[0];
        
        // Add to archive
        archivedProducts.unshift({
            id: soldProduct.id + 100,
            name: soldProduct.name,
            description: soldProduct.description,
            soldDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            soldPrice: soldProduct.price,
            icon: soldProduct.icon
        });
        
        // Refresh displays
        loadFeaturedProducts();
        loadAllProducts();
        loadArchivedProducts();
        
        alert(`"${soldProduct.name}" has been sold and moved to the archive!`);
    }
}

// Add some utility functions for managing the store

// Function to add new product (for store owner)
function addNewProduct(productData) {
    // In a real implementation, this would be an admin function
    availableProducts.push({
        id: Date.now(), // Simple ID generation
        ...productData,
        available: true
    });
    
    loadFeaturedProducts();
    loadAllProducts();
}

// Function to mark product as sold (for store owner)
function markAsSold(productId) {
    simulateSale(productId);
}

// Search functionality (bonus feature)
function searchProducts(query) {
    const filtered = availableProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('allProducts');
    if (filtered.length > 0) {
        container.innerHTML = filtered.map(product => createProductCard(product)).join('');
    } else {
        container.innerHTML = '<p style="text-align: center; color: var(--light-text); font-size: 1.2rem; padding: 40px;">No products found matching your search.</p>';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.getElementById('navMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
        nav.classList.remove('active');
    }
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});