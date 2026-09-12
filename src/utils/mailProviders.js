export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const openMailProvider = (provider, email, name) => {
  if (!email) return;

  const subject = encodeURIComponent(`Hello ${name || ''}`.trim());
  const encodedEmail = encodeURIComponent(email);
  const isMobile = isMobileDevice();

  const tryDeepLink = (deepLink, fallbackUrl) => {
    const start = Date.now();
    
    // Attempt to open deep link
    window.location.href = deepLink;

    // Set timeout to open fallback if deep link fails
    setTimeout(() => {
      // If document is not hidden and the timeout fired roughly on time,
      // it means the deep link likely failed and we are still in the browser.
      if (!document.hidden && Date.now() - start < 1000) {
        window.open(fallbackUrl, '_blank');
      }
    }, 600);
  };

  switch (provider) {
    case 'gmail': {
      const fallbackUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${subject}`;
      if (isMobile) {
        const deepLink = `googlegmail://co?to=${encodedEmail}&subject=${subject}`;
        tryDeepLink(deepLink, fallbackUrl);
      } else {
        window.open(fallbackUrl, '_blank');
      }
      break;
    }
    case 'outlook': {
      const fallbackUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodedEmail}&subject=${subject}`;
      if (isMobile) {
        const deepLink = `ms-outlook://compose?to=${encodedEmail}&subject=${subject}`;
        tryDeepLink(deepLink, fallbackUrl);
      } else {
        window.open(fallbackUrl, '_blank');
      }
      break;
    }
    case 'default':
    default: {
      const mailtoLink = `mailto:${encodedEmail}?subject=${subject}`;
      if (isMobile) {
        window.location.href = mailtoLink;
      } else {
        // Desktop `mailto:` behavior
        window.location.href = mailtoLink;
      }
      break;
    }
  }
};
