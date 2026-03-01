export function getExtenstion(filename: string) {
  return filename.split(".").pop();
}

// Token accessor: set by Auth0Provider wrapper, used by API call utilities
let _getAccessToken: (() => Promise<string>) | null = null;

export function setTokenAccessor(fn: () => Promise<string>): void {
  _getAccessToken = fn;
}

export async function getAccessToken(): Promise<string> {
  if (!_getAccessToken) throw new Error("Auth not initialized");
  return _getAccessToken();
}

// Logout accessor: set by Auth0Provider wrapper, called on session expiry
let _logout: (() => void) | null = null;

export function setLogoutFn(fn: () => void): void {
  _logout = fn;
}

export function triggerSessionExpiredLogout(): void {
  if (_logout) _logout();
}

export async function getAuthHeaders(): Promise<
  { Authorization: string } | Record<string, never>
> {
  try {
    const token = await getAccessToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    // Token retrieval failed — session likely expired.
    // Trigger logout so the user is redirected to login.
    triggerSessionExpiredLogout();
    return {};
  }
}

/**
 * Call after an API response to handle 401 by redirecting to login.
 * Returns true if a 401 was detected (caller should bail out).
 */
export function handleAuthResponse(res: Response): boolean {
  if (res.status === 401) {
    triggerSessionExpiredLogout();
    return true;
  }
  return false;
}

// User email accessor: set by Auth0Provider wrapper, used by loaders
let _userEmail: string | undefined;

export function setUserEmail(email: string | undefined): void {
  _userEmail = email;
}

export function getUserEmail(): string | undefined {
  return _userEmail;
}
