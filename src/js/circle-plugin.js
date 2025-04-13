export default class RotatingCircles {
    constructor(containerId, initialBooks = [], options = {}) {
        // Find the container to render circles into
        this.container = document.getElementById(containerId);
        this.books = initialBooks;

        // Configuration with default values
        this.config = {
            radius: options.radius || 150,     // Radius for the circular mode
            speed: options.speed || 0.01,      // Rotation speed (circular mode)
            mode: options.mode || "circular",  // "circular" or "random"
            maxFps: options.maxFps || 60,
            // Speed range for X/Y movement in random mode
            randomSpeedRange: options.randomSpeedRange || [0.5, 2],
        };

        // Internal fields
        this.parentAngle = 0;       // Rotation angle for the circular mode
        this.isPaused = false;      // Pause animation when a circle is expanded
        this.circlesData = [];      // For random mode (positions/speeds of circles)
        this.lastFrameTime = 0;

        // If random mode, we add a specific class to the container (for styling)
        if (this.config.mode === "random") {
            this.container.classList.add("random-mode");
        }

        // Initialization
        this.init();
    }

    init() {
        // Create circles for each book
        this.books.forEach(book => this.addBookCircle(book));
        // Start the infinite animation
        this.animate();
    }

    // Public method — add a new book after initialization
    addBook(book) {
        this.books.push(book);
        this.addBookCircle(book);
    }

    // Create one circle based on the "book" object
    addBookCircle(book) {
        const circle = document.createElement("div");
        circle.classList.add("book-circle", book.status);

        // Status icon
        const statusIcon =
            book.status === "read" ? "✅" :
                book.status === "reading" ? "📖" : "📌";

        circle.innerHTML = `
            <div class="book-content">
                <span class="book-icon">${statusIcon}</span>
                <span class="book-title">${book.title[0].toUpperCase()}</span>
                <div class="book-details">
                    <p>Autor: ${book.author}</p>
                    <p>Title: ${book.title}</p>
                    <p>Genre: ${book.genre || "_"}</p>
                </div>
            </div>
        `;

        let clickTimeout;

        // Expand on click
        circle.addEventListener("click",  () => {
            // second click
            clearTimeout(clickTimeout);
            if (circle.classList.contains("expanded")) {
                clickTimeout = setTimeout(() => {
                    if (book.fileName) {
                        const openEvent = new CustomEvent("book-open-requested", {
                            detail: {
                                fileName: book.fileName,
                                book: book
                            }
                        });
                        window.dispatchEvent(openEvent);
                    }
                },300);
            } else {
                // first click
                circle.classList.add("expanded");
                this.isPaused = true;
            }
        });
        // Expand on dblclick
        circle.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            clearTimeout(clickTimeout);
            circle.classList.remove("expanded");
            this.isPaused = false;
        })

        // Remove the pause when clicking outside the circles (on the container)
        document.addEventListener("click", (event) => {
            if (!event.target.closest(".book-circle") && !document.getElementById("readerModal")) {
                this.isPaused = false;
                circle.classList.remove("expanded");
                const expanded = this.container.querySelectorAll(".book-circle.expanded");
                expanded.forEach((circle) => {
                    circle.classList.remove("expanded");
                })
            }
        });

        // Add the circle to the DOM
        this.container.appendChild(circle);

        // If "random" mode, generate initial coordinates and speeds
        if (this.config.mode === "random") {
            this.initRandomData()
        }

        // In circular mode, update positions immediately so circles get placed
        this.updatePositions();
    }

    // Universal positioning method — check which mode is used
    updatePositions() {
        if (this.config.mode === "circular") {
            this.updateCircularPosition();
        } else {
            this.updateRandomPosition();
        }
    }

    setMode(mode) {
        this.config.mode = mode;

        if (mode === "random") {
            this.container.classList.add("random-mode");
            this.initRandomData();
        } else {
            this.container.classList.remove("random-mode");
        }

        this.updatePositions();
    }

    // Lay out circles in a circle
    updateCircularPosition() {
        const circles = this.container.querySelectorAll(".book-circle");
        const total = circles.length;
        const radius = this.config.radius;

        circles.forEach((circle, i) => {
            const angleStep = (2 * Math.PI) / total;
            const angle = angleStep * i + this.parentAngle;
            // Hard-coded center "200,200"
            // You can replace this with (containerWidth/2, containerHeight/2) for dynamic behavior
            const offsetX = 200;
            const offsetY = 200;

            const x = offsetX + radius * Math.cos(angle);
            const y = offsetY + radius * Math.sin(angle);

            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            // Rotate the content so it's not upside down
            this.updateBookContent(circle, angle)
        });
    }

    updateBookContent(circle, angle) {
            const content = circle.querySelector(".book-content");
            const degrees = (angle * 180) / Math.PI;

            if (circle.classList.contains("expanded")) {
                content.style.transform = `rotate(0deg)`;
            } else if (!this.isPaused){
                content.style.transform = `rotate(${-degrees + 180}deg)`;
            }
    }

    initRandomData() {
        this.circlesData = [];

        const rect = this.container.getBoundingClientRect();
        const circles = this.container.querySelectorAll('.book-circle');

        circles.forEach(circle => {
            const startX = Math.random() * rect.width;
            const startY = Math.random() * rect.height;

            const [minSpeed, maxSpeed] = this.config.randomSpeedRange;
            const speedX = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);
            const speedY = (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() < 0.5 ? -1 : 1);

            this.circlesData.push({
                element: circle,
                x: startX,
                y: startY,
                vx: speedX,
                vy: speedY,
                angle: Math.random() * 360,
                rotationRate: (Math.random() - 0.7) * 0.7,
            });

            circle.style.left = `${startX}px`;
            circle.style.top = `${startY}px`;
        });
    }

    // Move circles in a random trajectory
    updateRandomPosition() {
        // Get container dimensions
        const rect = this.container.getBoundingClientRect();

        // Iterate over each circle
        this.circlesData.forEach(data => {
            // Move only if we're not paused (expanded circle)
            if (!this.isPaused) {
                data.x += data.vx;
                data.y += data.vy;

                // Bounce off the walls
                if (data.x < 0) {
                    data.x = 0;
                    data.vx *= -1;
                }
                if (data.x > rect.width) {
                    data.x = rect.width;
                    data.vx *= -1;
                }
                if (data.y < 0) {
                    data.y = 0;
                    data.vy *= -1;
                }
                if (data.y > rect.height) {
                    data.y = rect.height;
                    data.vy *= -1;
                }
            }

            // Update position styles
            data.element.style.left = `${data.x}px`;
            data.element.style.top = `${data.y}px`;
            data.angle += data.rotationRate;

            this.updateBookContent(data.element, data.angle * Math.PI / 180);
        });
    }

    // Infinite animation via requestAnimationFrame
    animate(timestamp) {
        const delta = timestamp - this.lastFrameTime;
        if (delta < 1000 / this.config.maxFps) {
            requestAnimationFrame(this.animate.bind(this));
            return;
        }
        this.lastFrameTime = timestamp;

        if (this.config.mode === "circular" && !this.isPaused) {
            // If mode is "circular" and not paused — increment the angle
            this.parentAngle += this.config.speed;
        }

        // Update positions
        this.updatePositions();

        // Recursive call
        requestAnimationFrame(this.animate.bind(this));
    }
}