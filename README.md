# careertools

**Cybersecurity Career Path Finder** — a static, client-side tool that helps you figure out where you stand skillwise, what kind of security work interests you, and which career path and certification roadmap fits best.

Built around the framework from Dice's [How to Craft Your Cybersecurity Career Roadmap](https://www.dice.com/career-advice/how-to-craft-your-cybersecurity-career-roadmap): start with a clear picture of where you're starting from, set short- and long-term goals, and identify the certifications/milestones that connect them. It also links out to the [NICE Cybersecurity Workforce Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) and [CyberSeek Career Pathway Tool](https://www.cyberseek.org/pathway.html) referenced in that article for deeper self-assessment.

## How it works

1. **Tell it where you're starting from**: your current experience level, and which certifications you already hold (so the roadmap never tells you to go earn something you already have).
2. **Check off what you've actually done** across 9 skill categories (networking, SIEM/log monitoring, scripting, cryptography, cloud, incident response, GRC, offensive security, malware analysis). Each category lists concrete tasks instead of an abstract 1-5 scale — your level is inferred from what you check, with a plain-language description so you can sanity-check the result.
3. **Answer a few deliberately vague scenario questions** — pick everything that genuinely appeals, not a forced single choice — that map loosely to five career tracks: defense/operations, offense, cloud/architecture, GRC/compliance, and leadership.
4. **Get a 1–10 year roadmap**, not just a single recommendation:
   - **Year 1**: roles you're realistically eligible for right now, given your actual skills, certs, and experience.
   - **Years 2–4**: the certs and goals that bridge you toward your best long-term fit.
   - **Years 5–10**: the career path — one of six tracks (SOC Analyst, Threat Hunter/IR, Pentester/Red Teamer, Cloud Security Engineer, GRC Analyst, Security Leadership) — that best matches your skills and interests, with its senior-tier certs and long-term direction.

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
