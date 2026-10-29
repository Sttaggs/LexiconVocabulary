# Lexicon — Vocabulary Training

Lexicon is a standalone, vocabulary-focused web application built with plain HTML, CSS, and JavaScript. Its source code is stored in GitHub and can be hosted as static assets through Cloudflare Workers.

## Current functionality

- Responsive dark interface using black \`#000000\`, blue \`#1CBFFF\`, white \`#FFFFFF\`, charcoal \`#171717\`, and gray \`#A3A3A3\`.
- A curated 200-word library across five difficulty tiers.
- Definition Challenge with **Quick Play (5 questions)** and **Standard Training (10 questions)**.
- Four shuffled multiple-choice definitions, answer feedback, explanations, and example sentences.
- XP rewards, player levels, daily learning goals, a practice streak, and session results.
- Adaptive difficulty recommendation based on sustained accuracy, with manual difficulty selection.
- Scheduled review of previously studied words; an incorrect answer creates an earlier review.
- Word collection, bookmarks, learning histories, training statistics, and review dates.
- Progress saved locally in the browser, including an unfinished session; JSON export/import is available in Settings.
- A web app manifest and a service worker for offline caching on supported HTTPS origins.

Only **Definition Challenge** is implemented in this first version. Synonyms, antonyms, contextual sentence completion, correct usage, and typed recall are planned and are not presented as active game modes yet.

## Application files

| File | Purpose |
| --- | --- |
| \`index.html\` | Application document and script loading |
| \`styles.css\` | Responsive visual design |
| \`app.js\` | Gameplay, adaptive selection, scoring, progress, and navigation |
| \`vocabulary-data.js\` | Curated vocabulary bank |
| \`icon.svg\` | App icon |
| \`manifest.webmanifest\` | Installable web app manifest |
| \`sw.js\` | Static asset caching |
| \`wrangler.jsonc\` | Cloudflare Workers static-assets configuration |
| \`tools/smoke-test.cjs\` | Automated smoke tests |

No dependency installation, build tools, or paid AI APIs are required. Run the files with any static website server. Run tests with:

\`\`\`sh
node tools/smoke-test.cjs
\`\`\`

## Cloudflare Workers hosting

Create **a new Cloudflare Worker** for this app, rather than reusing the existing BrainTrainingApp Worker.

1. In Cloudflare, open Workers & Pages and create a Worker using your connected GitHub repository \`Sttaggs/LexiconVocabulary\` and its \`main\` branch.
2. Configure the deployment to serve static assets from the repository root (\`.\`). The repository includes \`wrangler.jsonc\`, which names the Worker \`lexicon-vocabulary-app\` and configures static-asset hosting.
3. If the Cloudflare Git integration asks for a build command, use a no-build/static configuration. No install or compilation is required.
4. Deploy and verify the resulting \`workers.dev\` URL before adding any custom domain.
5. Confirm a new push to \`main\` triggers a deployment. GitHub saves source changes; Cloudflare only publishes them after a successful build/deployment.

Do not configure the new Worker to point at the original BrainTrainingApp repository or reuse the original Worker's existing production address.

## Progress and privacy

Progress is kept under \`lexicon-vocab-v1\` in the browser's local storage; it is not stored in GitHub or Cloudflare. The same user opening different browsers or devices will not automatically see synchronized history. Use Settings → Export Backup to preserve progress before changing browsers, clearing site data, or migrating the app to a different website address. Import Backup replaces the current saved progress after confirmation.

Player XP measures participation; vocabulary mastery requires multiple successful delayed reviews on different days. Neither score estimates general intelligence.

## Future development

Next milestones include synonym, antonym, context, correct-use, and typed recall games; improved review analytics; achievements; expanded vocabulary content; and optional account-based synchronization. The initial version prioritizes a functional, persistent learning experience over placeholder interfaces.
