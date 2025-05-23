import { loadLang } from "../lang.js";

export function setupLangSelector() {
    const langBtn = document.getElementById("btn_lang");
    const langList = document.getElementById("lang_list");

    function toggleLangList(show) {
        const items = [...langList.querySelectorAll("li")];
        if (show) {
            langList.style.display = "block";
        } else {
            setTimeout(() => {
                langList.style.display = "none";
            }, items.length * 50 + 200);
        }
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.toggle("visible", show);
            }, index * 50);
        });
    }

    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langList.style.display === "block" ? toggleLangList(false) : toggleLangList(true);
        langBtn.classList.toggle("active");
        langList.querySelectorAll("li").forEach((item) => {
            item.addEventListener("click", () => {
                const lang = item.dataset.lang;
                loadLang(lang);
                toggleLangList(false);
            });
        });
    });
}