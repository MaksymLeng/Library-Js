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
    let currentFile = null;
    const usedFileNames = new Set();

    const plugin = new RotatingCircles('bookCircles', books, {
        mode: 'circular',
        radius: 150,
        speed: 0.01
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!currentFile) {
            showToast("⚠️ Сначала добавьте файл книги", false);
            return;
        }

        if (usedFileNames.has(currentFile.name)) {
            showToast("📁 Этот файл уже использован для книги", false);
            return;
        }
        //library billet
        // const reader = new FileReader();
        // reader.onloadend = (e) => {
        //     const fileData = reader.result;

            // circle building
            const title = document.getElementById("title").value.trim();
            const author = document.getElementById("author").value.trim();
            const genre = document.getElementById("genre").value.trim();
            const status = document.getElementById("status").value.trim();

            if (!title || !author) return;

            const book = {
                title,
                author,
                genre,
                status
                // fileName: currentFile.name,
                // fileData: fileData
            };

            plugin.addBook(book);
            localStorage.setItem("books", JSON.stringify(books));
            usedFileNames.add(currentFile.name);

            form.reset();
            fileInput.value = "";
            currentFile = null;

            showToast("Книга успешно добавлена", true);
        // };

        // reader.readAsDataURL(currentFile); // run reading
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

    // animation btnUpload and fileInput

    const greenBtn = document.querySelector(".green-btn");
    const yellowBtn = document.querySelector(".yellow-btn");
    const fileInput = document.querySelector("#fileInput");

    yellowBtn.addEventListener('mouseenter', () => {
        greenBtn.classList.add("hovered");
    });

    yellowBtn.addEventListener('mouseleave', () => {
        greenBtn.classList.remove("hovered");
    });

    yellowBtn.addEventListener('click', () => {
        fileInput.click();
    })

    fileInput.addEventListener("change", () => {
        if(fileInput.files.length > 0){
            currentFile = fileInput.files[0];
        } else {
            currentFile = null;
        }
    });

    function showToast(message, BoolStatus) {
        const toast = document.getElementById("toast");
        if(!toast) return;

        toast.textContent = message;
        toast.classList.remove(BoolStatus ? "show-success" : "show-warning");
        setTimeout(() => {
            toast.classList.add(BoolStatus ? "show-success" : "show-warning");
        }, 10);

        setTimeout(() => {
            toast.classList.remove(BoolStatus ? "show-success" : "show-warning");
        }, 3000);
    }
});
