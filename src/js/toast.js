export function showToast(message, BoolStatus) {
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