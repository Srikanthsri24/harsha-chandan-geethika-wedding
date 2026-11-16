# Testing report

## Reference review

Decoded the supplied 26-second reel and reviewed half-second contact sheets across its full duration. The key movements are the seal release, two cover halves separating, a brief closed-curtain hold, the curtain draw, the staged invitation reveal, the interactive heart, and the scroll to event and map information. The implementation uses live HTML, CSS, SVG, and GSAP. The supplied video and printed card are reference material.

Compared the English and Telugu panels of the supplied printed card. Confirmed the couple, both name forms for the bride, the date, evening muhurtham, dinner start, the printed address, the host line, the named bride’s parents, the printed invocation, and the complimentary lines. The province and country in the address follow the supplied project details.

## Browser checks

Chrome with Playwright exercised the production build in desktop (1440 × 900), tablet (820 × 1180), Pixel 7, iPhone 13 layout, and compact mobile (320 × 568) viewports. These are browser-emulated mobile viewports. Reviewed captured mobile screens for the cover, curtains, blessing, couple introduction, date, closing, and Telugu typesetting, and desktop captures of the cover, blessing, and couple introduction.

- Tested touch and keyboard entry, gate animation completion, focus handoff, scrolling, heart interaction and access to wedding details, and replay. A separate run opened and replayed the full animation twice.
- Verified the landing shows the sealed burgundy envelope and an opening prompt. The couple’s names first appear in the fireworks reveal. Verified a tap far from the seal opens the cover. Checked the cloth draw and the opening fireworks sequence, including active fountains, aerial bursts, the title hold, and the transition to the blessing. Verified moving Vinayaka artwork and staggered words during the blessing animation.
- Verified both language modes and horizontal viewport bounds.
- Checked countdown updates across Asia/Kolkata, America/Los_Angeles, and Pacific/Auckland, including the post-muhurtham state. Verified the ceremony instant is 14:28 UTC.
- Verified the original audio plays on interaction and pauses on mute.
- Verified the personalized WhatsApp URL and both Google Maps button destinations. No message was sent.
- Verified reduced motion skips the gate timeline and keeps the heart interaction functional.
- Checked production network and browser logs for missing assets and errors. Axe's automated WCAG A/AA checks reported zero violations on the open desktop invitation.
- TypeScript and Vite production build completed. A separate test build with a sample HTTPS URL generated absolute canonical and Open Graph URLs.

## Before sharing with guests

- Supply an exact Google Maps pin to replace the labeled address-search link. The address comes from the card, but an exact event entrance could not be independently verified.
- Set the public HTTPS URL and rebuild using the deployment guide. WhatsApp's live crawler preview and the AWS deployment require the actual public address.
- Physical-device Safari and WhatsApp in-app browser playback were outside this test run.
- Portraits and additional family names can be added if supplied. The build uses original illustration and preserves the host line as printed.

The chapter revision was checked on a mobile viewport for two independent diya ignitions, moving petals, staggered blessing words, the transition to the names, heart ripples, and the ladle serving animation. Verified that the calendar button is absent.

The layout revision checked Chrome at 320×568, 390×844, 768×1024, 1280×720, 1440×900, 1920×1080, 2560×1440 and 3840×2160. Checks covered the envelope, horizontal overflow in both languages, the dinner artwork spanning its scene, and the ceremony, venue and closing content staying within the viewport. The 1440p and 4K dimensions represent large desktop layouts with browser emulation. The existing illustrations scale up at the widest sizes.

Checked the illustrated family panels and the two namaste images in both languages at 320×568, 390×844, 768×1024, 1440×900 and 3840×2160. Verified that the artwork loads, the English headings use Instrument Serif, and the closing controls remain visible.

The final responsive checks covered 15 Chrome viewports from 320×568 through 3840×2160, including 568×320 and 844×390 landscape, and both sides of the 650 px closing layout breakpoint. Checked text bounds in English and Telugu and the animated opening on both landscape sizes. Corrected the ceremony time overflow in Telugu and tightened the title layout on short landscape screens.
