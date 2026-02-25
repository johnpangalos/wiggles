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

export async function getAuthHeaders(): Promise<
  { Authorization: string } | Record<string, never>
> {
  try {
    const token = await getAccessToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

// User email accessor: set by Auth0Provider wrapper, used by loaders
let _userEmail: string | undefined;

export function setUserEmail(email: string | undefined): void {
  _userEmail = email;
}

export function getUserEmail(): string | undefined {
  return _userEmail;
}
