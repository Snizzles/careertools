# careertools

**Cybersecurity Career Path Finder** — a static, client-side tool that helps you figure out where you stand skillwise, what kind of security work interests you, and which career path and certification roadmap fits best.

Built around the framework from Dice's [How to Craft Your Cybersecurity Career Roadmap](https://www.dice.com/career-advice/how-to-craft-your-cybersecurity-career-roadmap): start with a clear picture of where you're starting from, set short- and long-term goals, and identify the certifications/milestones that connect them. It also links out to the [NICE Cybersecurity Workforce Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center) and [CyberSeek Career Pathway Tool](https://www.cyberseek.org/pathway.html) referenced in that article for deeper self-assessment.

## How it works

1. **Rate your current skills** across 9 categories (networking, SIEM/log monitoring, scripting, cryptography, cloud, incident response, GRC, offensive security, malware analysis).
2. **Take a short interest quiz** (6 questions) that maps your answers to five career tracks: defense/operations, offense, cloud/architecture, GRC/compliance, and leadership.
3. **Get a recommended path** — one of six cybersecurity career tracks (SOC Analyst, Threat Hunter/IR, Pentester/Red Teamer, Cloud Security Engineer, GRC Analyst, Security Leadership) — ranked by how well it matches both your current skills and your interests, with a 3-tier certification roadmap (entry/mid/senior) and concrete short- and long-term goals.

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
