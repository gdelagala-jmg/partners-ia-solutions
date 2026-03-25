import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { slugify } from './slugify';

interface PodcastSyncParams {
  title: string;
  content: string;
  audioUrl: string; // URL from NotebookLM
  newsPostId?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export async function syncPodcastToFeed({
  title,
  content,
  audioUrl,
  newsPostId,
  sourceName = 'IA Solutions', // Default or extracted
  sourceUrl,
}: PodcastSyncParams) {
  try {
    // 1. Download and persist the audio to Vercel Blob (permanent storage)
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`Failed to fetch audio from ${audioUrl}`);
    
    const audioBuffer = await response.arrayBuffer();
    const filename = `podcast/${slugify(title)}.mp3`;
    
    const blob = await put(filename, audioBuffer, {
      access: 'public',
      contentType: 'audio/mpeg',
    });

    // 2. Format the description as per user's style
    // Para 1: First paragraph of content (sanitized)
    const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
    const summary = paragraphs[0] || '';
    
    const description = `${summary}\n\nFuente: IA Solutions\n\nFuente: ${sourceName || 'Original'}`;

    // 3. Create the PodcastEpisode record
    const episode = await prisma.podcastEpisode.create({
      data: {
        title,
        description,
        audioUrl: blob.url,
        fileSize: audioBuffer.byteLength,
        link: sourceUrl || (newsPostId ? `/noticias/${newsPostId}` : undefined),
        guid: slugify(title) + '-' + Date.now(),
      },
    });

    return episode;
  } catch (error) {
    console.error('Error syncing podcast:', error);
    throw error;
  }
}
