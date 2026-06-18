const STORAGE_KEY = "cybercareer-state-v1";

const defaultState = () => ({
  step: "intro",
  skillRatings: Object.fromEntries(SKILLS.map((s) => [s.id, 3])),
  answers: Array(QUESTIONS.length).fill(null),
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function goTo(step) {
  state.step = step;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  render();
}

const STEP_PROGRESS = { intro: 0, skills: 33, interests: 66, results: 100 };

function render() {
  document.getElementById("progress-fill").style.width = STEP_PROGRESS[state.step] + "%";
  const main = document.getElementById("app-main");
  main.innerHTML = "";
  if (state.step === "intro") main.appendChild(renderIntro());
  else if (state.step === "skills") main.appendChild(renderSkills());
  else if (state.step === "interests") main.appendChild(renderInterests());
  else if (state.step === "results") main.appendChild(renderResults());
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child) node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

function renderIntro() {
  return el("section", { class: "card" }, [
    el("h2", {}, "Find where you are — and where to go next"),
    el("p", {}, [
      "This tool follows the framework from Dice's ",
      el("a", { href: "https://www.dice.com/career-advice/how-to-craft-your-cybersecurity-career-roadmap", target: "_blank", rel: "noopener" }, "How to Craft Your Cybersecurity Career Roadmap"),
      ": get a clear picture of where you're starting from, set short- and long-term goals, and identify the certifications and milestones that connect them.",
    ]),
    el("p", {}, "You'll rate your current skills, answer a short interest quiz, then get a recommended career path with a certification roadmap and concrete next steps."),
    el("p", { class: "muted" }, [
      "For deeper self-assessment, the article also points to the ",
      el("a", { href: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center", target: "_blank", rel: "noopener" }, "NICE Cybersecurity Workforce Framework"),
      " and the ",
      el("a", { href: "https://www.cyberseek.org/pathway.html", target: "_blank", rel: "noopener" }, "CyberSeek Career Pathway Tool"),
      ".",
    ]),
    el("button", { class: "btn-primary", onclick: () => goTo("skills") }, "Start the assessment"),
  ]);
}

function renderSkills() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 1: Rate your current skills"),
    el("p", { class: "muted" }, "Be honest, not aspirational — this is your starting point, not your ceiling."),
  ]);
  const list = el("div", { class: "skill-list" });
  for (const skill of SKILLS) {
    const value = state.skillRatings[skill.id];
    const row = el("div", { class: "skill-row" }, [
      el("div", { class: "skill-label" }, [el("strong", {}, skill.label), el("span", { class: "muted small" }, skill.desc)]),
      el("input", {
        type: "range",
        min: "1",
        max: "5",
        value: String(value),
        oninput: (e) => {
          state.skillRatings[skill.id] = Number(e.target.value);
          saveState();
          row.querySelector(".skill-value").textContent = SKILL_LEVELS[e.target.value - 1];
        },
      }),
      el("span", { class: "skill-value" }, SKILL_LEVELS[value - 1]),
    ]);
    list.appendChild(row);
  }
  card.appendChild(list);
  card.appendChild(
    el("div", { class: "nav-row" }, [
      el("button", { class: "btn-secondary", onclick: () => goTo("intro") }, "Back"),
      el("button", { class: "btn-primary", onclick: () => goTo("interests") }, "Next: Interests"),
    ])
  );
  return card;
}

function renderInterests() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 2: What pulls you in?"),
    el("p", { class: "muted" }, "Pick the option that sounds most like you for each question."),
  ]);
  QUESTIONS.forEach((q, qi) => {
    const group = el("fieldset", { class: "question" }, [el("legend", {}, q.text)]);
    q.options.forEach((opt, oi) => {
      const id = `q${qi}-o${oi}`;
      const label = el("label", { class: "option", for: id }, [
        el("input", {
          type: "radio",
          name: `q${qi}`,
          id,
          ...(state.answers[qi] === opt.track ? { checked: "checked" } : {}),
          onchange: () => {
            state.answers[qi] = opt.track;
            saveState();
            updateNextButton();
          },
        }),
        el("span", {}, opt.text),
      ]);
      group.appendChild(label);
    });
    card.appendChild(group);
  });

  const nextBtn = el(
    "button",
    { class: "btn-primary", onclick: () => state.answers.every((a) => a !== null) && goTo("results") },
    "See my results"
  );

  function updateNextButton() {
    const allAnswered = state.answers.every((a) => a !== null);
    nextBtn.disabled = !allAnswered;
    nextBtn.textContent = allAnswered ? "See my results" : "Answer all questions to continue";
  }
  updateNextButton();

  card.appendChild(
    el("div", { class: "nav-row" }, [el("button", { class: "btn-secondary", onclick: () => goTo("skills") }, "Back"), nextBtn])
  );
  return card;
}

function computeResults() {
  const trackPoints = Object.fromEntries(TRACKS.map((t) => [t, 0]));
  for (const track of state.answers) {
    if (track) trackPoints[track] += 1;
  }
  const trackNorm = Object.fromEntries(TRACKS.map((t) => [t, trackPoints[t] / QUESTIONS.length]));

  const scored = PATHS.map((path) => {
    const skillIds = Object.keys(path.skillWeights);
    const skillWeightSum = skillIds.reduce((sum, id) => sum + path.skillWeights[id], 0);
    const skillScore =
      skillIds.reduce((sum, id) => sum + path.skillWeights[id] * ((state.skillRatings[id] - 1) / 4), 0) / skillWeightSum;

    const trackWeightSum = TRACKS.reduce((sum, t) => sum + (path.trackWeights[t] || 0), 0);
    const interestScore = TRACKS.reduce((sum, t) => sum + (path.trackWeights[t] || 0) * trackNorm[t], 0) / trackWeightSum;

    const total = 0.5 * skillScore + 0.5 * interestScore;
    const gaps = skillIds.filter((id) => state.skillRatings[id] < 3).map((id) => SKILLS.find((s) => s.id === id).label);

    return { path, skillScore, interestScore, total, gaps };
  });

  scored.sort((a, b) => b.total - a.total);
  return scored;
}

function renderResults() {
  const ranked = computeResults();
  const top = ranked[0];

  const card = el("section", { class: "card" }, [
    el("h2", {}, "Your recommended path"),
    el("div", { class: "result-top" }, [
      el("h3", {}, top.path.name),
      el("p", {}, top.path.summary),
      el("div", { class: "match-bar" }, [
        el("div", { class: "match-fill", style: `width:${Math.round(top.total * 100)}%` }),
      ]),
      el("p", { class: "muted small" }, `${Math.round(top.total * 100)}% match (skills ${Math.round(top.skillScore * 100)}% / interests ${Math.round(top.interestScore * 100)}%)`),
    ]),
  ]);

  if (top.gaps.length) {
    card.appendChild(
      el("div", { class: "callout" }, [
        el("strong", {}, "Skill gaps to close: "),
        el("span", {}, top.gaps.join(", ")),
      ])
    );
  }

  card.appendChild(el("h3", {}, "Certification roadmap"));
  card.appendChild(
    el("div", { class: "cert-roadmap" }, [
      el("div", { class: "cert-stage" }, [el("h4", {}, "Entry"), el("ul", {}, top.path.certs.entry.map((c) => el("li", {}, c)))]),
      el("div", { class: "cert-stage" }, [el("h4", {}, "Mid"), el("ul", {}, top.path.certs.mid.map((c) => el("li", {}, c)))]),
      el("div", { class: "cert-stage" }, [el("h4", {}, "Senior"), el("ul", {}, top.path.certs.senior.map((c) => el("li", {}, c)))]),
    ])
  );

  card.appendChild(el("h3", {}, "Short-term goals"));
  card.appendChild(el("ul", { class: "goal-list" }, top.path.shortTermGoals.map((g) => el("li", {}, g))));

  card.appendChild(el("h3", {}, "Long-term direction"));
  card.appendChild(el("ul", { class: "goal-list" }, top.path.longTermGoals.map((g) => el("li", {}, g))));

  card.appendChild(el("h3", {}, "Full ranking"));
  const rankList = el("div", { class: "rank-list" });
  ranked.forEach((r, i) => {
    rankList.appendChild(
      el("div", { class: "rank-row" + (i === 0 ? " rank-row-top" : "") }, [
        el("span", { class: "rank-name" }, r.path.name),
        el("div", { class: "match-bar small" }, [el("div", { class: "match-fill", style: `width:${Math.round(r.total * 100)}%` })]),
        el("span", { class: "rank-pct" }, `${Math.round(r.total * 100)}%`),
      ])
    );
  });
  card.appendChild(rankList);

  card.appendChild(
    el("div", { class: "nav-row" }, [
      el("button", { class: "btn-secondary", onclick: () => goTo("interests") }, "Back"),
      el("button", { class: "btn-secondary", onclick: resetAll }, "Start over"),
      el("button", { class: "btn-primary", onclick: () => copyResults(top) }, "Copy results"),
    ])
  );

  return card;
}

function copyResults(top) {
  const lines = [
    `Recommended path: ${top.path.name} (${Math.round(top.total * 100)}% match)`,
    top.path.summary,
    "",
    `Entry certs: ${top.path.certs.entry.join(", ")}`,
    `Mid certs: ${top.path.certs.mid.join(", ")}`,
    `Senior certs: ${top.path.certs.senior.join(", ")}`,
    "",
    "Short-term goals:",
    ...top.path.shortTermGoals.map((g) => `- ${g}`),
    "",
    "Long-term direction:",
    ...top.path.longTermGoals.map((g) => `- ${g}`),
  ];
  navigator.clipboard?.writeText(lines.join("\n"));
}

render();
