export function setupFileUpload() {
    const greenBtn = document.querySelector(".green-btn");
    const yellowBtn = document.querySelector(".yellow-btn");
    const fileInput = document.querySelector("#fileInput");

    yellowBtn.addEventListener("mouseenter", () => {
        greenBtn.classList.add("hovered");
    });

    yellowBtn.addEventListener("mouseleave", () => {
        greenBtn.classList.remove("hovered");
    });

    yellowBtn.addEventListener("click", () => {
        fileInput.click();
    });
}