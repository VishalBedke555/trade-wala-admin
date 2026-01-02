// Centralized Contact Information Configuration
// Update these values to change contact info across entire website

const TradeWalaContact = {
    // Company Information
    companyName: "Trade-Wala Pvt. Ltd.",
       
    
    // Address Information
    address: {
        street: "Shop No 1, Pisadevi Rd,",
        area: "Wholesale Market, Harsul,",
        city: "Chhatrapati Sambhajinagar,",
        state: "Maharashtra",
        pincode: "431008",
        country: "India",
        
        // Short address for footer (one line)
        short: "Shop No 1, Pisadevi Rd, Harsul, Chhatrapati Sambhajinagar, Maharashtra 431008",
        
        // Full address for contact page
        full: "Shop No 1, Pisadevi Rd, Wholesale Market, Harsul, Chhatrapati Sambhajinagar, Maharashtra 431008, India"
    },
    
    // Phone Numbers
    phone: {
        customerSupport: "+91 98765 43210",
        dealerInquiries: "+91 98765 43211"
    },
    
    // Email Addresses
    email: {
        support: "tradewala555@gmail.com",
        dealers: "tradewala555@gmail.com",
        partnerships: "tradewala555@gmail.com",
        careers: "tradewala555@gmail.com"
    },
    
    // Business Hours
    businessHours: "Mon-Sat: 9:00 AM - 7:00 PM",
    
    // Method to get formatted footer contact HTML
    getFooterContactHTML() {
        return `
            <p><i class="fas fa-map-marker-alt"></i> ${this.address.short}</p>
            <p><i class="fas fa-phone"></i> ${this.phone.customerSupport}</p>
            <p><i class="fas fa-envelope"></i> ${this.email.support}</p>
            <p><i class="fas fa-clock"></i> ${this.businessHours}</p>
        `;
    },
    
    // Method to get formatted contact page HTML
    getContactPageHTML() {
        return `
            <!-- Office Address -->
            <div class="contact-method">
                <div class="contact-icon">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="contact-details">
                    <h3>Our Office</h3>
                    <p>${this.companyName}</p>
                    <p>${this.address.street},</p>
                    <p>${this.address.area}</p>
                    <p>${this.address.state} ${this.address.pincode}, ${this.address.country}</p>
                </div>
            </div>
            
            <!-- Phone Numbers -->
            <div class="contact-method">
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="contact-details">
                    <h3>Phone Number</h3>
                    <p><strong>Customer Support:</strong> ${this.phone.customerSupport}</p>
                    <p><strong>Dealer Inquiries:</strong> ${this.phone.dealerInquiries}</p>
                </div>
            </div>
            
            <!-- Email Addresses -->
            <div class="contact-method">
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="contact-details">
                    <h3>Email Address</h3>
                    <p><strong>Support:</strong> ${this.email.support}</p>
                    <p><strong>Dealers:</strong> ${this.email.dealers}</p>
                    <p><strong>Partnerships:</strong> ${this.email.partnerships}</p>
                    <p><strong>Careers:</strong> ${this.email.careers}</p>
                </div>
            </div>
        `;
    }
};

// Function to initialize contact information on page load
function initializeContactInformation() {
    // Update footer contact section
    const footerContact = document.getElementById('footerContact');
    if (footerContact) {
        footerContact.innerHTML = TradeWalaContact.getFooterContactHTML();
    }
    
    // Update contact page section
    const contactPage = document.getElementById('contactPageInfo');
    if (contactPage) {
        contactPage.innerHTML = TradeWalaContact.getContactPageHTML();
    }
    
    // Update copyright year
    updateCopyrightYear();
}

// Update copyright year automatically
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright');
    
    copyrightElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace('2023', currentYear);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeContactInformation);