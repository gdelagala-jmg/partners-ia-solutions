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
        in: ['podcast_cover_image', 'podcast_description', 'podcast_email']
      }
    }
  });

  const getSetting = (key: string) => settings.find(s => s.key === key)?.value;

  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  const showTitle = 'IA Solutions';
  const showDescription = getSetting('podcast_description') || 'Podcast sobre inteligencia artificial con noticias, eventos, novedades y herramientas para aplicar en tu vida profesional y personal.';
  const showImage = getSetting('podcast_cover_image') || 'https://i.scdn.co/image/ab6765630000ba8aaf34a3644917ccfc95460a89';
  const showLanguage = 'es-ES';
  const showLink = 'https://open.spotify.com/show/2L0NV7YhTyXzUEcP7VAv7H';
  const showEmail = getSetting('podcast_email') || 'contacto@partners-ia.com';

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
    xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${showTitle}]]></title>
    <description><![CDATA[${showDescription}]]></description>
    <link>${showLink}</link>
    <language>${showLanguage}</language>
    <itunes:author>Partners IA Solutions</itunes:author>
    <itunes:summary><![CDATA[${showDescription}]]></itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Partners IA Solutions</itunes:name>
      <itunes:email>${showEmail}</itunes:email>
    </itunes:owner>
    <itunes:explicit>no</itunes:explicit>
    <itunes:category text="Technology" />
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
