export async function openReader(url, book) {
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