import { Devotional, BibleVerse } from '../types';

/**
 * Utility functions to format and dispatch biblical verses and daily devotionals
 * to WhatsApp, Instagram, Twitter/X, and clipboard.
 */

export function formatVerseForWhatsApp(verse: {
  text: string;
  reference: string;
  version?: string;
  reflectionShort?: string;
  theme?: string;
}): string {
  const parts: string[] = [];
  parts.push(`✨ *${verse.reference}*${verse.version ? ` (${verse.version})` : ''}`);
  parts.push('');
  parts.push(`"${verse.text}"`);

  if (verse.reflectionShort) {
    parts.push('');
    parts.push(`🕊️ *Reflexão:* ${verse.reflectionShort}`);
  }

  parts.push('');
  parts.push('📖 _Compartilhado pelo Devocional Diário • Palavra & Fé_');

  return parts.join('\n');
}

export function formatVerseForTwitter(verse: {
  text: string;
  reference: string;
}): string {
  // Twitter has a 280 char limit.
  const prefix = `"${verse.text}"\n\n— ${verse.reference}`;
  const suffix = '\n\n#VersiculoDoDia #Biblia #Fe';

  if (prefix.length + suffix.length <= 280) {
    return prefix + suffix;
  }

  const allowedTextLength = 280 - suffix.length - verse.reference.length - 8;
  const truncatedText = verse.text.slice(0, Math.max(20, allowedTextLength)) + '...';
  return `"${truncatedText}"\n— ${verse.reference}${suffix}`;
}

export function formatVerseForInstagram(verse: {
  text: string;
  reference: string;
  version?: string;
  reflectionShort?: string;
}): string {
  const parts: string[] = [
    `📖 ${verse.reference}`,
    '',
    `"${verse.text}"`,
    ''
  ];

  if (verse.reflectionShort) {
    parts.push(`✦ Reflexão: ${verse.reflectionShort}`);
    parts.push('');
  }

  parts.push('🌿 "A tua palavra é lâmpada que ilumina os meus passos e luz que clareia o meu caminho." (Salmos 119:105)');
  parts.push('');
  parts.push('.');
  parts.push('.');
  parts.push('#VersiculoDoDia #BibliaSagrada #DevocionalDiario #PalavraDeDeus #Fe #Esperança #Paz');

  return parts.join('\n');
}

export function formatDevotionalForWhatsApp(devotional: Devotional): string {
  const parts: string[] = [];
  parts.push(`🌿 *DEVOCIONAL DIÁRIO: ${devotional.title.toUpperCase()}*`);
  if (devotional.subtitle) {
    parts.push(`_${devotional.subtitle}_`);
  }
  parts.push('');
  parts.push(`📖 *Palavra-Chave (${devotional.keyVerse.reference}):*`);
  parts.push(`"${devotional.keyVerse.text}"`);
  parts.push('');

  if (devotional.reflection && devotional.reflection.length > 0) {
    parts.push('✦ *Reflexão:*');
    // Include the first paragraph or excerpt
    parts.push(devotional.reflection[0]);
    parts.push('');
  }

  if (devotional.practicalAction) {
    parts.push(`⚡ *Para Praticar Hoje:* ${devotional.practicalAction}`);
    parts.push('');
  }

  if (devotional.prayer) {
    parts.push(`🙏 *Oração do Dia:* "${devotional.prayer}"`);
    parts.push('');
  }

  parts.push(`✍️ _Autor: ${devotional.author}_`);
  parts.push('✨ _Devocional Diário • Edificando vidas na Palavra_');

  return parts.join('\n');
}

export function formatDevotionalForTwitter(devotional: Devotional): string {
  const base = `🌿 ${devotional.title}\n\n"${devotional.keyVerse.text}"\n— ${devotional.keyVerse.reference}`;
  const hashtags = '\n\n#DevocionalDiario #PalavraDeDeus #Biblia';

  if (base.length + hashtags.length <= 280) {
    return base + hashtags;
  }

  const maxVerseLen = 280 - devotional.title.length - devotional.keyVerse.reference.length - hashtags.length - 15;
  const truncatedVerse = devotional.keyVerse.text.slice(0, Math.max(30, maxVerseLen)) + '...';
  return `🌿 ${devotional.title}\n\n"${truncatedVerse}"\n— ${devotional.keyVerse.reference}${hashtags}`;
}

export function formatDevotionalForInstagram(devotional: Devotional): string {
  const parts: string[] = [
    `🌿 ${devotional.title.toUpperCase()}`,
    `${devotional.subtitle}`,
    '',
    `📖 "${devotional.keyVerse.text}" — ${devotional.keyVerse.reference}`,
    ''
  ];

  if (devotional.reflection && devotional.reflection.length > 0) {
    parts.push('✦ Reflexão:');
    parts.push(devotional.reflection.slice(0, 2).join('\n\n'));
    parts.push('');
  }

  if (devotional.prayer) {
    parts.push(`🙏 Oração: "${devotional.prayer}"`);
    parts.push('');
  }

  parts.push('Qual foi a palavra que mais falou ao seu coração hoje? Deixe nos comentários! 👇✨');
  parts.push('');
  parts.push('.');
  parts.push('.');
  parts.push('#DevocionalDiario #PalavraDeDeus #VidaComDeus #ReflexaoCrista #Oracao #BibliaSagrada');

  return parts.join('\n');
}

export function getWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getTwitterShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

export async function shareViaNative(data: {
  title: string;
  text: string;
  url?: string;
}): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (err: any) {
      // If user aborted/cancelled, not a hard error
      if (err.name === 'AbortError') {
        return false;
      }
      console.warn('Native share failed', err);
    }
  }
  return false;
}
