/**
 * Polyfill for Promise.try() which is used by pdfjs-dist but not yet
 * available in all browsers/environments.
 */
if (typeof Promise !== "undefined" && !(Promise as any).try) {
  ;(Promise as any).try = function <T>(fn: () => T | PromiseLike<T>): Promise<T> {
    return new Promise<T>((resolve) => resolve(fn()))
  }
}

export {}
