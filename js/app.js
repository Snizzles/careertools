const STORAGE_KEY = "cybercareer-state-v2";

const defaultState = () => ({
  step: "intro",
  experience: null,
  certs: [],
  skillChecks: Object.fromEntries(SKILLS.map((s) => [s.id, []])),
  scenarioAnswers: Object.fromEntries(SCENARIOS.map((_, i) => [i, []])),
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

const STEP_PROGRESS = { intro: 0, background: 20, skills: 45, interests: 70, results: 100 };

function render() {
  document.getElementById("progress-fill").style.width = STEP_PROGRESS[state.step] + "%";
  const main = document.getElementById("app-main");
  main.innerHTML = "";
  if (state.step === "intro") main.appendChild(renderIntro());
  else if (state.step === "background") main.appendChild(renderBackground());
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
    el("p", {}, "Instead of guessing at a number on a scale, you'll check off concrete things you've actually done, answer a few deliberately vague scenario questions, and tell us which certs you already hold. You'll get back a 1–10 year roadmap: roles you're realistically eligible for now, and where that should lead."),
    el("p", { class: "muted" }, [
      "For deeper self-assessment, the article also points to the ",
      el("a", { href: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center", target: "_blank", rel: "noopener" }, "NICE Cybersecurity Workforce Framework"),
      " and the ",
      el("a", { href: "https://www.cyberseek.org/pathway.html", target: "_blank", rel: "noopener" }, "CyberSeek Career Pathway Tool"),
      ".",
    ]),
    el("button", { class: "btn-primary", onclick: () => goTo("background") }, "Start the assessment"),
  ]);
}

function renderBackground() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 1: Where you're starting from"),
    el("p", { class: "muted" }, "This sets a realistic baseline for what's actually possible in Year 1 — and makes sure we don't recommend certs you already have."),
    el("h3", {}, "Current experience level"),
  ]);

  const expList = el("div", { class: "option-list" });
  EXPERIENCE_LEVELS.forEach((lvl) => {
    const id = `exp-${lvl.id}`;
    expList.appendChild(
      el("label", { class: "option", for: id }, [
        el("input", {
          type: "radio",
          name: "experience",
          id,
          ...(state.experience === lvl.id ? { checked: "checked" } : {}),
          onchange: () => {
            state.experience = lvl.id;
            saveState();
            updateNextButton();
          },
        }),
        el("span", {}, [el("strong", {}, lvl.label), el("br"), el("span", { class: "muted small" }, lvl.desc)]),
      ])
    );
  });
  card.appendChild(expList);

  card.appendChild(el("h3", {}, "Certifications you already hold"));
  card.appendChild(el("p", { class: "muted small" }, "Check anything you currently hold. These get excluded from your roadmap so you're not told to go earn something you already have."));
  const certGrid = el("div", { class: "cert-checklist" });
  CERTIFICATIONS.forEach((c) => {
    const id = `cert-${c.id}`;
    certGrid.appendChild(
      el("label", { class: "option", for: id }, [
        el("input", {
          type: "checkbox",
          id,
          ...(state.certs.includes(c.id) ? { checked: "checked" } : {}),
          onchange: (e) => {
            if (e.target.checked) {
              if (!state.certs.includes(c.id)) state.certs.push(c.id);
            } else {
              state.certs = state.certs.filter((x) => x !== c.id);
            }
            saveState();
          },
        }),
        el("span", {}, c.name),
      ])
    );
  });
  card.appendChild(certGrid);

  const nextBtn = el("button", { class: "btn-primary", onclick: () => state.experience && goTo("skills") }, "Next: Skills");
  function updateNextButton() {
    nextBtn.disabled = !state.experience;
    nextBtn.textContent = state.experience ? "Next: Skills" : "Pick an experience level to continue";
  }
  updateNextButton();

  card.appendChild(
    el("div", { class: "nav-row" }, [el("button", { class: "btn-secondary", onclick: () => goTo("intro") }, "Back"), nextBtn])
  );
  return card;
}

function renderSkills() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 2: What have you actually done?"),
    el("p", { class: "muted" }, "Check off anything you've genuinely done in each area. Your level is inferred from that — you don't have to guess a number."),
  ]);
  const list = el("div", { class: "skill-list" });

  for (const skill of SKILLS) {
    if (!state.skillChecks[skill.id]) state.skillChecks[skill.id] = [];
    const checked = state.skillChecks[skill.id];
    const levelLabel = el("p", { class: "skill-value" });

    function updateLevelLabel() {
      const levels = checked.map((i) => skill.tasks[i].level);
      const level = levels.length ? Math.max(...levels) : 1;
      levelLabel.textContent = `Inferred level ${level}/5 — ${skill.anchors[level - 1]}`;
    }

    const taskList = el("div", { class: "task-list" });
    skill.tasks.forEach((task, ti) => {
      const id = `${skill.id}-t${ti}`;
      taskList.appendChild(
        el("label", { class: "option", for: id }, [
          el("input", {
            type: "checkbox",
            id,
            ...(checked.includes(ti) ? { checked: "checked" } : {}),
            onchange: (e) => {
              if (e.target.checked) {
                if (!checked.includes(ti)) checked.push(ti);
              } else {
                const idx = checked.indexOf(ti);
                if (idx !== -1) checked.splice(idx, 1);
              }
              saveState();
              updateLevelLabel();
            },
          }),
          el("span", {}, task.text),
        ])
      );
    });
    updateLevelLabel();

    list.appendChild(
      el("div", { class: "skill-row" }, [
        el("div", { class: "skill-label" }, [el("strong", {}, skill.label), el("span", { class: "muted small" }, skill.desc)]),
        taskList,
        levelLabel,
      ])
    );
  }
  card.appendChild(list);
  card.appendChild(
    el("div", { class: "nav-row" }, [
      el("button", { class: "btn-secondary", onclick: () => goTo("background") }, "Back"),
      el("button", { class: "btn-primary", onclick: () => goTo("interests") }, "Next: Interests"),
    ])
  );
  return card;
}

function renderInterests() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 3: What pulls you in?"),
    el("p", { class: "muted" }, "These scenarios are deliberately vague. Pick everything that genuinely appeals — more than one option per scenario is expected."),
  ]);

  function allAnswered() {
    return SCENARIOS.every((_, si) => (state.scenarioAnswers[si] || []).length > 0);
  }

  const nextBtn = el("button", { class: "btn-primary", onclick: () => allAnswered() && goTo("results") }, "See my roadmap");
  function updateNextButton() {
    const done = allAnswered();
    nextBtn.disabled = !done;
    nextBtn.textContent = done ? "See my roadmap" : "Pick at least one option per scenario";
  }

  SCENARIOS.forEach((sc, si) => {
    if (!state.scenarioAnswers[si]) state.scenarioAnswers[si] = [];
    const picks = state.scenarioAnswers[si];
    const group = el("fieldset", { class: "question" }, [
      el("p", { class: "muted small" }, sc.setup),
      el("legend", {}, sc.prompt),
    ]);
    sc.options.forEach((opt, oi) => {
      const id = `s${si}-o${oi}`;
      group.appendChild(
        el("label", { class: "option", for: id }, [
          el("input", {
            type: "checkbox",
            id,
            ...(picks.includes(oi) ? { checked: "checked" } : {}),
            onchange: (e) => {
              if (e.target.checked) {
                if (!picks.includes(oi)) picks.push(oi);
              } else {
                const idx = picks.indexOf(oi);
                if (idx !== -1) picks.splice(idx, 1);
              }
              saveState();
              updateNextButton();
            },
          }),
          el("span", {}, opt.text),
        ])
      );
    });
    card.appendChild(group);
  });

  updateNextButton();
  card.appendChild(
    el("div", { class: "nav-row" }, [el("button", { class: "btn-secondary", onclick: () => goTo("skills") }, "Back"), nextBtn])
  );
  return card;
}

function computeResults() {
  const skillLevels = {};
  for (const skill of SKILLS) {
    const checked = state.skillChecks[skill.id] || [];
    const levels = checked.map((i) => skill.tasks[i].level);
    skillLevels[skill.id] = levels.length ? Math.max(...levels) : 1;
  }

  const trackPoints = Object.fromEntries(TRACKS.map((t) => [t, 0]));
  SCENARIOS.forEach((sc, si) => {
    const picks = state.scenarioAnswers[si] || [];
    picks.forEach((oi) => {
      const track = sc.options[oi].track;
      trackPoints[track] += 1;
    });
  });
  const trackNorm = Object.fromEntries(TRACKS.map((t) => [t, trackPoints[t] / SCENARIOS.length]));

  const expWeight = (EXPERIENCE_LEVELS.find((e) => e.id === state.experience) || { weight: 0 }).weight;
  const expNorm = expWeight / 3;

  const scored = PATHS.map((path) => {
    const skillIds = Object.keys(path.skillWeights);
    const skillWeightSum = skillIds.reduce((sum, id) => sum + path.skillWeights[id], 0);
    const skillScore = skillWeightSum
      ? skillIds.reduce((sum, id) => sum + path.skillWeights[id] * ((skillLevels[id] - 1) / 4), 0) / skillWeightSum
      : 0;

    const trackWeightSum = TRACKS.reduce((sum, t) => sum + (path.trackWeights[t] || 0), 0);
    const interestScore = trackWeightSum
      ? TRACKS.reduce((sum, t) => sum + (path.trackWeights[t] || 0) * trackNorm[t], 0) / trackWeightSum
      : 0;

    const total = 0.5 * skillScore + 0.5 * interestScore;

    const entryCerts = path.certs.entry;
    const certCoverage = entryCerts.length ? entryCerts.filter((c) => state.certs.includes(c)).length / entryCerts.length : 0;
    const meetsBar = skillScore >= 0.4 || certCoverage >= 0.5 || expWeight >= 2;
    const ready = meetsBar && total > 0.1;

    const gaps = skillIds.filter((id) => skillLevels[id] < 3).map((id) => SKILLS.find((s) => s.id === id).label);

    return { path, skillScore, interestScore, total, certCoverage, ready, gaps };
  });

  scored.sort((a, b) => b.total - a.total);
  return scored;
}

function remainingCerts(path, tier) {
  return path.certs[tier].filter((c) => !state.certs.includes(c));
}

function renderResults() {
  const ranked = computeResults();
  const top = ranked[0];
  const readyPaths = ranked.filter((r) => r.ready);

  const card = el("section", { class: "card" }, [el("h2", {}, "Your 1–10 year roadmap")]);

  card.appendChild(el("h3", {}, "Year 1: what you're eligible for now"));
  if (readyPaths.length) {
    readyPaths.slice(0, 2).forEach((r) => {
      const held = r.path.certs.entry.filter((c) => state.certs.includes(c));
      const remaining = remainingCerts(r.path, "entry");
      card.appendChild(
        el("div", { class: "roadmap-stage" }, [
          el("h4", {}, r.path.name),
          el("p", { class: "muted small" }, r.path.summary),
          held.length ? el("p", { class: "small" }, [el("strong", {}, "Already have: "), held.map(certName).join(", ")]) : null,
          remaining.length
            ? el("p", { class: "small" }, [el("strong", {}, "Worth picking up: "), remaining.map(certName).join(", ")])
            : el("p", { class: "small" }, "You already hold the typical entry certs for this role."),
        ])
      );
    });
  } else {
    const remaining = remainingCerts(top.path, "entry");
    card.appendChild(
      el("div", { class: "roadmap-stage" }, [
        el("p", {}, "Based on where you're starting, you're not yet competitive for a dedicated security role — that's normal, and closeable within a year."),
        el("p", {}, [el("strong", {}, "Closest realistic target: "), top.path.name]),
        remaining.length ? el("p", { class: "small" }, [el("strong", {}, "Start with: "), remaining.map(certName).join(", ")]) : null,
        el("ul", { class: "goal-list" }, top.path.shortTermGoals.map((g) => el("li", {}, g))),
      ])
    );
  }

  card.appendChild(el("h3", {}, "Years 2–4: building toward your target"));
  const remainingMid = remainingCerts(top.path, "mid");
  card.appendChild(
    el("div", { class: "roadmap-stage" }, [
      el("p", {}, `Bridge experience and certs toward ${top.path.name}.`),
      remainingMid.length
        ? el("p", { class: "small" }, [el("strong", {}, "Certs to target: "), remainingMid.map(certName).join(", ")])
        : el("p", { class: "small" }, "You already hold the typical mid-tier certs for this path."),
      el("ul", { class: "goal-list" }, top.path.shortTermGoals.map((g) => el("li", {}, g))),
    ])
  );

  card.appendChild(el("h3", {}, "Years 5–10: where this should be going"));
  const remainingSenior = remainingCerts(top.path, "senior");
  card.appendChild(
    el("div", { class: "roadmap-stage" }, [
      el("h4", {}, top.path.name),
      el("p", { class: "muted small" }, top.path.summary),
      el("div", { class: "match-bar" }, [el("div", { class: "match-fill", style: `width:${Math.round(top.total * 100)}%` })]),
      el(
        "p",
        { class: "muted small" },
        `${Math.round(top.total * 100)}% fit based on what you've done and what you said pulls you in (skills ${Math.round(top.skillScore * 100)}%, interest ${Math.round(top.interestScore * 100)}%)`
      ),
      remainingSenior.length ? el("p", { class: "small" }, [el("strong", {}, "Target certs: "), remainingSenior.map(certName).join(", ")]) : null,
      el("ul", { class: "goal-list" }, top.path.longTermGoals.map((g) => el("li", {}, g))),
    ])
  );

  if (top.gaps.length) {
    card.appendChild(
      el("div", { class: "callout" }, [el("strong", {}, "Skill gaps for your target path: "), el("span", {}, top.gaps.join(", "))])
    );
  }

  card.appendChild(el("h3", {}, "Full ranking"));
  const rankList = el("div", { class: "rank-list" });
  ranked.forEach((r, i) => {
    rankList.appendChild(
      el("div", { class: "rank-row" + (i === 0 ? " rank-row-top" : "") }, [
        el("span", { class: "rank-name" }, r.path.name + (r.ready ? " (eligible now)" : "")),
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
      el("button", { class: "btn-primary", onclick: () => copyResults(ranked) }, "Copy results"),
    ])
  );

  return card;
}

function copyResults(ranked) {
  const top = ranked[0];
  const readyPaths = ranked.filter((r) => r.ready);

  const lines = ["1-10 year cybersecurity roadmap", "", "YEAR 1 (eligible now):"];
  if (readyPaths.length) {
    readyPaths.slice(0, 2).forEach((r) => lines.push(`- ${r.path.name} (${Math.round(r.total * 100)}% fit)`));
  } else {
    lines.push(`- Not yet competitive for a dedicated security role. Closest target: ${top.path.name}`);
    lines.push(...remainingCerts(top.path, "entry").map((c) => `  - Earn ${certName(c)}`));
  }

  lines.push("", `YEARS 2-4 (bridge toward ${top.path.name}):`);
  lines.push(...remainingCerts(top.path, "mid").map((c) => `- Earn ${certName(c)}`));

  lines.push("", `YEARS 5-10 (target): ${top.path.name} (${Math.round(top.total * 100)}% fit)`, top.path.summary);
  lines.push(...remainingCerts(top.path, "senior").map((c) => `- Earn ${certName(c)}`));

  lines.push("", "Long-term direction:", ...top.path.longTermGoals.map((g) => `- ${g}`));

  navigator.clipboard?.writeText(lines.join("\n"));
}

render();
