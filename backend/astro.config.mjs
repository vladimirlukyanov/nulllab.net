import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {defineConfig} from 'astro/config';
import {imageService} from '@unpic/astro/service';

import add_csh_nonce from './src/lib/utils/add_csh_nonce.ts'
import {indexNow} from './src/lib/integration';

import {unified, rehypeHeadingIds} from '@astrojs/markdown-remark';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  outDir: './dist/',
  site: 'https://nulllab.net',
  scopedStyleStrategy: 'where',
  server: {
    host: true,
  },
  integrations: [
    mdx({
      processor: unified({
        rehypePlugins: [rehypeHeadingIds],
      }),
    }),
    sitemap({
      // Keep only canonical, indexable URLs in the sitemap:
      // - /iframe/… are noindex embed fragments
      // - /category/<name>/1/ duplicates /category/<name>/ (canonical points there)
      filter: (page) =>
        !page.includes('/iframe/') && !/\/category\/[^/]+\/1\/?$/.test(page),
    }),
    indexNow({
      key: process.env.INDEXNOW_KEY,
      location: 'indexnow'
    }),
    // (await import("astro-compress")).default({
    //   Image: false,
    // }),
  ],
  image: {
    service: imageService(),
  },
  security: {
    checkOrigin: true,
  },
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  }
});