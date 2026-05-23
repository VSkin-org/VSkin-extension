import {context, build} from 'esbuild';
import {copyFileSync, mkdirSync, readdirSync} from 'fs';

const isWatch = process.argv.includes('--watch');

const configs = [
    {
        entryPoints: ['src/popup/popup.ts'],
        bundle: true,
        outfile: 'dist/popup/popup.js',
        target: 'chrome110',
        format: 'iife',
    },
    {
        entryPoints: ['src/background/index.ts'],
        bundle: true,
        outfile: 'dist/background/index.js',
        target: 'chrome110',
        format: 'iife',
    },
];

mkdirSync('dist', {recursive: true});
mkdirSync('dist/assets/img', {recursive: true});
mkdirSync('dist/popup', {recursive: true});
mkdirSync('dist/background', {recursive: true});
copyFileSync('manifest.json', 'dist/manifest.json');
readdirSync('src/assets/img').filter((f) => f.endsWith('.png')).forEach((f) => {
    copyFileSync(`src/assets/img/${f}`, `dist/assets/img/${f}`);
});
copyFileSync('src/popup/popup.html', 'dist/popup/popup.html');
copyFileSync('src/popup/popup.css', 'dist/popup/popup.css');

if (isWatch) {
    const contexts = await Promise.all(configs.map((c) => context(c)));
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log('Watching for changes...');
} else {
    await Promise.all(configs.map((c) => build(c)));
    console.log('Build complete.');
}
