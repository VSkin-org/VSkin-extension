import {context, build} from 'esbuild';
import {copyFileSync, mkdirSync, readdirSync} from 'fs';

const isWatch = process.argv.includes('--watch');

const configs = [
    {
        entryPoints: ['src/content/inventory/index.ts'],
        bundle: true,
        outfile: 'dist/content/inventory.js',
        target: 'chrome110',
        format: 'iife',
    },
    {
        entryPoints: ['src/content/tradeHistory/index.ts'],
        bundle: true,
        outfile: 'dist/content/tradeHistory.js',
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
copyFileSync('manifest.json', 'dist/manifest.json');
readdirSync('src/assets/img').filter((f) => f.endsWith('.png')).forEach((f) => {
    copyFileSync(`src/assets/img/${f}`, `dist/assets/img/${f}`);
});

if (isWatch) {
    const contexts = await Promise.all(configs.map((c) => context(c)));
    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log('Watching for changes...');
} else {
    await Promise.all(configs.map((c) => build(c)));
    console.log('Build complete.');
}
