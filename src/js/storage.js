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

export default BookStorage;