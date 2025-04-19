const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Копирование index.html
fs.copyFileSync('src/index.html', 'dist/index.html');

// Копирование всех файлов из src/css → dist/css (и аналогично fonts/img/lang)
function copyFolderRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
copyFolderRecursive('src/css', 'dist/css');
copyFolderRecursive('src/fonts', 'dist/fonts');
copyFolderRecursive('src/icons', 'dist/icons');
copyFolderRecursive('src/img', 'dist/img');
copyFolderRecursive('src/lang', 'dist/lang');

esbuild.build({
    entryPoints: ['src/js/script.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: true,
    sourcemap: true,
}).then(() => {
    console.log("✅ Сборка завершена. Открывай dist/index.html через сервер");
}).catch(() => process.exit(1));
