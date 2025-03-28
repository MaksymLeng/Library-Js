
// book anim

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

let books = [];

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
                            :book.status = "reading" ? "📖"
                            : "📌";

    circle.innerHTML = `<div class="book-content">
                            ${statusIcon}<span>${book.title[0].toUpperCase()}</span>
                        </div>
                       `;
    circle.title = `${book.title} - ${book.author}`;

    bookCircles.appendChild(circle);
    updateBookPosition()
}

function updateBookPosition(){
    const circles = document.querySelectorAll(".book-circle");
    const total = circles.length;
    const radius = 200;

    circles.forEach((circle, i) => {
        const angle = (2 * Math.PI / total) * i - Math.PI / 2;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        circle.style.left = `${x}px`;
        circle.style.transform = `translate(${x}px)`;

        const content = circle.querySelector(".book-content");
        const degrees = (angle * 180) / Math.PI;
        content.style.transform = `rotate(${-degrees}deg)`;
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

document.addEventListener("click", (e) => {
    langList.style.display = "none";
    langBtn.classList.remove("active");
});

langList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
        const lang = li.dataset.lang;
        console.log("Выбран язык", lang);
    })
})