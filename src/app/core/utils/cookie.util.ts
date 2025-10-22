/**
 * Cookie Utility
 * Helper functions to read, write, and delete cookies
 */

/**
 * Get cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameLenPlus = (name.length + 1);
  const cookies = document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => {
      return cookie.substring(0, nameLenPlus) === `${name}=`;
    })
    .map(cookie => {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    });
  
  return cookies.length > 0 ? cookies[0] : null;
}

/**
 * Check if cookie exists
 * @param name Cookie name
 * @returns true if cookie exists, false otherwise
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null;
}

/**
 * Set cookie
 * @param name Cookie name
 * @param value Cookie value
 * @param days Days until expiration (optional)
 * @param path Cookie path (default: '/')
 */
export function setCookie(
  name: string, 
  value: string, 
  days?: number, 
  path: string = '/'
): void {
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
}

/**
 * Delete cookie
 * @param name Cookie name
 * @param path Cookie path (default: '/')
 */
export function deleteCookie(name: string, path: string = '/'): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * Get all cookies as key-value pairs
 * @returns Object with cookie names and values
 */
export function getAllCookies(): { [key: string]: string } {
  const cookies: { [key: string]: string } = {};
  
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  
  return cookies;
}
