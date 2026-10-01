import { context } from 'esbuild'
import { copyFileSync, mkdirSync } from 'node:fs'

mkdirSync('dist', { recursive: true })
copyFileSync('index.html', 'dist/index.html')

const build = await context({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  minify: process.argv.includes('--watch') ? false : true,
  sourcemap: process.argv.includes('--watch'),
  outfile: 'dist/assets/app.js',
  loader: { '.css': 'css' },
  target: ['es2022'],
  logLevel: 'info',
})

if (process.argv.includes('--watch')) {
  await build.watch()
  console.log('Watching frontend files; serve dist through the Go backend.')
} else {
  await build.rebuild()
  await build.dispose()
}
