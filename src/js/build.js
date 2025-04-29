const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { sassPlugin } = require('esbuild-sass-plugin');

fs.copyFileSync('src/index.html', 'dist/index.html');


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

copyFolderRecursive('src/fonts', 'dist/fonts');
copyFolderRecursive('src/icons', 'dist/icons');
copyFolderRecursive('src/img', 'dist/img');
copyFolderRecursive('src/lang', 'dist/lang');

esbuild.build({
    entryPoints: ['src/scss/style.scss'],
    bundle: true,
    outdir: 'dist/css',
    minify: true,
    plugins: [sassPlugin()],
    loader: { '.scss': 'css' },
}).then(() => {
    console.log('🎨 SCSS -> CSS готово!');
}).catch(() => process.exit(1));

esbuild.build({
    entryPoints: ['src/js/script.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: true,
    sourcemap: true,
}).then(() => {
    console.log("✅ Сборка завершена. Открывай dist/index.html через сервер");
}).catch(() => process.exit(1));
