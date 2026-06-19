import { config } from '../config.js';
import { assert } from './assert.js';

export async function apiRequest(driver, { method = 'GET', path, token, body, headers = {} }) {
  const url = `${config.apiUrl}${path}`;

  return await driver.executeAsyncScript(
    async function (request, done) {
      try {
        const finalHeaders = {
          Accept: 'application/json',
          ...request.headers
        };

        const options = {
          method: request.method,
          headers: finalHeaders
        };

        if (request.token) {
          finalHeaders.Authorization = `Bearer ${request.token}`;
        }

        if (request.body !== undefined && request.body !== null) {
          finalHeaders['Content-Type'] = 'application/json';
          options.body = JSON.stringify(request.body);
        }

        const response = await fetch(request.url, options);
        const text = await response.text();
        let responseBody = null;

        try {
          responseBody = text ? JSON.parse(text) : null;
        } catch {
          responseBody = text;
        }

        done({
          status: response.status,
          ok: response.ok,
          body: responseBody,
          headers: Object.fromEntries(response.headers.entries())
        });
      } catch (error) {
        done({
          status: 0,
          ok: false,
          body: { success: false, message: error.message }
        });
      }
    },
    { method, url, token, body, headers }
  );
}

export async function uploadProfilePicture(driver, token) {
  const url = `${config.apiUrl}/profile/upload-picture`;

  return await driver.executeAsyncScript(
    async function (request, done) {
      try {
        const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
        const bytes = Uint8Array.from(atob(pngBase64), (char) => char.charCodeAt(0));
        const file = new File([bytes], 'selenium-profile.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(request.url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${request.token}`
          },
          body: formData
        });

        const text = await response.text();
        let responseBody = null;
        try {
          responseBody = text ? JSON.parse(text) : null;
        } catch {
          responseBody = text;
        }

        done({ status: response.status, ok: response.ok, body: responseBody });
      } catch (error) {
        done({ status: 0, ok: false, body: { success: false, message: error.message } });
      }
    },
    { url, token }
  );
}

export function getToken(loginResponse) {
  const data = loginResponse?.body?.data || {};
  return data.token || data.accessToken || loginResponse?.body?.token || loginResponse?.body?.accessToken;
}

export async function registerUser(driver, { name, email, password }) {
  return apiRequest(driver, {
    method: 'POST',
    path: '/auth/register',
    body: { name, email, password, confirmPassword: password }
  });
}

export async function loginUser(driver, { email, password }) {
  const login = await apiRequest(driver, {
    method: 'POST',
    path: '/auth/login',
    body: { email, password }
  });

  const token = getToken(login);
  assert(token, `Login did not return a token. Response: ${JSON.stringify(login.body)}`);

  await driver.executeScript(
    function (jwtToken, userEmail) {
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('authToken', jwtToken);
      localStorage.setItem('user', JSON.stringify({ email: userEmail }));
    },
    token,
    email
  );

  return { login, token };
}

export async function createAuthenticatedUser(driver, prefix = 'selenium') {
  const password = config.password;
  const email = config.reusableEmail || `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;
  const name = config.reusableName;

  const register = await registerUser(driver, { name, email, password });

  if (register.status >= 500 || register.status === 404) {
    throw new Error(`Register failed: ${JSON.stringify(register)}`);
  }

  const { token } = await loginUser(driver, { email, password });

  return { email, password, name, token };
}
