import RotatingCircles from 'https://cdn.jsdelivr.net/gh/MaksymLeng/rotating-circles-plugin/dist/circle-plugin.min.js';

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
        plugin.setMode(plugin.config.mode === "circular" ? "random" : "circular");
    });

    // circle anim and book array

    const form = document.getElementById("book-form");

    let books =  JSON.parse(localStorage.getItem("books")) || [];

    const plugin = new RotatingCircles('bookCircles', books, {
        mode: 'circular',
        radius: 150,
        speed: 0.01
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const status = document.getElementById("status").value.trim();

        if (!title || !author) return;

        const book = {title, author, genre, status};

        plugin.addBook(book);
        localStorage.setItem("books", JSON.stringify(books));
        form.reset();
    });

    // change language

    const langBtn = document.getElementById("btn_lang");
    const langList = document.getElementById("lang_list");

    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langList.style.display = langList.style.display === "block" ? "none" : "block";
        langBtn.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        //langList
        langList.style.display = "none";
        langBtn.classList.remove("active");
        //popup
        popup.style.display = "none";
        navIcon.classList.remove("rotated");
        // hack copy plugin pressing anywhere
        if (!e.target.closest(".book-circle")) {
            setTimeout(() => {
                plugin.isPaused = false;
                plugin.container.querySelectorAll(".book-circle.expanded")
                    .forEach(c => c.classList.remove("expanded"));
            }, 0);
        }
    });

    langList.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", () => {
            const lang = li.dataset.lang;
            console.log("Выбран язык", lang);
        })
    });

    // upload file script

    const fileInput = document.getElementById("file");
    const uploadCorner = document.getElementById("upload_corner");

    uploadCorner.addEventListener("click", (e) => {
        e.stopPropagation();
        fileInput.click();
    })
});
