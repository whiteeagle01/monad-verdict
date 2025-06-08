import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
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
          padding: '40px',
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
