// Real Google & Apple OAuth SDK Helpers

// Helper to safely parse and decode JWT ID tokens (Google & Apple OpenID Connect)
export const parseJwt = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error parsing JWT payload:', err);
    return null;
  }
};

// --- Google Identity Services (GIS) Loader & Handler ---
let isGoogleSdkLoaded = false;
let googleSdkPromise = null;

export const loadGoogleSdk = () => {
  if (isGoogleSdkLoaded && window.google?.accounts) {
    return Promise.resolve(window.google);
  }
  if (googleSdkPromise) {
    return googleSdkPromise;
  }

  googleSdkPromise = new Promise((resolve, reject) => {
    // Check if script is already present
    if (document.getElementById('google-gsi-client')) {
      if (window.google?.accounts) {
        isGoogleSdkLoaded = true;
        resolve(window.google);
        return;
      }
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isGoogleSdkLoaded = true;
      resolve(window.google);
    };
    script.onerror = (err) => {
      googleSdkPromise = null;
      reject(new Error('Failed to load Google Identity Services SDK'));
    };
    document.head.appendChild(script);
  });

  return googleSdkPromise;
};

// Trigger Real Google OAuth Authentication
export const triggerGoogleOAuth = async (clientId) => {
  await loadGoogleSdk();

  const googleClientId =
    clientId ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '';

  return new Promise((resolve, reject) => {
    if (!window.google?.accounts?.id && !window.google?.accounts?.oauth2) {
      return reject(new Error('Google Identity SDK not available'));
    }

    if (!googleClientId) {
      // If client ID is not configured in .env yet, open Google OAuth 2.0 authorization endpoint directly in popup
      const redirectUri = window.location.origin;
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        googleClientId || 'YOUR_GOOGLE_CLIENT_ID'
      )}&response_type=token%20id_token&scope=openid%20profile%20email&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&nonce=${Date.now()}`;

      // Open standard OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        oauthUrl,
        'GoogleSignIn',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        return reject(new Error('Popup blocked by browser. Please allow popups.'));
      }

      // Check for message / redirect or prompt user if client ID is missing
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          reject(
            new Error(
              'Google Sign In was closed or VITE_GOOGLE_CLIENT_ID is not configured in .env. Please configure your Google Client ID.'
            )
          );
        }
      }, 1000);
      return;
    }

    try {
      // Initialize GIS with standard callback
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (response.credential) {
            const payload = parseJwt(response.credential);
            if (payload) {
              resolve({
                provider: 'google',
                sub: payload.sub,
                email: payload.email,
                name: payload.name || payload.given_name || payload.email.split('@')[0],
                avatarUrl: payload.picture || '',
                emailVerified: payload.email_verified,
                rawToken: response.credential
              });
            } else {
              reject(new Error('Invalid token payload received from Google'));
            }
          } else {
            reject(new Error('No credential returned from Google Identity Services'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // Also initialize OAuth2 token client for interactive popup
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'openid profile email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            return reject(new Error(tokenResponse.error_description || tokenResponse.error));
          }
          if (tokenResponse.access_token) {
            try {
              // Fetch real user info directly from Google's UserInfo API
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              if (!res.ok) throw new Error('Failed to fetch Google user profile');
              const userInfo = await res.json();
              resolve({
                provider: 'google',
                sub: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name || userInfo.email.split('@')[0],
                avatarUrl: userInfo.picture || '',
                emailVerified: userInfo.email_verified,
                accessToken: tokenResponse.access_token
              });
            } catch (err) {
              reject(err);
            }
          }
        }
      });

      // Request token with popup
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};

// --- Apple Sign in with Apple SDK Loader & Handler ---
let isAppleSdkLoaded = false;
let appleSdkPromise = null;

export const loadAppleSdk = () => {
  if (isAppleSdkLoaded && window.AppleID?.auth) {
    return Promise.resolve(window.AppleID);
  }
  if (appleSdkPromise) {
    return appleSdkPromise;
  }

  appleSdkPromise = new Promise((resolve, reject) => {
    if (document.getElementById('apple-auth-sdk')) {
      if (window.AppleID?.auth) {
        isAppleSdkLoaded = true;
        resolve(window.AppleID);
        return;
      }
    }

    const script = document.createElement('script');
    script.id = 'apple-auth-sdk';
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/auth.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isAppleSdkLoaded = true;
      resolve(window.AppleID);
    };
    script.onerror = () => {
      appleSdkPromise = null;
      reject(new Error('Failed to load Apple Sign-In SDK'));
    };
    document.head.appendChild(script);
  });

  return appleSdkPromise;
};

// Trigger Real Apple Sign In
export const triggerAppleOAuth = async (clientId, redirectUri) => {
  await loadAppleSdk();

  const appleClientId =
    clientId ||
    import.meta.env.VITE_APPLE_CLIENT_ID ||
    '';

  const appleRedirectUri =
    redirectUri ||
    import.meta.env.VITE_APPLE_REDIRECT_URI ||
    window.location.origin;

  return new Promise(async (resolve, reject) => {
    if (!window.AppleID?.auth) {
      return reject(new Error('Apple Sign-In SDK not available'));
    }

    if (!appleClientId) {
      // If Apple Client ID is not configured in .env, open Apple authorization popup
      const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${encodeURIComponent(
        appleClientId || 'com.connect.app.service'
      )}&redirect_uri=${encodeURIComponent(
        appleRedirectUri
      )}&response_type=code%20id_token&response_mode=form_post&scope=name%20email&state=${Date.now()}`;

      const width = 550;
      const height = 650;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        authUrl,
        'AppleSignIn',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        return reject(new Error('Popup blocked by browser. Please allow popups.'));
      }

      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          reject(
            new Error(
              'Apple Sign In was closed or VITE_APPLE_CLIENT_ID is not configured in .env. Please configure your Apple Services ID.'
            )
          );
        }
      }, 1000);
      return;
    }

    try {
      window.AppleID.auth.init({
        clientId: appleClientId,
        scope: 'name email',
        redirectURI: appleRedirectUri,
        state: `connect_apple_${Date.now()}`,
        usePopup: true
      });

      const response = await window.AppleID.auth.signIn();

      if (response && response.authorization) {
        const idToken = response.authorization.id_token;
        const payload = parseJwt(idToken);
        const userObj = response.user; // Provided on first authorization

        let fullName = '';
        if (userObj?.name) {
          fullName = `${userObj.name.firstName || ''} ${userObj.name.lastName || ''}`.trim();
        }

        const email = payload?.email || userObj?.email || '';
        const sub = payload?.sub || response.authorization.code;

        resolve({
          provider: 'apple',
          sub,
          email,
          name: fullName || (email ? email.split('@')[0] : 'Apple User'),
          avatarUrl: '',
          emailVerified: payload?.email_verified === 'true' || payload?.email_verified === true,
          rawToken: idToken
        });
      } else {
        reject(new Error('No authorization data returned from Apple'));
      }
    } catch (err) {
      if (err?.error === 'popup_closed_by_user') {
        reject(new Error('Apple Sign In was cancelled.'));
      } else {
        reject(err);
      }
    }
  });
};
