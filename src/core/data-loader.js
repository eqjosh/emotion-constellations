/**
 * Load and parse constellation data.
 * Supports i18n via locale parameter (defaults to 'en').
 */

export async function loadConstellationData(locale = 'en') {
  const url = `${import.meta.env.BASE_URL}data/constellation-${locale}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    // Fallback to English if locale not found
    if (locale !== 'en') {
      console.warn(`Locale '${locale}' not found, falling back to English`);
      return loadConstellationData('en');
    }
    throw new Error(`Failed to load constellation data: ${response.statusText}`);
  }

  const data = await response.json();
  return processData(data);
}

/**
 * Process raw JSON into runtime-friendly structures.
 * Pre-computes lookups and color vectors.
 */
function processData(data) {
  const needsById = new Map();

  for (const need of data.needs) {
    needsById.set(need.id, need);
  }

  // Enrich emotions with resolved need references
  const emotions = data.emotions.map(emotion => ({
    ...emotion,
    links: emotion.links.map(link => ({
      ...link,
      need: needsById.get(link.needId),
    })),
  }));

  return {
    needs: data.needs,
    emotions,
    needsById,
    meta: data.meta,
  };
}
