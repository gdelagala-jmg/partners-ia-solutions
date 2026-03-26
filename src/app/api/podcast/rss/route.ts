import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const episodes = await prisma.podcastEpisode.findMany({
    orderBy: { pubDate: 'desc' },
    take: 100,
  });

  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ['podcast_cover_image', 'podcast_description', 'podcast_email', 'podcast_author', 'podcast_category']
      }
    }
  });

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value;

  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  const showTitle = 'IA Solution - Partners IA Solutions';
  const showDescription = getSetting('podcast_description') || 'Explora las últimas noticias sobre inteligencia artificial, automatizaciones y herramientas innovadoras con IA Solutions. Información diaria para el profesional moderno.';
  const showAuthor = getSetting('podcast_author') || 'Partners IA Solutions';
  const showImage = getSetting('podcast_cover_image') || 'https://gogiwitxbidr7wlk.public.blob.vercel-storage.com/1774528978390-podcast_cover_ias_1774522790637.png';
  const showLanguage = 'es-ES';
  const showLink = 'https://open.spotify.com/show/2L0NV7YhTyXzUEcP7VAv7H';
  const showEmail = getSetting('podcast_email') || 'contacto@partners-ia.com';
  const showCategory = getSetting('podcast_category') || 'Technology';

  const rssItems = episodes
    .map((ep) => {
      const pubDate = ep.pubDate.toUTCString();
      return `
    <item>
      <title><![CDATA[${ep.title}]]></title>
      <description><![CDATA[${ep.description}]]></description>
      <link>${ep.link || showLink}</link>
      <guid isPermaLink="false">${ep.guid}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${ep.audioUrl}" length="${ep.fileSize || 0}" type="audio/mpeg" />
      <itunes:summary><![CDATA[${ep.description}]]></itunes:summary>
      <itunes:duration>${ep.duration || 0}</itunes:duration>
      <itunes:image href="${ep.coverImage || showImage}" />
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" 
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${baseUrl}/api/podcast/rss" rel="self" type="application/rss+xml" />
    <title>${showTitle}</title>
    <description>${showDescription}</description>
    <link>${showLink}</link>
    <language>${showLanguage}</language>
    <copyright>Partners IA Solutions</copyright>
    <itunes:author>${showAuthor}</itunes:author>
    <itunes:summary>${showDescription}</itunes:summary>
    <itunes:explicit>no</itunes:explicit>
    <itunes:category text="${showCategory}" />
    <itunes:image href="${showImage}" />
    <image>
      <url>${showImage}</url>
      <title>${showTitle}</title>
      <link>${showLink}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
