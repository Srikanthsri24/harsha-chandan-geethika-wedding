import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { wedding } from './src/wedding.ts'

export default defineConfig(({ mode }) => {
  const url = loadEnv(mode, '.', 'VITE_').VITE_PUBLIC_URL?.replace(/\/$/, '')
  const names = `${wedding.en.groom} & ${wedding.en.bride}`
  const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(wedding.date))
  const description = `${wedding.en.family} invites you to the wedding of ${names} on ${date}.`
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
  return {
    plugins: [tailwindcss(), {
      name: 'wedding-metadata',
      transformIndexHtml(html) {
        return html.replace('<!-- metadata -->', [
          `<title>${escape(names)} | The Wedding Invitation</title>`,
          `<meta name="description" content="${escape(description)}">`,
          `<meta property="og:title" content="${escape(names)} | The Wedding Invitation">`,
          `<meta property="og:description" content="${escape(description)}">`,
          '<meta property="og:type" content="website">',
          `<meta property="og:image" content="${escape((url ?? '') + wedding.art.social)}">`,
          '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
          '<meta name="twitter:card" content="summary_large_image">',
          url ? `<meta property="og:url" content="${escape(url)}"><link rel="canonical" href="${escape(url)}">` : '',
          `<link rel="preload" as="image" href="${wedding.art.envelopeMobile}" media="(max-width: 640px)">`,
          `<link rel="preload" as="image" href="${wedding.art.envelope}" media="(min-width: 641px)">`,
        ].join('\n'))
      },
    }],
  }
})
