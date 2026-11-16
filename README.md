# Harsha Chandan & Geethika

A bilingual wedding invitation built in React, Vite, TypeScript, Tailwind CSS, and GSAP. The link lands on an embossed burgundy envelope with a scalloped “Open our invitation” seal. The guest taps to part the cover, then watches a silk curtain reveal with animated fireworks, scrolls through the blessing and couple reveal, and touches the heart to open the event details.

## Run locally

Use Node 22 or later.

```bash
npm ci
npm run dev
```

For the optimized build, run `npm run build` and then `npm run preview`. Vite prints the preview address. Serve the build over HTTP.

## Edit the invitation

[src/wedding.ts](src/wedding.ts) contains English and Telugu text, names, family details, event timing, venue, artwork, theme, and audio. Media paths point into `public/`. Place any approved portraits there and assign their URLs under `photos`. Set `mapsUrl` to the host-confirmed Maps pin or navigation link. Until then the invitation uses a labeled search for the printed address.

- The host line uses the printed form “Smt. & Sri Bendalam Lakshmi Venkataramana.” The card does not provide a separate name for the groom’s mother or name grandparents.
- The visible dates and countdown derive from the configuration. For changes outside India, update the time zone and its explicit offset together.
- Update `public/art/social.jpg` if the couple’s names or date change. Vite generates the surrounding social metadata from the configuration.

## AWS S3 and CloudFront

1. Create a private general-purpose S3 bucket with Block Public Access on and Object Ownership set to Bucket owner enforced. Leave S3 static website hosting off.
2. In CloudFront, create a distribution with the bucket’s **regional S3 REST endpoint** as the origin. Create or assign an Origin Access Control that signs requests. Apply the bucket policy CloudFront supplies, scoped to this distribution.
3. Set the default root object to `index.html` and the viewer protocol policy to **Redirect HTTP to HTTPS**. For a custom domain, attach its ACM certificate from `us-east-1`, add the hostname as a CloudFront alternate domain, and set the DNS alias to the distribution.
4. Set the final HTTPS URL before compiling so WhatsApp can fetch an absolute Open Graph image URL.

   ```bash
   VITE_PUBLIC_URL=https://your-wedding-domain.example npm run build
   ```

5. Upload the **contents** of `dist/` to the bucket root. Use the console or AWS CLI with credentials authorized for your bucket.

   ```bash
   aws s3 sync dist/ s3://YOUR_BUCKET/ --exclude index.html
   aws s3 cp dist/index.html s3://YOUR_BUCKET/index.html \
     --content-type 'text/html; charset=utf-8' --cache-control 'no-cache'
   ```

6. After deployment, open the HTTPS root URL on a phone and exercise the entire journey. Check the preview by pasting the public link into WhatsApp. CloudFront and WhatsApp can cache previously shared imagery. For updates invalidate `/`, `/index.html`, and any overwritten `/art/*` paths as needed.

   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID \
     --paths '/' '/index.html' '/art/*'
   ```

AWS documentation for [S3 access through CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) and the [default root object](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html).

See [asset inventory](ASSETS.md) and [test report](TESTING.md).
