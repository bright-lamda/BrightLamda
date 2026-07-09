export const aiChunkingService = {
  chunkText(text: string, maxWords = 220, overlapWords = 35) {
    const words = text.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
      return [];
    }

    const chunks: string[] = [];
    const step = Math.max(1, maxWords - overlapWords);

    for (let start = 0; start < words.length; start += step) {
      const chunk = words.slice(start, start + maxWords).join(' ');
      chunks.push(chunk);

      if (start + maxWords >= words.length) {
        break;
      }
    }

    return chunks;
  },
};
