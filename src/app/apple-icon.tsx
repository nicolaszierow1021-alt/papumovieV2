import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)',
          borderRadius: '110px',
          border: '12px solid #e50914'
        }}
      >
        <div
          style={{
            fontSize: '340px',
            fontWeight: '900',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            marginTop: '-20px'
          }}
        >
          P
        </div>
      </div>
    ),
    { ...size }
  )
}
