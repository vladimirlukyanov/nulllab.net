export function words_limit(input, x, options = {}) {
    // Default options
    const {
        appendEllipsis = false,  // Add "..." if string was truncated
        preservePunctuation = true,  // Keep punctuation attached to words
        strictWordCount = false  // Count hyphenated words as one word
    } = options;

    // Validation
    if (!input || typeof input !== 'string' || x <= 0) return '';

    // Split into words with different strategies
    let words;
    if (preservePunctuation) {
        words = input.trim().match(/(\S+)\s*/g) || [];
    } else {
        words = input.trim().split(/\s+/) || [];
    }

    // Handle hyphenated words if strictWordCount is true
    if (strictWordCount) {
        words = words.slice(0, x);
    } else {
        // Count each hyphenated part as separate words
        let count = 0;
        words = words.filter(word => {
            if (count >= x) return false;
            const subWords = word.split(/[-\/]/);
            count += subWords.length;
            return true;
        });
    }

    // Join the words
    let result = words.join(' ').trim();

    // Add ellipsis if needed
    if (appendEllipsis && input.trim().split(/\s+/).length > x) {
        result += '...';
    }

    return result;
}

export function reading_time(body: string = ''): string {
    const words = body.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200)); // assumes 200 words per minute
    return `${minutes} min read`;
}

/**
 * Calculates reading time from an element's text content
 * and formats it as an ISO 8601 duration (e.g., "PT4M").
 *
 * @param {string} selector - The CSS selector for the body text container.
 * @param {number} wordsPerMinute - Average reading speed (default: 200 WPM).
 * @returns {string} ISO 8601 duration string for schema.org 'timeRequired'.
 */
function reading_time_schema(selector = 'body', wordsPerMinute = 200) {
    const element = document.querySelector(selector);
    if (!element) return 'PT0M';

    // 1. Extract clean text and strip extra whitespace
    const text = element.innerText || element.textContent;
    const cleanText = text.trim().replace(/\s+/g, ' ');

    // 2. Count words (handling empty blocks safely)
    const wordCount = cleanText ? cleanText.split(' ').length : 0;

    // 3. Compute raw minutes (rounding up to avoid a "0 minute" read)
    const minutes = Math.ceil(wordCount / wordsPerMinute);

    // 4. Return as ISO 8601 Duration format (e.g., PT[X]M)
    return `PT${minutes}M`;
}