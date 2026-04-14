import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AnywherePT — Health is Wealth';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A1F1B 0%, #0A4830 40%, #0A6847 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-2px',
            }}
          >
            AnywherePT
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#22C55E',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            Health is Wealth
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#99F6E4',
              marginTop: '16px',
              maxWidth: '600px',
              textAlign: 'center',
            }}
          >
            Australia&apos;s marketplace for verified personal trainers
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
