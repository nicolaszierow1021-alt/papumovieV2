'use client';

export default function AdBanner() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }</style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '7dd6f54ee740b67788e6f83310c7d455',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://tuxedoarbourannouncement.com/7dd6f54ee740b67788e6f83310c7d455/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <iframe
        srcDoc={adHtml}
        width="300"
        height="250"
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        style={{ border: 'none', maxWidth: '100%' }}
      />
    </div>
  );
}
