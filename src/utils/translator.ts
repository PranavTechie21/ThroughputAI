// Lightweight page translator using LibreTranslate public instance as default.
// This is a best-effort DOM-based translator for quick whole-page translation.
// Notes / Limitations:
// - React re-renders may overwrite translated DOM; this approach translates DOM nodes after render.
// - Inputs, buttons and non-text content are skipped. Dynamic content may need re-translation on updates.
// - For production, prefer full i18n integration (i18next/react-intl) or pre-translated resource files.

const DEFAULT_API = 'https://libretranslate.de/translate';

async function translateText(text: string, target: string, apiUrl = DEFAULT_API): Promise<string> {
  if (!text || !text.trim()) return text;
  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'text' })
    });
    if (!resp.ok) return text;
    const j = await resp.json();
    // API returns { translatedText: '...' } for many instances
    return j.translatedText || j[0]?.translatedText || text;
  } catch (e) {
    console.warn('translateText error', e);
    return text;
  }
}

export async function translatePage(target: string) {
  if (typeof window === 'undefined' || !document || target === 'en') {
    // restore originals if present
    restoreOriginals();
    return;
  }

  const cacheKey = `__translate_cache_${target}`;
  let cache: Record<string, string> = {};
  try { cache = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch (_) { cache = {}; }

  // gather candidate elements: leaf elements with visible text and not interactive types
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (['script','style','noscript'].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (['input','textarea','select','button'].includes(tag)) return NodeFilter.FILTER_REJECT;
      // skip elements that are likely icons-only or empty
      const txt = (el.textContent || '').trim();
      if (!txt) return NodeFilter.FILTER_REJECT;
      // prefer leaf nodes (no element children) to avoid duplicating translations
      if (el.querySelector('*')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const elems: HTMLElement[] = [];
  let node: Node | null;
  while (node = walker.nextNode()) {
    elems.push(node as HTMLElement);
  }

  // prepare texts to translate, but reuse cache where possible
  const originals: string[] = [];
  const mappingIndex: number[] = [];
  elems.forEach((el, idx) => {
    const orig = el.getAttribute('data-i18n-original') || el.textContent || '';
    if (!el.getAttribute('data-i18n-original')) el.setAttribute('data-i18n-original', orig);
    if (cache[orig]) {
      el.textContent = cache[orig];
    } else {
      mappingIndex.push(idx);
      originals.push(orig);
    }
  });

  // translate originals sequentially (batching could be implemented)
  for (let i = 0; i < originals.length; i++) {
    const orig = originals[i];
    try {
      const translated = await translateText(orig, target);
      const idx = mappingIndex[i];
      const el = elems[idx];
      if (el) el.textContent = translated;
      cache[orig] = translated;
    } catch (e) {
      console.warn('translatePage item failed', e);
    }
  }

  try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch (_) {}
}

// Observe DOM changes and translate newly added nodes automatically
let __i18n_observer: MutationObserver | null = null;

export function startObserving(target: string) {
  if (typeof document === 'undefined') return;
  if (__i18n_observer) __i18n_observer.disconnect();
  __i18n_observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of Array.from(m.addedNodes)) {
        if (!(node instanceof HTMLElement)) continue;
        // translate leaf nodes under this node
        const leaves = Array.from(node.querySelectorAll('*')).filter(el => {
          const tag = el.tagName.toLowerCase();
          const txt = (el.textContent || '').trim();
          return txt && !['input','textarea','select','button','script','style'].includes(tag) && !el.querySelector('*');
        }) as HTMLElement[];
        leaves.forEach(async (el) => {
          const orig = el.getAttribute('data-i18n-original') || el.textContent || '';
          if (!el.getAttribute('data-i18n-original')) el.setAttribute('data-i18n-original', orig);
          const cacheKey = `__translate_cache_${target}`;
          let cache: Record<string,string> = {};
          try { cache = JSON.parse(localStorage.getItem(cacheKey) || '{}'); } catch (_) { cache = {}; }
          if (cache[orig]) {
            el.textContent = cache[orig];
          } else {
            const translated = await translateText(orig, target);
            el.textContent = translated;
            cache[orig] = translated;
            try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch (_) {}
          }
        });
      }
    }
  });
  __i18n_observer.observe(document.body, { childList: true, subtree: true });
}

export function stopObserving() {
  if (__i18n_observer) {
    __i18n_observer.disconnect();
    __i18n_observer = null;
  }
}

/**
 * Translate a resource object (e.g., translations.en) into target language and store in localStorage.
 * Returns an object mapping original->translated.
 */
export async function translateResources(resourceObj: Record<string, any>, target: string) {
  if (target === 'en') {
    try { localStorage.removeItem(`i18n_resources_${target}`); } catch (_) {}
    return {};
  }
  const flat: Record<string,string> = {};
  const queue: string[] = [];

  function flatten(obj: any, prefix = '') {
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === 'string') {
        const key = prefix ? `${prefix}.${k}` : k;
        flat[key] = v;
        queue.push(v);
      } else if (typeof v === 'object' && v !== null) {
        flatten(v, prefix ? `${prefix}.${k}` : k);
      }
    }
  }

  flatten(resourceObj);

  const result: Record<string,string> = {};
  for (let i = 0; i < queue.length; i++) {
    const orig = queue[i];
    try {
      const translated = await translateText(orig, target);
      result[orig] = translated;
    } catch (e) {
      result[orig] = orig;
    }
  }

  try { localStorage.setItem(`i18n_resources_${target}`, JSON.stringify(result)); } catch (_) {}
  return result;
}

export function restoreOriginals() {
  if (typeof document === 'undefined') return;
  const all = document.querySelectorAll('[data-i18n-original]');
  all.forEach((el) => {
    const o = el.getAttribute('data-i18n-original');
    if (o !== null) el.textContent = o;
    el.removeAttribute('data-i18n-original');
  });
}

export default { translatePage, restoreOriginals, startObserving, stopObserving, translateResources };
