export function setupNav(plugin) {
    const navBtn = document.getElementById("btn_navbook");
    const navIcon = document.querySelector("#btn_navbook img");

    navBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navIcon.classList.toggle("rotated");
        plugin.setMode(plugin.config.mode === "circular" ? "random" : "circular");
    });
}