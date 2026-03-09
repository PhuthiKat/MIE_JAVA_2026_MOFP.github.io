const container = document.querySelector('.container');

// Clone container for dark mode - keep ALL sections for navigation to work
const cloneContainer = container.cloneNode(true);
cloneContainer.id = 'dark-container';

// Add dark container to the page
document.body.appendChild(cloneContainer);
cloneContainer.classList.remove('active');

// Update dark container image
const darkContainerImg = document.querySelector('#dark-container .home-img img');
if (darkContainerImg) {
    darkContainerImg.src = 'phuthi.jpg';
}

// ==================== CV DOWNLOAD FUNCTIONALITY ====================

/**
 * Handles the CV download when button is clicked
 * Uses the actual PDF file from the server
 */
function handleDownload(e) {
    e.preventDefault();
    
    // Get the download link from the button's href attribute
    const downloadBtn = e.currentTarget;
    const cvPath = downloadBtn.getAttribute('href');
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'P.Mofokeng_CV.pdf'; // Clean filename without double dots
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Downloading CV...');
}

/**
 * Sets up download buttons for a given container
 * @param {HTMLElement} containerElement - The container to setup buttons for
 */
function setupDownloadButtons(containerElement) {
    const downloadBtns = containerElement.querySelectorAll('.btn');
    downloadBtns.forEach(btn => {
        // Remove existing listeners to prevent duplicates
        btn.removeEventListener('click', handleDownload);
        // Add fresh event listener
        btn.addEventListener('click', handleDownload);
        
        // Ensure the href attribute is correct
        if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
            btn.setAttribute('href', 'P.Mofokeng CV..pdf');
        }
    });
}

// Setup download buttons for initial container
setupDownloadButtons(container);

// ==================== NAVIGATION FUNCTIONALITY ====================

/**
 * Sets up navigation links for a given container
 * @param {HTMLElement} containerElement - The container to setup navigation for
 */
function setupNavigation(containerElement) {
    const navLinks = containerElement.querySelectorAll('.nav-link');
    const sections = containerElement.querySelectorAll('.section');
    
    // Hide all sections except home initially
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.style.display = 'none';
        }
    });
    
    // Add click handlers to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1); // Remove the #
            
            // Remove active class from all links in this container
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Hide all sections in this container
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the target section
            const targetSection = containerElement.querySelector(`#${targetId}`);
            if (targetSection) {
                targetSection.style.display = 'flex';
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup navigation for both containers
setupNavigation(container);
setupNavigation(cloneContainer);

// ==================== DARK/LIGHT MODE TOGGLE ====================

/**
 * Syncs the active navigation link between light and dark containers
 * @param {string} activeSection - The ID of the active section
 */
function syncNavigationLinks(activeSection) {
    // Update dark container navigation to match light container
    cloneContainer.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Sync visible sections in dark container
    const darkSections = cloneContainer.querySelectorAll('.section');
    darkSections.forEach(section => {
        if (section.id === activeSection) {
            section.style.display = 'flex';
        } else {
            section.style.display = 'none';
        }
    });
}

/**
 * Ensure dark container maintains proper scroll height
 */
function fixDarkModeScrolling() {
    if (!cloneContainer) return;
    
    // Make sure sections have proper height
    const darkSections = cloneContainer.querySelectorAll('.section');
    darkSections.forEach(section => {
        section.style.minHeight = '100vh';
        section.style.height = 'auto';
    });
    
    // Ensure the projects and contact sections have proper padding
    const projectsSection = cloneContainer.querySelector('.projects');
    const contactSection = cloneContainer.querySelector('.contact');
    
    if (projectsSection) {
        projectsSection.style.paddingBottom = '80px';
    }
    
    if (contactSection) {
        contactSection.style.paddingBottom = '80px';
    }
}

// Get all toggle icons
const toggleIcons = document.querySelectorAll('.toggle-icon');

// Add click handlers to toggle icons
toggleIcons.forEach((toggleIcon) => {
    toggleIcon.addEventListener('click', () => {
        const icon = toggleIcon.querySelector('i');

        // Disable toggle temporarily to prevent spam clicking
        toggleIcon.classList.add('disabled');
        setTimeout(() => {
            toggleIcon.classList.remove('disabled');
        }, 1500);

        // Toggle between moon and sun icon
        if (icon) {
            icon.classList.toggle('bx-sun');
            icon.classList.toggle('bx-moon');
        }

        // Toggle active state of containers
        container.classList.toggle('active');
        cloneContainer.classList.toggle('active');

        // Get the currently active section from light container
        const activeLightLink = container.querySelector('.nav-link.active');
        if (activeLightLink) {
            const activeSection = activeLightLink.getAttribute('data-section');
            syncNavigationLinks(activeSection);
        } else {
            // If no active link, default to home
            syncNavigationLinks('home');
        }
        
        // Fix scrolling in dark mode
        setTimeout(fixDarkModeScrolling, 100);
    });
});

// ==================== WINDOW LOAD HANDLER ====================

/**
 * Initializes everything when page loads
 */
window.addEventListener('load', () => {
    // Ensure home section is visible in both containers
    [container, cloneContainer].forEach(containerElement => {
        if (containerElement) {
            const sections = containerElement.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = section.id === 'home' ? 'flex' : 'none';
            });
            
            // Setup download buttons for this container
            setupDownloadButtons(containerElement);
        }
    });
    
    // Fix dark mode scrolling initially
    fixDarkModeScrolling();
    
    console.log('Portfolio loaded successfully!');
});

// ==================== ENSURE DARK CONTAINER HAS ALL SECTIONS ====================

/**
 * Make sure dark container has all the same sections as light container
 */
function ensureDarkContainerSections() {
    // Get all sections from light container
    const lightSections = container.querySelectorAll('.section');
    const darkSections = cloneContainer.querySelectorAll('.section');
    
    // If dark container has fewer sections, it means we need to add them back
    if (darkSections.length < lightSections.length) {
        // Remove all current sections from dark container
        darkSections.forEach(section => section.remove());
        
        // Clone all sections from light container and add to dark container
        lightSections.forEach(section => {
            const clonedSection = section.cloneNode(true);
            cloneContainer.appendChild(clonedSection);
        });
        
        // Re-setup navigation for dark container
        setupNavigation(cloneContainer);
        setupDownloadButtons(cloneContainer);
        
        // Fix scrolling for new sections
        fixDarkModeScrolling();
    }
}

// Call this function to ensure dark container has all sections
ensureDarkContainerSections();

// ==================== FIX FOR CV DOWNLOAD IN DARK CONTAINER ====================

/**
 * Specifically fix download buttons in dark container
 */
function fixDarkContainerDownload() {
    if (cloneContainer) {
        const darkDownloadBtns = cloneContainer.querySelectorAll('.btn');
        darkDownloadBtns.forEach(btn => {
            // Make sure the href is correct
            btn.setAttribute('href', 'P.Mofokeng CV..pdf');
            btn.setAttribute('download', 'P.Mofokeng_CV.pdf');
            
            // Remove and re-add event listener
            btn.removeEventListener('click', handleDownload);
            btn.addEventListener('click', handleDownload);
        });
        console.log('Dark container download buttons fixed');
    }
}

// Call the fix function
setTimeout(fixDarkContainerDownload, 300);

// ==================== ERROR HANDLING ====================

// Global error handler for debugging
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
});

// Call fix functions after a delay
setTimeout(() => {
    fixDarkModeScrolling();
    fixDarkContainerDownload();
}, 500);
