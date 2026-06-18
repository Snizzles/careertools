# careertools

**Cybersecurity Career Path Finder** — a static, client-side tool that helps you figure out where you stand skillwise, what kind of security work interests you, and which career path and certification roadmap fits best.

Built around the framework from Dice's [How to Craft Your Cybersecurity Career Roadmap](https://www.dice.com/career-advice/how-to-craft-your-cybersecurity-career-roadmap): start with a clear picture of where you're starting from, set short- and long-term goals, and identify the certifications/milestones that connect them. It also links out to the [NICE Cybersecurity Workforce Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) and [CyberSeek Career Pathway Tool](https://www.cyberseek.org/pathway.html) referenced in that article for deeper self-assessment.

## How it works

1. **Tell it where you're starting from**: your current experience level, and which certifications you already hold. The roadmap excludes those certs *and anything beneath them* — hold a senior cert (say CISA) and the entry ones (Security+, CC) drop off automatically, so you're never told to go earn something you've outgrown.
2. **Check off what you've actually done** across 10 skill areas — including a deliberately **non-technical** leadership/program-management axis, so GRC- and management-bound people aren't scored as if hands-on hacking were the only thing that counts. Each area lists concrete tasks instead of an abstract 1–5 scale; your level is inferred from what you check, with a plain-language description to sanity-check it.
3. **Answer a few deliberately vague scenario questions** — pick everything that genuinely appeals (a split is fine and is detected) — mapping loosely to five tracks: defensive operations, offensive security, cloud security, GRC, and leadership.
4. **Get a role-by-role roadmap built on career *ladders*, not a single label.** Each track is a ladder of roles from entry to lead. The tool estimates which rung you're already on and starts from your **next move**, never the job you already have:
   - **Now**: the role you could credibly claim today (skipped if you're new to security).
   - **Year 1**: your realistic next role, with a plain-language readiness signal (*ready to apply now* / *close* / *foundation first*) — fit and eligibility are kept separate, so it won't slap "eligible now" on everything.
   - **Years 2–4 / 5–10**: the rungs beyond, each with the certs that actually matter at that level.

   If your interests are genuinely split between two tracks, it flags the fork and contrasts the day-to-day of each to help you choose. A standing reminder that **proof (labs, projects, writeups, reframed experience) often matters as much as certs** sits alongside every result.

Everything runs in the browser with no backend; your answers are saved to `localStorage` so you can leave and come back.

## Running locally

Just open `index.html` in a browser, or serve the directory:

```
python3 -m http.server 8000
```

## Deploying to GitHub Pages

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<your-username>.github.io/careertools/`.
