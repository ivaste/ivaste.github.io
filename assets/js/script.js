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

    // Load default section on initial load
  window.addEventListener("DOMContentLoaded", () => {
    loadSection("pages/home.html");
  });