const container = document.querySelector('.container');

const cloneContainer = container.cloneNode(true);
cloneContainer.id = 'dark-container';

document.body.appendChild(cloneContainer);
cloneContainer.classList.remove('active');

const darkContainerImg = document.querySelector('#dark-container .home-img img');
if (darkContainerImg) {
    darkContainerImg.src = 'phuthi.jpg';
}

function handleDownload(e) {
    e.preventDefault();
    
    const downloadBtn = e.currentTarget;
    const cvPath = downloadBtn.getAttribute('href');
    
    const link = document.createElement('a');
    link.href = cvPath;
    link.download = 'P.Mofokeng_CV.pdf'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Downloading CV...');
}

function setupDownloadButtons(containerElement) {
    const downloadBtns = containerElement.querySelectorAll('.btn');
    downloadBtns.forEach(btn => {
        btn.removeEventListener('click', handleDownload);
        btn.addEventListener('click', handleDownload);
        
        if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
            btn.setAttribute('href', 'P.Mofokeng CV..pdf');
        }
    });
}

setupDownloadButtons(container);

function setupNavigation(containerElement) {
    const navLinks = containerElement.querySelectorAll('.nav-link');
    const sections = containerElement.querySelectorAll('.section');
    
    sections.forEach(section => {
        if (section.id !== 'home') {
            section.style.display = 'none';
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            
            navLinks.forEach(l => l.classList.remove('active'));
            
            link.classList.add('active');
            
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = containerElement.querySelector(`#${targetId}`);
            if (targetSection) {
                targetSection.style.display = 'flex';
                
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

setupNavigation(container);
setupNavigation(cloneContainer);

function syncNavigationLinks(activeSection) {
    cloneContainer.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const darkSections = cloneContainer.querySelectorAll('.section');
    darkSections.forEach(section => {
        if (section.id === activeSection) {
            section.style.display = 'flex';
        } else {
            section.style.display = 'none';
        }
    });
}

function fixDarkModeScrolling() {
    if (!cloneContainer) return;

    const darkSections = cloneContainer.querySelectorAll('.section');
    darkSections.forEach(section => {
        section.style.minHeight = '100vh';
        section.style.height = 'auto';
        section.style.overflow = 'visible';
        section.style.position = 'relative';
    });

    const projectsSection = cloneContainer.querySelector('.projects');
    const contactSection = cloneContainer.querySelector('.contact');
    
    if (projectsSection) {
        projectsSection.style.paddingBottom = '80px';
        projectsSection.style.minHeight = '100vh';
        projectsSection.style.height = 'auto';
        projectsSection.style.overflowY = 'visible';
    }
    
    if (contactSection) {
        contactSection.style.paddingBottom = '80px';
        contactSection.style.minHeight = '100vh';
        contactSection.style.height = 'auto';
        contactSection.style.overflowY = 'visible';
    }
    
    cloneContainer.style.overflowY = 'auto';
    cloneContainer.style.height = '100%';
    cloneContainer.style.position = 'fixed';
    cloneContainer.style.top = '0';
    cloneContainer.style.left = '0';
    cloneContainer.style.width = '100%';
}

const toggleIcons = document.querySelectorAll('.toggle-icon');

toggleIcons.forEach((toggleIcon) => {
    toggleIcon.addEventListener('click', () => {
        const icon = toggleIcon.querySelector('i');

        toggleIcon.classList.add('disabled');
        setTimeout(() => {
            toggleIcon.classList.remove('disabled');
        }, 1500);

        if (icon) {
            icon.classList.toggle('bx-sun');
            icon.classList.toggle('bx-moon');
        }

        container.classList.toggle('active');
        cloneContainer.classList.toggle('active');

        const activeLightLink = container.querySelector('.nav-link.active');
        if (activeLightLink) {
            const activeSection = activeLightLink.getAttribute('data-section');
            syncNavigationLinks(activeSection);
        } else {
            syncNavigationLinks('home');
        }
        
        fixDarkModeScrolling();
        
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';
        
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }, 100);
    });
});

window.addEventListener('load', () => {
    [container, cloneContainer].forEach(containerElement => {
        if (containerElement) {
            const sections = containerElement.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.display = section.id === 'home' ? 'flex' : 'none';
            });

            setupDownloadButtons(containerElement);
        }
    });
    
    fixDarkModeScrolling();
    
    console.log('Portfolio loaded successfully!');
});

function ensureDarkContainerSections() {
    const lightSections = container.querySelectorAll('.section');
    const darkSections = cloneContainer.querySelectorAll('.section');
    
    if (darkSections.length < lightSections.length) {
        darkSections.forEach(section => section.remove());
        
        lightSections.forEach(section => {
            const clonedSection = section.cloneNode(true);
            cloneContainer.appendChild(clonedSection);
        });
        
        setupNavigation(cloneContainer);
        setupDownloadButtons(cloneContainer);
        
        fixDarkModeScrolling();
    }
}

ensureDarkContainerSections();

function fixDarkContainerDownload() {
    if (cloneContainer) {
        const darkDownloadBtns = cloneContainer.querySelectorAll('.btn');
        darkDownloadBtns.forEach(btn => {
            btn.setAttribute('href', 'P.Mofokeng CV..pdf');
            btn.setAttribute('download', 'P.Mofokeng_CV.pdf');
            
            btn.removeEventListener('click', handleDownload);
            btn.addEventListener('click', handleDownload);
        });
        console.log('Dark container download buttons fixed');
    }
}

setTimeout(fixDarkContainerDownload, 300);

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
});

setTimeout(() => {
    fixDarkModeScrolling();
    fixDarkContainerDownload();
}, 500);