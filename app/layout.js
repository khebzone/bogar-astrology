import './globals.css';

export const metadata = {
  title: 'Maharishi Parthibangovindharaj | Bogar Astrology Research Centre Chennai',
  description: 'Divine Vedic Astrology, Numerology, Gemology & Vastu consultations by Maharishi Parthibangovindharaj (M.A., M.Phil.). Bogar Astrology Research Centre, Chennai. Online & Offline consultations in Tamil & English.',
  keywords: 'Astrologer Chennai, Bogar Astrology, Maharishi Parthibangovindharaj, Vedic Astrology, Numerology, Gemology, Vastu Shastra, Marriage Porutham, Tamil Astrology',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕉️</text></svg>',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Tamil:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
