export let translations = {};
export let currentLang = localStorage.getItem("lang") || "ru";

export async function loadLang(lang) {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    localStorage.setItem("lang", lang);
    updateText();
}

loadLang(currentLang);

export function updateText() {
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