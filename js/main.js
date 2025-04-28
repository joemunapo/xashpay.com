// XashPay Enhanced JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Country flags data
    const countries = [
        { code: '🇿🇦', name: 'South Africa', color: '#007A4D' },
        { code: '🇳🇬', name: 'Nigeria', color: '#008753' },
        { code: '🇰🇪', name: 'Kenya', color: '#BB0000' },
        { code: '🇿🇼', name: 'Zimbabwe', color: '#006400' },
        { code: '🇪🇹', name: 'Ethiopia', color: '#006600' },
        { code: '🇹🇿', name: 'Tanzania', color: '#1EB53A' },
        { code: '🇺🇬', name: 'Uganda', color: '#FCDC04' },
        { code: '🇮🇳', name: 'India', color: '#FF9933' },
        { code: '🇵🇰', name: 'Pakistan', color: '#01411C' },
        { code: '🇧🇼', name: 'Botswana', color: '#75AADB' },
        { code: '🇨🇩', name: 'DR Congo', color: '#007FFF' },
        { code: '🇸🇴', name: 'Somalia', color: '#4189DD' }
    ];

    // Initialize partners carousel
    initPartnersCarousel();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Add scroll animations
    initScrollAnimations();

    // Partners carousel function
    function initPartnersCarousel() {
        const track = document.querySelector('.partners-track');
        
        if (!track) return;
        
        // Create country flags
        countries.forEach(country => {
            const flag = createCountryFlag(country);
            track.appendChild(flag);
        });
        
        // Clone flags for infinite scroll effect
        const flags = document.querySelectorAll('.partner-flag');
        flags.forEach(flag => {
            const clone = flag.cloneNode(true);
            track.appendChild(clone);
        });
    }

    // Create country flag element
    function createCountryFlag(country) {
        const flagContainer = document.createElement('div');
        flagContainer.className = 'partner-flag flex flex-col items-center justify-center';
        
        // Create flag element
        const flagElement = document.createElement('div');
        flagElement.className = 'text-5xl mb-2';
        flagElement.textContent = country.code;
        
        // Create country name
        const countryName = document.createElement('div');
        countryName.className = 'text-sm font-medium';
        countryName.textContent = country.name;
        
        flagContainer.appendChild(flagElement);
        flagContainer.appendChild(countryName);
        return flagContainer;
    }

    // Mobile menu function
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenuButton || !mobileMenu) return;
        
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('open');
            
            // Toggle icon between bars and times
            const icon = mobileMenuButton.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('open');
                
                const icon = mobileMenuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // Smooth scrolling function
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Scroll to element without changing URL hash
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed navbar
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll animations
    function initScrollAnimations() {
        // Add active class to navbar items on scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('text-[#FF4081]');
                
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('text-[#FF4081]');
                }
            });
        });

        // Animate elements on scroll
        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.service-card, .commission-badge, .social-icon');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 100) {
                    element.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        };
        
        // Run once on load
        animateOnScroll();
        
        // Run on scroll
        window.addEventListener('scroll', animateOnScroll);
    }

    // Typing animation for hero text
    const heroTitle = document.querySelector('#home h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }

    // WhatsApp chat simulation
    const chatMessages = [
        { text: "I need to buy airtime for a number in Nigeria", sender: "user" },
        { text: "Sure! Please provide the phone number and amount.", sender: "xashpay" },
        { text: "+234 812 345 6789, $10 worth of airtime please", sender: "user" },
        { text: "Processing your request... Airtime sent successfully! Your commission is $1.00", sender: "xashpay" },
        { text: "Thank you! That was fast!", sender: "user" }
    ];
    
    const chatContainer = document.querySelector('.chat-background');
    if (chatContainer) {
        let messageIndex = 3; // Start with the 4th message (index 3)
        
        const addMessage = function() {
            if (messageIndex < chatMessages.length) {
                const message = chatMessages[messageIndex];
                const messageElement = document.createElement('div');
                
                messageElement.className = message.sender === 'user' 
                    ? 'bg-[#DCF8C6] rounded-lg p-2 max-w-[80%] self-end shadow-sm mb-2'
                    : 'bg-white rounded-lg p-2 max-w-[80%] self-start shadow-sm mb-2';
                
                messageElement.innerHTML = `
                    <p class="text-sm text-gray-800">${message.text}</p>
                    <p class="text-[10px] text-gray-500 text-right">Just now</p>
                `;
                
                chatContainer.appendChild(messageElement);
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                messageIndex++;
                
                // Schedule next message
                if (messageIndex < chatMessages.length) {
                    setTimeout(addMessage, 3000);
                }
            }
        };
        
        // Start adding messages after a delay
        setTimeout(addMessage, 5000);
    }
});
