// script.js
// JavaScript for Elegant Bistro Restaurant Website
// Handles: Mobile menu toggle, smooth scrolling, fade-in animations, navbar scroll effects, and 3D pizza in hero using Three.js

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    // Handles hamburger menu for mobile responsiveness
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Optional: Animate hamburger lines to X (not implemented for simplicity)
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Navbar Links
    // Enhances CSS scroll-behavior with JS for better control and offset (accounts for fixed navbar)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in Animation on Scroll
    // Uses Intersection Observer to fade in elements with data-fade attribute as they enter viewport
    const fadeElements = document.querySelectorAll('[data-fade]');
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Pre-load a bit before entering view
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Optional: Unobserve after animation to improve performance
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));

    // Navbar Animation on Scroll
    // Changes navbar background opacity and adds shadow when scrolled past hero
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(17, 17, 17, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(212, 175, 55, 0.2)';
        } else {
            navbar.style.background = 'rgba(17, 17, 17, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Contact Form Submission
    // Basic handling with alert (demo; replace with real backend integration)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simple validation (already handled by HTML required attrs)
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // 3D Rotating Pizza in Hero Section using Three.js
    // Creates a simple pizza model with geometries: crust (torus), sauce (plane), cheese/toppings (spheres)
    // Auto-rotates slowly for visual depth. Only initializes if canvas exists and on desktop
    const pizzaCanvas = document.getElementById('pizza-canvas');
    if (pizzaCanvas && window.innerWidth > 768) { // Skip on mobile as per CSS
        let scene, camera, renderer, pizzaGroup;
        let animationId;

        // Initialize Three.js Scene
        function initThreeJS() {
            // Scene setup
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x111111); // Match dark theme

            // Camera setup (perspective, positioned to view pizza)
            camera = new THREE.PerspectiveCamera(75, pizzaCanvas.clientWidth / pizzaCanvas.clientHeight, 0.1, 1000);
            camera.position.set(0, 5, 10);
            camera.lookAt(0, 0, 0);

            // Renderer setup (WebGL, with antialiasing for smoothness)
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(pizzaCanvas.clientWidth, pizzaCanvas.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            pizzaCanvas.appendChild(renderer.domElement);

            // Lighting: Ambient + directional for depth and highlights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xd4af37, 0.8); // Gold-tinted light
            directionalLight.position.set(10, 10, 5);
            scene.add(directionalLight);

            // Create Pizza Group (all parts parented for rotation)
            pizzaGroup = new THREE.Group();

            // Crust: Brown torus (donut shape)
            const crustGeometry = new THREE.TorusGeometry(4, 0.5, 8, 32);
            const crustMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Saddle brown
            const crust = new THREE.Mesh(crustGeometry, crustMaterial);
            crust.rotation.x = -Math.PI / 2; // Lay flat
            pizzaGroup.add(crust);

            // Sauce: Red plane (tomato base)
            const sauceGeometry = new THREE.CircleGeometry(3.5, 32);
            const sauceMaterial = new THREE.MeshLambertMaterial({ color: 0xFF6347 }); // Tomato red
            const sauce = new THREE.Mesh(sauceGeometry, sauceMaterial);
            sauce.rotation.x = -Math.PI / 2;
            sauce.position.y = 0.01; // Slightly above crust
            pizzaGroup.add(sauce);

            // Cheese: Multiple yellow spheres scattered on top
            for (let i = 0; i < 8; i++) {
                const cheeseGeometry = new THREE.SphereGeometry(0.3, 16, 16);
                const cheeseMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 }); // Gold yellow
                const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
                // Random position on pizza surface
                const angle = (i / 8) * Math.PI * 2;
                const radius = 2 + Math.random() * 1.5;
                cheese.position.set(
                    Math.cos(angle) * radius,
                    0.2,
                    Math.sin(angle) * radius
                );
                pizzaGroup.add(cheese);
            }

            // Toppings: Small green (basil) and red (pepperoni) spheres
            // Basil leaves (green)
            for (let i = 0; i < 4; i++) {
                const basilGeometry = new THREE.SphereGeometry(0.15, 8, 8);
                const basilMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
                const basil = new THREE.Mesh(basilGeometry, basilMaterial);
                const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;
                basil.position.set(
                    Math.cos(angle) * 2.5,
                    0.3,
                    Math.sin(angle) * 2.5
                );
                pizzaGroup.add(basil);
            }

            // Pepperoni slices (red cylinders)
            for (let i = 0; i < 6; i++) {
                const pepperoniGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
                const pepperoniMaterial = new THREE.MeshLambertMaterial({ color: 0xDC143C }); // Crimson
                const pepperoni = new THREE.Mesh(pepperoniGeometry, pepperoniMaterial);
                const angle = (i / 6) * Math.PI * 2;
                pepperoni.position.set(
                    Math.cos(angle) * 2,
                    0.25,
                    Math.sin(angle) * 2
                );
                pepperoni.rotation.x = Math.PI / 2;
                pizzaGroup.add(pepperoni);
            }

            scene.add(pizzaGroup);

            // Start rendering loop
            animate();
        }

        // Animation Loop: Auto-rotate pizza group slowly
        function animate() {
            animationId = requestAnimationFrame(animate);
            pizzaGroup.rotation.y += 0.005; // Slow rotation (adjust for speed)
            renderer.render(scene, camera);
        }

        // Handle Window Resize: Adjust canvas and camera
        function onWindowResize() {
            if (pizzaCanvas && renderer && camera) {
                const width = pizzaCanvas.clientWidth;
                const height = pizzaCanvas.clientHeight;

                if (width > 0 && height > 0) {
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
        }

        window.addEventListener('resize', onWindowResize);

        // Initialize Three.js
        initThreeJS();

        // Cleanup on page unload (optional, for performance)
        window.addEventListener('beforeunload', () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            if (renderer) {
                pizzaCanvas.removeChild(renderer.domElement);
            }
        });
    }
});