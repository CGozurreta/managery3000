// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Product hover effects
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Dynamically load images (demonstration purpose - replace with your image loading logic)
    function loadProductImages() {
        const productImages = document.querySelectorAll('.product-img');
        
        // In a real implementation, you would replace this with your image sources
        // This is just a placeholder function
        productImages.forEach((img, index) => {
            // For demonstration - in production, use your actual image paths
            // img.src = `./images/product-${index + 1}.jpg`;
        });
    }
    
    // Add ability to expand product details
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            // You can implement a modal or expanded view here
            console.log('Product clicked:', this.querySelector('.product-title').textContent);
        });
    });
    
    // Initialize any additional functionality
    function init() {
        loadProductImages();
        console.log('Game store template initialized');
    }
    
    init();
});