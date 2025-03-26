// only test

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