import { openReader } from "./reader.js";
import BookStorage from "./storage.js";

export function setupGlobalEvents(plugin) {
    document.addEventListener("click", (e) => {
        const langList = document.getElementById("lang_list");
        const langBtn = document.getElementById("btn_lang");
        const popup = document.getElementById("menuPopup");
        const navIcon = document.querySelector("#btn_navbook img");

        if (document.getElementById("readerModal")) return;
        langList.style.display = "none";
        langBtn.classList.remove("active");
        popup.style.display = "none";
        navIcon.classList.remove("rotated");

        if (!e.target.closest(".book-circle")) {
            setTimeout(() => {
                plugin.isPaused = false;
                plugin.container
                    .querySelectorAll(".book-circle.expanded")
                    .forEach((c) => c.classList.remove("expanded"));
            }, 0);
        }
    });

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
}