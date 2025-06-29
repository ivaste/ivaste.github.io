// Track current page for navigation
let currentPage = 'home';

function loadSection(file, anchor = null) {
    fetch(file)
      .then(response => response.text())
      .then(html => {
        const container = document.getElementById("content");
        container.innerHTML = html;

        // Execute any script tags that were injected
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.head.appendChild(newScript);
        });

        // After injecting the HTML, scroll to the anchor if provided
        if (anchor) {
          // Wait a moment to ensure DOM is updated
          setTimeout(() => {
            const target = document.getElementById(anchor);
            if (target) {
              target.scrollIntoView({ behavior: "smooth" });
            }
          }, 50);
        }
      })
      .catch(error => {
        document.getElementById("content").innerHTML =
          "<p class='text-danger'>Error loading content.</p>";
      });
}

function navigateToPage(page, anchor = null) {
    // Update current page
    currentPage = page;
    
    // Update URL using hash-based routing to avoid 404 errors
    const hash = anchor ? `#${page}-${anchor}` : `#${page}`;
    window.history.pushState({ page, anchor }, '', hash);
    
    // Load the appropriate content
    let filePath;
    switch(page) {
        case 'home':
            filePath = 'pages/home.html';
            break;
        case 'resume':
            filePath = 'pages/resume.html';
            break;
        case 'blog':
            filePath = 'pages/blog.html';
            break;
        default:
            filePath = 'pages/home.html';
    }
    
    loadSection(filePath, anchor);
    updateActiveNavLink(page);
}

function updateActiveNavLink(page) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Add active class to current page link
    const navLinks = document.querySelectorAll('.nav-link');
    switch(page) {
        case 'home':
            if (navLinks[0]) {
                navLinks[0].classList.add('active');
                navLinks[0].setAttribute('aria-current', 'page');
            }
            break;
        case 'resume':
            if (navLinks[1]) {
                navLinks[1].classList.add('active');
                navLinks[1].setAttribute('aria-current', 'page');
            }
            break;
        case 'contact':
            if (navLinks[2]) {
                navLinks[2].classList.add('active');
                navLinks[2].setAttribute('aria-current', 'page');
            }
            break;
        case 'blog':
            if (navLinks[3]) {
                navLinks[3].classList.add('active');
                navLinks[3].setAttribute('aria-current', 'page');
            }
            break;
    }
}

// Parse hash to get page and anchor
function parseHash(hash) {
    if (!hash) return { page: 'home', anchor: null };
    
    const cleanHash = hash.substring(1); // Remove the #
    const parts = cleanHash.split('-');
    
    if (parts.length === 1) {
        return { page: parts[0] || 'home', anchor: null };
    } else {
        return { page: parts[0] || 'home', anchor: parts[1] || null };
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state) {
        navigateToPage(event.state.page, event.state.anchor);
    } else {
        // Parse current hash to determine what to load
        const { page, anchor } = parseHash(window.location.hash);
        navigateToPage(page, anchor);
    }
});

// Handle hash changes (when user manually changes URL)
window.addEventListener('hashchange', () => {
    const { page, anchor } = parseHash(window.location.hash);
    navigateToPage(page, anchor);
});

// Load default section on initial load
window.addEventListener("DOMContentLoaded", () => {
    // Check if there's a hash in the URL
    const { page, anchor } = parseHash(window.location.hash);
    navigateToPage(page, anchor);
});