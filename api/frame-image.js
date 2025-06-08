import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge'  // ✅ Bu satır zorunlu
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          fontSize: 40,
          background: 'black',
          color: 'white',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Vote for the next crypto champion 🥇
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
