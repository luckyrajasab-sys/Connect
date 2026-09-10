import QRCode from 'qrcode';

export const generateQRCodeDataURL = async (text, style = 'standard') => {
  try {
    let colorDark = '#000000';
    let colorLight = '#FFFFFF';

    if (style === 'minimal') {
      colorDark = '#00E5FF';
      colorLight = '#0F172A';
    } else if (style === 'rounded') {
      colorDark = '#FF8800';
      colorLight = '#060913';
    } else if (style === 'gradient') {
      colorDark = '#FF7722';
      colorLight = '#0B0F19';
    } else {
      // Default: Clean High-Contrast Black & White
      colorDark = '#000000';
      colorLight = '#FFFFFF';
    }

    const options = {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: colorDark,
        light: colorLight
      }
    };

    return await QRCode.toDataURL(text, options);
  } catch (err) {
    console.error('Failed to generate QR Code', err);
    return null;
  }
};
