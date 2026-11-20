# GRTC | Integrated Marble & Gold Website V3

## Pages
- `index.html`: original nautilus hero and homepage
- `services.html`: five-service directory
- `advising.html`, `connected-spaces.html`, `readiness.html`, `digital-presence.html`, `simplification.html`: individual service detail pages
- `about.html`: collective-first About, founder professional history, factual text-only employer names
- `approach.html`: Explore / Expand / Partner
- `contact.html`: direct email (mailto) plus a link to the guided conversation
- `conversation.html`: guided six-step questionnaire, editable generated message, two delivery methods
- `privacy.html`: starter privacy disclosure

## Launch checklist
1. Contact is email-only: the guided conversation assembles a message and opens it in the visitor's own email app, Gmail or Outlook.com, addressed to `recipientEmail` in `config.js`. No form service is used.
2. Test the email-app, Gmail, Outlook.com and Copy routes on desktop and mobile.
3. Add your approved LinkedIn portrait as a local file and update the About page placeholder. Do not hotlink a LinkedIn image.
4. Review employment titles, program scale and corporate descriptions for accuracy. Former employers are text-only factual references to the founder's past roles; no endorsement is claimed. Do not add corporate logos or proprietary screenshots without authorization.
5. The original hero asset has embedded text/navigation. Consider supplying a clean background export before publication to avoid duplicated text and improve mobile legibility.
6. Review the privacy page after final form, analytics and hosting decisions.
7. Upload the contents of this ZIP to the GitHub repository root. GitHub Settings → Pages → Deploy from branch → main → /(root). No framework or build pipeline required.
8. Configure a custom domain separately when ready; follow GitHub's DNS and HTTPS guidance.

## Notes
The guided questionnaire does not store answers locally or transmit them until the visitor chooses a delivery action. Delivery is always from the visitor's own email.

## Collective philosophy update
The About page explains the nautilus/golden ratio as proportional growth, how a focused consultancy coordinates vendors and specialists, and how enterprise discipline becomes measurable roadmaps for nontechnical clients. Vendor relationships and external specialists are not presented as formal partnerships.

## Publication status
This is a complete GitHub-ready upload package, **not** a repository push. GitHub account connection and repository access are required for direct upload.

## Full site preview
Open `index.html` in the downloaded folder to see the complete site. The separate single-file HTML preview provided alongside this ZIP embeds every page and routes internal links without a server.

The supplied founder portrait is included in `assets/founder.jpg` and displayed on About.

## V4 redesign (Apple clarity × engineered system)
- Shared design layer appended to `styles.css` (V4 section); earlier layers left intact underneath.
- `site.js` adds the mobile hamburger menu (≤900px): full-screen panel, focus moves into the menu, Tab is trapped, Escape/links close it, `inert` hides it from screen readers when closed. Without JavaScript the original inline nav still shows.
- Standard header (with `aria-current`), skip link and footer on every page; one Facebook URL site-wide; footer links to every service and the founder page.
- Service pages have previous/next service links.
- Hero artwork unchanged; `assets/hero-800.webp` and `assets/hero-1670.webp` (38 KB / 106 KB) are served to supporting browsers, `hero.png` remains the fallback.
- Every page has a unique meta description, canonical URL and Open Graph tags.
