// /api/frame-image.tsx
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: 'black',
          color: 'white',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          fontWeight: 'bold',
        }}
      >
        Monad Verdict 🗳️
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
