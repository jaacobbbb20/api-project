import Cookies from 'js-cookie';

// Wrapper for fetch that includes CSRF token
export async function csrfFetch(url, options = {}) {
  // Default method is GET
  options.method = options.method || 'GET';

  // Default headers object
  options.headers = options.headers || {};

  // Attach CSRF token and Content-Type for non-GET methods
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  // Execute fetch
  const res = await window.fetch(url, options);

  // Throw response object on error
  if (res.status >= 400) throw res;

  return res;
}

// call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
