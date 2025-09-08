// Enhanced Shop Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add error handling for missing images
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const container = this.parentElement;
            const placeholder = document.createElement('div');
            placeholder.className = 'product-placeholder';
            placeholder.innerHTML = '<i class="fas fa-image"></i>';
            container.appendChild(placeholder);
        });
    });

    // Add scroll to top functionality (without animations)
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(180, 123, 132, 0.3);
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll to top functionality (instant scroll)
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    });
});
