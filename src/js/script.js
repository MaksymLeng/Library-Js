import RotatingCircles from "https://cdn.jsdelivr.net/gh/MaksymLeng/rotating-circles-plugin/dist/circle-plugin.min.js";

const BookStorage = (function () {
    const dbName = 'lmgLibraryDB';
    const storeName = 'books';
    let db;

    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);
            request.onerror = () => reject('Ошибка IndexedDB');
            request.onsuccess = () => {
                db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(storeName, { keyPath: 'name' });
            };
        });
    }

    async function saveBook(file) {
        if (!db) await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const book = {
                name: file.name,
                type: file.type,
                data: file
            };
            const request = store.put(book);
            request.onsuccess = () => resolve();
            request.onerror = () => reject('Ошибка при сохранении книги');
        });
    }

    async function getBook(name) {
        if (!db) await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.get(name);
            request.onsuccess = () => resolve(request.result?.data || null);
            request.onerror = () => reject('Ошибка при получении книги');
        });
    }

    return {
        saveBook,
        getBook
    };
})();

//Change language function control

let translations = {};
let currentLang = localStorage.getItem("lang") || "ru";

async function loadLang(lang) {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem("lang", lang);
    updateText();
}

loadLang(currentLang);

function updateText() {
    // Текстовые элементы с data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[key]) el.innerText = translations[key];
    });

    // Input/textarea по id
    ["title", "author", "genre", "addBtn"].forEach(id => {
        const el = document.getElementById(id);
        if(!el || !translations[id]) return;

        if (el.tagName === "INPUT") {
            el.placeholder = translations[id];
        }else if(el.tagName === "BUTTON") {
            el.innerText = translations[id];
        }
    });

    // Select options по value
    document.querySelectorAll("select option").forEach(opt => {
        const value = opt.value;
        if (translations[value]) {
            opt.textContent = translations[value];
        }
    });
}

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
        radius: 300,
        speed: 0.01
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentFile) {
            showToast(translations["toast_no_file"], false);
            return;
        }

        if (usedFileNames.has(currentFile.name)) {
            showToast(translations["toast_duplicate_file"], false);
            return;
        }

        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const genre = document.getElementById("genre").value.trim();
        const status = document.getElementById("status").value.trim();

        if (!title || !author) return;

        // Сохраняем файл в IndexedDB через BookStorage
        await BookStorage.saveBook(currentFile);

        const book = {
            title,
            author,
            genre,
            status,
            fileName: currentFile.name
        };

        plugin.addBook(book);
        localStorage.setItem("books", JSON.stringify(books));
        usedFileNames.add(currentFile.name);

        form.reset();
        fileInput.value = "";
        currentFile = null;

        showToast(translations["toast_success"], true);
    });

    // change language btn control

    const langBtn = document.getElementById("btn_lang");
    const langList = document.getElementById("lang_list");

    function toogleLangList(show) {
        const items = [...langList.querySelectorAll("li")];

        if (show) {
            langList.style.display = "block";

        } else {
            setTimeout(() => {
                langList.style.display = "none";
            }, items.length * 50 + 300);
        }

        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.toggle("visible");
            }, index * 50);
        });
    }



    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langList.style.display === "block" ? toogleLangList(0) : toogleLangList(1);
        langBtn.classList.toggle("active");
        langList.querySelectorAll("li").forEach((item) => {
            item.addEventListener("click", () => {
                const lang = item.dataset.lang;
                loadLang(lang);
            })
        })
    });

    document.addEventListener("click", (e) => {
        if (document.getElementById("readerModal")) return;
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

    window.addEventListener("book-open-requested", async (e) => {
        const { fileName, book } = e.detail;

        const file = await BookStorage.getBook(fileName);
        if (!file) {
            alert("Файл не найден");
            return;
        }

        const url = URL.createObjectURL(file);
        openReader(url, book);
    });

    function openReader(url, book) {
        let modal = document.getElementById("readerModal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "readerModal";

            const viewer = document.createElement("div");
            viewer.id = "readerViewer";
            modal.appendChild(viewer);

            if (book.fileName && book.fileName.endsWith(".epub")) {
                    viewer.innerHTML = "";

                    // Инициализируем книгу через epub.js
                    const bookInstance = ePub(url);
                    const rendition = bookInstance.renderTo("readerViewer", {
                        width: "80%",
                        height: "80%"
                    });

                    // После готовности книги
                    bookInstance.ready.then(() => {
                        rendition.display();
                    }).catch(err => {
                        console.error("❌ Ошибка при открытии книги:", err);
                    });
            } else if (book.fileName.endsWith(".pdf")) {
                const iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.style.width = "80vw";
                iframe.style.height = "80vh";
                iframe.style.border = "none";
                viewer.appendChild(iframe);
            }else {
                viewer.innerHTML = "<p style = 'color: white'> Неподерживаемый формат файла</p>";
            }

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "×";
            closeBtn.classList.add("close-btn");
            closeBtn.addEventListener("click", () => {
                document.body.removeChild(modal);
                URL.revokeObjectURL(url); // очищаем память
            });
            modal.appendChild(closeBtn);

            document.body.appendChild(modal);
        }
    }
});
