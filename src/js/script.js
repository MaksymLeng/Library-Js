document.body.style.cursor = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"32\" width=\"32\"><text y=\"24\" font-size=\"24\">🐰</text></svg>') 16 16, auto";

document.addEventListener("DOMContentLoaded", () => {

    // navbook anim

    const navBtn = document.getElementById("btn_navbook");
    const popup = document.getElementById("menuPopup");
    const navIcon = document.querySelector("#btn_navbook img");

    navBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = popup.style.display === "block";

        popup.style.display = isOpen ? "none" : "block";
        navIcon.classList.toggle("rotated", !isOpen);
    });

    document.addEventListener("click", () => {
        popup.style.display = "none";
        navIcon.classList.remove("rotated");
    })

    // circle anim and book array

    const form = document.getElementById("book-form");
    const bookCircles = document.getElementById("bookCircles");

    let books =  JSON.parse(localStorage.getItem("books")) || [];
    let parentAngle = 0;       // глобальный угол вращения
    let rotationSpeed = 0.01;  // скорость вращения
    let isPaused = false;      // останавливаем при раскрытии кружка

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const status = document.getElementById("status").value.trim();

        if (!title || !author) return;

        const book = {title, author, genre, status};
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));

        addBookCircle(book);
        form.reset();
    });

    function addBookCircle(book) {
        const circle = document.createElement("div");
        circle.classList.add("book-circle", book.status);

        const statusIcon = book.status === "read" ? "✅"
                                :book.status === "reading" ? "📖"
                                : "📌";

        circle.innerHTML = `<div class="book-content">
                                <span class="book-icon">${statusIcon}</span>
                                <span class="book-title">${book.title[0].toUpperCase()}</span>
                                <div class="book-details">
                                    <p>Автор: ${book.author}</p>
                                    <p>Жанр: ${book.genre || "_"}</p>
                                    <p>Статус: ${book.status}</p>
                                </div>
                            </div>
                           `;

        circle.addEventListener("click", () => {
            circle.classList.toggle("expanded");

            if (circle.classList.contains("expanded")) {
                isPaused = true;
            } else {
                const stillExpanded = document.querySelector(".book-circle.expanded");
                if (!stillExpanded) {
                    isPaused = false;
                }
            }
        });

        bookCircles.appendChild(circle);
        updateBookPosition()
    }

    function updateBookPosition(){
        const circles = document.querySelectorAll(".book-circle");
        const total = circles.length;
        const radius = 150;

        circles.forEach((circle, i) => {
            const angleStep = (2 * Math.PI) / total;
            const angle = angleStep * i + parentAngle;
            const offsetX = 200;
            const offsetY = 200;

            const x = offsetX + radius * Math.cos(angle);
            const y = offsetY + radius * Math.sin(angle);

            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;

            const content = circle.querySelector(".book-content");
            const degrees = (angle * 180) / Math.PI;
            if (circle.classList.contains("expanded")) {
                content.style.transform = `rotate(0deg)`;
            }else {
                content.style.transform = `rotate(${-degrees + 180}deg)`;
            }
        });
    }

    // change language

    const langBtn = document.getElementById("btn_lang");
    const langList = document.getElementById("lang_list");

    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langList.style.display = langList.style.display === "block" ? "none" : "block";
        langBtn.classList.toggle("active");
    });

    document.addEventListener("click", () => {
        langList.style.display = "none";
        langBtn.classList.remove("active");
    });

    langList.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
            const lang = li.dataset.lang;
            console.log("Выбран язык", lang);
        })
    });

    const savedBooks = localStorage.getItem("books");
    if (savedBooks) {
        books = JSON.parse(savedBooks);
        books.forEach((book) => addBookCircle(book));
    }

    function animateRotation() {
      if (!isPaused) {
        parentAngle += rotationSpeed;
      }
      updateBookPosition();
      requestAnimationFrame(animateRotation);
    }
    requestAnimationFrame(animateRotation);
});
