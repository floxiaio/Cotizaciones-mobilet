import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0f6395" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preload de fuentes */}
        <link
          rel="preload"
          href="/_next/static/media/Inter.var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Estilos de Leaflet */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/mZEZxpoE1vQ1DZ3Ys="
          crossOrigin=""
        />
      </Head>
      <body className="font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
