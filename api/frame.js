export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    frames: [
      {
        image: "https://monad-verdict.vercel.app/api/frame-image",
        buttons: [
          { label: "Vote", action: "post", target: "https://monad-verdict.vercel.app" }
        ]
      }
    ]
  });
}
