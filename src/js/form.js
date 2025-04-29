import BookStorage from "./storage.js";
import { showToast } from "./toast.js";
import { translations } from "./lang.js";

export function setupForm(plugin) {
    const form = document.getElementById("book-form");
    const fileInput = document.querySelector("#fileInput");

    let currentFile = null;
    const usedFileNames = new Set();

    fileInput.addEventListener("change", () => {
        currentFile = fileInput.files.length > 0 ? fileInput.files[0] : null;
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!currentFile) {
            showToast(translations["toast_no_file"], false);
            console.log("Hello");
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

        await BookStorage.saveBook(currentFile);

        const book = {
            title,
            author,
            genre,
            status,
            fileName: currentFile.name,
        };

        plugin.addBook(book);
        localStorage.setItem("books", JSON.stringify([])); // временно, если что поправим
        usedFileNames.add(currentFile.name);

        form.reset();
        fileInput.value = "";
        currentFile = null;

        showToast(translations["toast_success"], true);
    });
}