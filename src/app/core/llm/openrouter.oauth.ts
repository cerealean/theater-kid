export async function startOpenRouterPKCE(callbackUrl: string) {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hexArray = Array.from(randomBytes, byte => ('0' + byte.toString(16)).slice(-2));
  const codeVerifier = hexArray.join('');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  sessionStorage.setItem('or_code_verifier', codeVerifier);
  const url = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  location.href = url;
}
export async function finishOpenRouterPKCE(): Promise<string|null> {
  const code = new URLSearchParams(location.search).get('code');
  if (!code) return null;
  const code_verifier = sessionStorage.getItem('or_code_verifier') ?? '';
  const r = await fetch('https://openrouter.ai/api/v1/auth/keys', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier, code_challenge_method: 'S256' }),
  });
  const j = await r.json();
  history.replaceState({}, '', location.pathname);
  return j.key ?? null;
}