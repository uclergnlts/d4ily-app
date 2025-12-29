import { notFound } from "next/navigation"
import { getDigestByDate, formatDateTR } from "@/lib/digest-data"
import type { Metadata } from "next"

export const revalidate = 3600

// AMP Boilerplate CSS (minified)
const ampBoilerplate = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`

const ampNoScriptBoilerplate = `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`

// Custom AMP styles
const ampCustomStyles = `
  body { font-family: Georgia, serif; margin: 0; padding: 0; background: #fafafa; color: #1a1a1a; }
  .header { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 16px; text-align: center; }
  .logo { font-size: 24px; font-weight: 700; color: #f97316; text-decoration: none; }
  .container { max-width: 680px; margin: 0 auto; padding: 24px 16px; }
  .meta { text-align: center; color: #666; font-size: 14px; margin-bottom: 24px; }
  h1 { font-size: 28px; line-height: 1.3; margin: 0 0 16px; text-align: center; }
  .intro { font-size: 18px; color: #555; text-align: center; margin-bottom: 32px; line-height: 1.6; }
  .content { font-size: 17px; line-height: 1.8; }
  .content h2 { font-size: 22px; margin: 32px 0 16px; border-bottom: 2px solid #f97316; padding-bottom: 8px; }
  .content h3 { font-size: 18px; margin: 24px 0 12px; color: #333; }
  .content p { margin: 0 0 16px; }
  .content ul, .content ol { margin: 0 0 16px; padding-left: 24px; }
  .content li { margin-bottom: 8px; }
  .content strong { color: #000; }
  .cta { text-align: center; margin: 40px 0; }
  .cta a { display: inline-block; background: #f97316; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; }
  .footer { text-align: center; padding: 32px 16px; border-top: 1px solid #e5e5e5; color: #888; font-size: 14px; }
  .footer a { color: #f97316; text-decoration: none; }
  amp-img { max-width: 100%; }
`

function isValidDateFormat(date: string): boolean {
  if (!date || date.length !== 10) return false
  const parts = date.split("-")
  if (parts.length !== 3) return false
  const year = Number.parseInt(parts[0])
  const month = Number.parseInt(parts[1])
  const day = Number.parseInt(parts[2])
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false
  if (year < 2020 || year > 2100) return false
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  return true
}

// Convert markdown-like content to AMP-safe HTML
function contentToAmpHtml(content: string): string {
  if (!content) return ''

  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Line breaks to paragraphs
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      // Don't wrap if already a heading
      if (p.startsWith('<h')) return p
      // Handle list items
      if (p.startsWith('- ') || p.startsWith('* ')) {
        const items = p.split('\n').map(item =>
          `<li>${item.replace(/^[-*] /, '')}</li>`
        ).join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`
    })
    .join('\n')

  return html
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const resolvedParams = await params
  const date = resolvedParams.date

  if (!isValidDateFormat(date)) {
    notFound()
  }

  const digest = await getDigestByDate(date)

  if (!digest) {
    notFound()
  }

  const formattedDate = formatDateTR(date)
  const ampContent = contentToAmpHtml(digest.content)
  const canonicalUrl = `https://d4ily.com/${date}`
  const ampUrl = `https://d4ily.com/amp/${date}`

  // AMP pages must return raw HTML, not use React rendering for the document structure
  const ampHtml = `<!doctype html>
<html amp lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <title>${digest.title || 'Gündem Özeti'} - ${formattedDate} | D4ily</title>
  <meta name="description" content="${digest.intro || 'Türkiye gündem özeti'}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="amphtml" href="${ampUrl}">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  ${digest.cover_image_url ? '<script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js"></script>' : ''}
  <style amp-boilerplate>${ampBoilerplate}</style>
  <noscript><style amp-boilerplate>${ampNoScriptBoilerplate}</style></noscript>
  <style amp-custom>${ampCustomStyles}</style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "${digest.title || 'Gündem Özeti'}",
    "description": "${digest.intro || ''}",
    "datePublished": "${digest.created_at || date}",
    "dateModified": "${digest.updated_at || digest.created_at || date}",
    "author": {"@type": "Organization", "name": "D4ily"},
    "publisher": {
      "@type": "Organization",
      "name": "D4ily",
      "logo": {"@type": "ImageObject", "url": "https://d4ily.com/icons/icon-512x512.jpg"}
    },
    "mainEntityOfPage": "${canonicalUrl}"
  }
  </script>
</head>
<body>
  <header class="header">
    <a href="https://d4ily.com" class="logo">D4ily</a>
  </header>
  
  <main class="container">
    <div class="meta">${formattedDate}</div>
    <h1>${digest.title || 'Gündem Özeti'}</h1>
    
    ${digest.intro ? `<p class="intro">${digest.intro}</p>` : ''}
    
    ${digest.cover_image_url ? `
    <amp-img 
      src="${digest.cover_image_url}" 
      width="680" 
      height="400" 
      layout="responsive"
      alt="${digest.title || 'Gündem'}">
    </amp-img>
    ` : ''}
    
    <article class="content">
      ${ampContent}
    </article>
    
    <div class="cta">
      <a href="${canonicalUrl}">Tam Sürümü Görüntüle</a>
    </div>
  </main>
  
  <footer class="footer">
    <p>© ${new Date().getFullYear()} <a href="https://d4ily.com">D4ily</a> - Türkiye Gündem Özeti</p>
    <p>Her gün 07:00'da yeni özet</p>
  </footer>
</body>
</html>`

  return new Response(ampHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
