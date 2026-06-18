const STORAGE_KEY = "cybercareer-state-v3";

const defaultState = () => ({
  step: "intro",
  experience: null,
  certs: [],
  skillChecks: Object.fromEntries(SKILLS.map((s) => [s.id, []])),
  skillAffinity: Object.fromEntries(SKILLS.map((s) => [s.id, "neutral"])),
  scenarioAnswers: Object.fromEntries(SCENARIOS.map((_, i) => [i, []])),
});

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
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

// ---------------------------------------------------------------- intro
function renderIntro() {
  return el("section", { class: "card" }, [
    el("h2", {}, "Find where you are — and the path on from here"),
    el("p", {}, [
      "This follows the framework from Dice's ",
      el("a", { href: "https://www.dice.com/career-advice/how-to-craft-your-cybersecurity-career-roadmap", target: "_blank", rel: "noopener" }, "How to Craft Your Cybersecurity Career Roadmap"),
      ": know where you're starting, set short- and long-term goals, and find the certs and milestones that connect them.",
    ]),
    el("p", {}, "You'll check off concrete things you've actually done (no guessing a number on a scale), answer a few deliberately vague scenario questions, and tell us which certs you already hold. You get back a role-by-role roadmap that starts from your NEXT move — not the job you already have — and never tells you to earn a cert beneath one you've got."),
    el("p", { class: "muted small" }, [
      "Deeper self-assessment lives in the ",
      el("a", { href: "https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center", target: "_blank", rel: "noopener" }, "NICE Workforce Framework"),
      " and the ",
      el("a", { href: "https://www.cyberseek.org/pathway.html", target: "_blank", rel: "noopener" }, "CyberSeek Career Pathway Tool"),
      ".",
    ]),
    el("button", { class: "btn-primary", onclick: () => goTo("background") }, "Start the assessment"),
  ]);
}

// ----------------------------------------------------------- background
function renderBackground() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 1: Where you're starting from"),
    el("p", { class: "muted" }, "This places you on the ladder and makes sure the roadmap starts from your next move, not your current one."),
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
  card.appendChild(el("p", { class: "muted small" }, "Check anything you hold. The roadmap excludes these AND anything beneath them — hold a senior cert and the entry ones drop off automatically."));
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
        el("span", {}, [c.name, el("span", { class: "muted small" }, ` — ${c.blurb}`)]),
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
  card.appendChild(el("div", { class: "nav-row" }, [el("button", { class: "btn-secondary", onclick: () => goTo("intro") }, "Back"), nextBtn]));
  return card;
}

// --------------------------------------------------------------- skills
function renderSkills() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 2: What have you actually done?"),
    el("p", { class: "muted" }, "Check off anything you've genuinely done in each area — including the non-technical leadership one. Your level is inferred from that."),
  ]);
  const list = el("div", { class: "skill-list" });

  for (const skill of SKILLS) {
    if (!state.skillChecks[skill.id]) state.skillChecks[skill.id] = [];
    if (!state.skillAffinity[skill.id]) state.skillAffinity[skill.id] = "neutral";
    const checked = state.skillChecks[skill.id];
    const levelLabel = el("p", { class: "skill-value" });

    function updateLevelLabel() {
      const level = skillLevelFor(skill, checked);
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

    const AFFINITY_OPTIONS = [
      { id: "dislike", text: "Not for me" },
      { id: "neutral", text: "Neutral" },
      { id: "like", text: "More of this" },
    ];
    const affinityRow = el("div", { class: "affinity-row" });
    const affinityBtns = [];
    AFFINITY_OPTIONS.forEach((opt) => {
      const btn = el(
        "button",
        {
          type: "button",
          class: "affinity-btn" + (state.skillAffinity[skill.id] === opt.id ? " active" : ""),
          onclick: () => {
            state.skillAffinity[skill.id] = opt.id;
            saveState();
            affinityBtns.forEach((b) => b.el.classList.toggle("active", b.id === opt.id));
          },
        },
        opt.text
      );
      affinityBtns.push({ id: opt.id, el: btn });
      affinityRow.appendChild(btn);
    });

    list.appendChild(
      el("div", { class: "skill-row" }, [
        el("div", { class: "skill-label" }, [el("strong", {}, skill.label), el("span", { class: "muted small" }, skill.desc)]),
        taskList,
        levelLabel,
        el("div", { class: "affinity-block" }, [
          el("span", { class: "muted small" }, "Independent of what you've done — do you want more of this kind of work?"),
          affinityRow,
        ]),
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

// ------------------------------------------------------------ interests
function renderInterests() {
  const card = el("section", { class: "card" }, [
    el("h2", {}, "Step 3: What pulls you in?"),
    el("p", { class: "muted" }, "These scenarios are deliberately vague. Pick everything that genuinely appeals — picking more than one per scenario is expected, and a split is fine (it tells us if you're torn between directions)."),
  ]);

  const allAnswered = () => SCENARIOS.every((_, si) => (state.scenarioAnswers[si] || []).length > 0);
  const nextBtn = el("button", { class: "btn-primary", onclick: () => allAnswered() && goTo("results") }, "See my roadmap");
  function updateNextButton() {
    const done = allAnswered();
    nextBtn.disabled = !done;
    nextBtn.textContent = done ? "See my roadmap" : "Pick at least one option per scenario";
  }

  SCENARIOS.forEach((sc, si) => {
    if (!state.scenarioAnswers[si]) state.scenarioAnswers[si] = [];
    const picks = state.scenarioAnswers[si];
    const group = el("fieldset", { class: "question" }, [el("p", { class: "muted small" }, sc.setup), el("legend", {}, sc.prompt)]);
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
  card.appendChild(el("div", { class: "nav-row" }, [el("button", { class: "btn-secondary", onclick: () => goTo("skills") }, "Back"), nextBtn]));
  return card;
}

// --------------------------------------------------------- scoring core
// A single checked task can never alone carry a skill to its level — claiming
// a high level also requires having checked enough of the list to back it up
// (checking only the hardest-sounding box, alone, caps out at level 2).
function skillLevelFor(skill, checkedIdx) {
  if (!checkedIdx.length) return 1;
  const maxClaimed = Math.max(...checkedIdx.map((i) => skill.tasks[i].level));
  // A single checked task can still place you anywhere from 1-3 depending on
  // which one (so an easy vs. a moderately-advanced box still reads differently),
  // but never alone reaches 4-5 — that requires breadth across multiple tasks.
  return Math.min(maxClaimed, 2 + checkedIdx.length);
}

function skillLevels() {
  const out = {};
  for (const skill of SKILLS) {
    const checked = state.skillChecks[skill.id] || [];
    out[skill.id] = skillLevelFor(skill, checked);
  }
  return out;
}

// Cert suppression is scoped to the certs that actually appear on THIS track's
// ladder — holding a senior cert in one domain (e.g. CISM) shouldn't silently
// wipe out cert recommendations in an unrelated one (e.g. Cloud Security).
function maxHeldCertLevelForTrack(track) {
  const trackCertIds = new Set();
  TRACKS_DATA[track].rungs.forEach((r) => r.certs.forEach((id) => trackCertIds.add(id)));
  return state.certs.reduce((m, id) => (trackCertIds.has(id) ? Math.max(m, cert(id).level) : m), 0);
}

// Filter a list of cert ids down to what's worth recommending: drop anything
// already held or at/below the highest level the user already holds *on this track*.
function recommendCerts(ids, track) {
  const held = maxHeldCertLevelForTrack(track);
  return ids.filter((id) => !state.certs.includes(id) && cert(id).level > held);
}

// The skill the track's ladder leans on most. Used so someone who has maxed
// their PRIMARY skill (e.g. SIEM for defense) isn't held back from being
// recognized as already-senior just because a low-weighted, untouched skill
// (e.g. scripting) drags the blended average down.
function primarySkillId(track) {
  const w = TRACKS_DATA[track].skillWeights;
  return Object.entries(w).sort((a, b) => b[1] - a[1])[0][0];
}

function trackSkillScore(track) {
  const lv = skillLevels();
  const w = TRACKS_DATA[track].skillWeights;
  const ids = Object.keys(w);
  const sum = ids.reduce((s, id) => s + w[id], 0);
  return sum ? ids.reduce((s, id) => s + w[id] * ((lv[id] - 1) / 4), 0) / sum : 0;
}

// Enjoyment/competence are different things from "have done it" (e.g. you can
// have run budgets at a senior level and still hate doing it). This pulls fit
// down when a track leans on skills the user explicitly said they don't want
// more of, and up slightly when they said they want more of it.
function trackAffinityAdjustment(track) {
  const w = TRACKS_DATA[track].skillWeights;
  const ids = Object.keys(w);
  const sum = ids.reduce((s, id) => s + w[id], 0);
  if (!sum) return 0;
  const raw = ids.reduce((s, id) => {
    const aff = state.skillAffinity[id];
    if (aff === "dislike") return s - w[id];
    if (aff === "like") return s + w[id] * 0.3;
    return s;
  }, 0);
  return raw / sum;
}

function computeTracks() {
  const points = Object.fromEntries(TRACKS.map((t) => [t, 0]));
  SCENARIOS.forEach((sc, si) => (state.scenarioAnswers[si] || []).forEach((oi) => (points[sc.options[oi].track] += 1)));
  const totalPicks = Object.values(points).reduce((a, b) => a + b, 0) || 1;

  const exp = EXPERIENCE_LEVELS.find((e) => e.id === state.experience) || { weight: 0, baseRung: 0 };
  const inSecurity = exp.weight >= 2; // already holds a security/adjacent role
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(n, hi));
  const lv = skillLevels();

  return TRACKS.map((track) => {
    const interest = points[track] / totalPicks; // share of everything they picked
    const skill = trackSkillScore(track);
    const affinityAdj = trackAffinityAdjustment(track);
    const fit = clamp(0.55 * interest + 0.45 * skill + 0.25 * affinityAdj, 0, 1);
    const rungs = TRACKS_DATA[track].rungs;

    // currentRungIdx: the role they could credibly claim TODAY (-1 = entering,
    // no security role yet). startIdx: where their Year-1 move lands.
    let currentRungIdx, startIdx;
    if (inSecurity) {
      const bump = skill >= 0.85 || lv[primarySkillId(track)] >= 5 ? 1 : 0;
      currentRungIdx = clamp(exp.baseRung + bump, 0, rungs.length - 2); // leave room above
      startIdx = currentRungIdx + 1;
    } else {
      // Career-changer: not on the ladder yet, but strong transferable skills can
      // let them ENTER above the absolute floor (e.g. sysadmin -> cloud engineer).
      currentRungIdx = -1;
      startIdx = clamp(skill >= 0.82 ? 1 : 0, 0, rungs.length - 1);
    }
    return { track, interest, skill, affinityAdj, fit, currentRungIdx, startIdx, points: points[track] };
  }).sort((a, b) => b.fit - a.fit);
}

function readinessLabel(t) {
  const exp = (EXPERIENCE_LEVELS.find((e) => e.id === state.experience) || { weight: 0 }).weight;
  if (t.skill >= 0.6 && exp >= 2) return { cls: "ready", text: "Ready to apply now" };
  if (t.skill >= 0.6) return { cls: "ready", text: "Strong skills — start applying as you formalize experience" };
  if (t.skill >= 0.45) return { cls: "close", text: "Close — apply while you close a gap or two" };
  if (t.currentRungIdx < 0) return { cls: "foundation", text: "Foundation first — realistic in roughly 6–12 months" };
  return { cls: "stretch", text: "A stretch right now — keep building" };
}

function fitWord(fit) {
  if (fit >= 0.6) return "Strong match";
  if (fit >= 0.42) return "Good — worth exploring";
  if (fit >= 0.28) return "A stretch";
  return "Probably not your lane";
}

// --------------------------------------------------------------- results
function renderResults() {
  const ranked = computeTracks();
  const top = ranked[0];
  const td = TRACKS_DATA[top.track];
  const rungs = td.rungs;

  // Ladder stops: current -> next (Year 1) -> mid (2-4) -> senior (5-10)
  const nextIdx = top.startIdx;
  const midIdx = Math.min(nextIdx + 1, rungs.length - 1);
  const seniorIdx = rungs.length - 1;
  const current = top.currentRungIdx >= 0 ? rungs[top.currentRungIdx] : null;
  const ready = readinessLabel(top);

  const card = el("section", { class: "card" }, [el("h2", {}, "Your roadmap")]);

  // One-sentence situation summary.
  const startDesc = current ? `around <strong>${current.title}</strong>` : "<strong>entering security</strong> (not yet on a ladder)";
  card.appendChild(
    el("div", { class: "callout" }, [
      el("p", { html: `You're currently ${startDesc}. Your strongest direction is <strong>${td.label}</strong> — <em>${fitWord(top.fit)}</em>. Your likely next move: <strong>${rungs[nextIdx].title}</strong>.` }),
      el("p", { class: "muted small", html: td.blurb }),
    ])
  );

  // Certs held that aren't part of THIS track's ladder at all — without this
  // note it looks like they were silently ignored rather than just being for
  // a different path (e.g. a GRC cert doesn't reduce what's needed for Cloud).
  const trackCertPool = new Set();
  rungs.forEach((r) => r.certs.forEach((id) => trackCertPool.add(id)));
  const heldElsewhere = state.certs.filter((id) => !trackCertPool.has(id));
  if (heldElsewhere.length) {
    card.appendChild(
      el(
        "p",
        { class: "muted small" },
        `Certs you hold that aren't part of this particular ladder: ${heldElsewhere.map(certName).join(", ")} — not wasted, just not what this specific path leans on.`
      )
    );
  }

  // Fork detection: interests genuinely split toward a different track. Based on
  // what they're DRAWN to (interest), not blended fit — that's what "I'm torn"
  // actually means. The primary ladder still follows overall fit.
  const second = ranked
    .filter((r) => r.track !== top.track)
    .sort((a, b) => b.interest - a.interest)[0];
  const isFork = second && top.interest > 0 && second.interest >= 0.6 * top.interest && second.interest >= 0.25;
  if (isFork) {
    const td2 = TRACKS_DATA[second.track];
    card.appendChild(
      el("div", { class: "fork" }, [
        el("h3", {}, "You look torn between two directions"),
        el("p", { class: "muted small" }, "Your answers pull almost equally toward two tracks. They're genuinely different day-to-day — here's the contrast to help you choose:"),
        el("div", { class: "fork-grid" }, [
          el("div", { class: "fork-col" }, [el("h4", {}, td.label), el("p", { class: "small" }, td.dayInLife)]),
          el("div", { class: "fork-col" }, [el("h4", {}, td2.label), el("p", { class: "small" }, td2.dayInLife)]),
        ]),
        el("p", { class: "small muted" }, "Not sure? Pick the one whose day-in-the-life you'd rather have on a bad week. You can test-drive a track by volunteering for that kind of work in your current role before committing."),
      ])
    );
  } else {
    // Not a behavioral fork, but a skills/certs-driven secondary path can still
    // be worth knowing about even when the interest quiz didn't surface it.
    const runnerUp = ranked[1];
    if (runnerUp && runnerUp.fit >= 0.25) {
      card.appendChild(
        el(
          "p",
          { class: "muted small" },
          `Worth knowing: your next-best fit is ${TRACKS_DATA[runnerUp.track].label} (${fitWord(runnerUp.fit)}) — see "How your other directions ranked" below.`
        )
      );
    }
  }

  // The ladder timeline.
  card.appendChild(el("h3", {}, `Roadmap: ${td.label}`));
  const timeline = el("div", { class: "timeline" });
  const skippedRungs = rungs.slice(midIdx + 1, seniorIdx).map((r) => r.title);

  function stage(when, rung, opts = {}) {
    const recs = recommendCerts(rung.certs, top.track);
    const held = rung.certs.filter((c) => state.certs.includes(c));
    const body = [
      el("h4", {}, rung.title),
      opts.readiness ? el("span", { class: "badge badge-" + opts.readiness.cls }, opts.readiness.text) : null,
      held.length ? el("p", { class: "small" }, [el("strong", {}, "Already covered: "), held.map(certName).join(", ")]) : null,
    ];
    // The "Now" row anchors where you are — it's not a goal, so don't list certs to chase there.
    if (!opts.now) {
      body.push(
        recs.length
          ? el("p", { class: "small" }, [el("strong", {}, "Certs to target: "), el("span", { html: recs.map((c) => `${certName(c)} <span class="muted">(${cert(c).blurb})</span>`).join("; ") })])
          : el("p", { class: "small muted" }, "No cert beyond what you hold is needed for this rung specifically — proof of work matters more here.")
      );
    }
    if (opts.viaNote) body.push(el("p", { class: "small muted" }, `Also along the way: ${opts.viaNote}`));
    return el("div", { class: "timeline-row" + (opts.now ? " timeline-now" : "") }, [
      el("div", { class: "timeline-when" }, when),
      el("div", { class: "timeline-body" }, body),
    ]);
  }

  if (current) timeline.appendChild(stage("Now", current, { now: true }));
  timeline.appendChild(stage("Year 1", rungs[nextIdx], { readiness: ready }));
  if (midIdx > nextIdx) timeline.appendChild(stage("Years 2–4", rungs[midIdx]));
  if (seniorIdx > midIdx) timeline.appendChild(stage("Years 5–10", rungs[seniorIdx], { viaNote: skippedRungs.length ? skippedRungs.join(" → ") : null }));
  card.appendChild(timeline);

  // Generic proof-of-work nudge (applies to every track).
  card.appendChild(
    el("div", { class: "callout callout-soft" }, [
      el("strong", {}, "Certs open doors; proof gets you hired. "),
      el("span", {}, "Alongside the certs above, build a home lab, publish a project or writeup, and reframe your existing experience in security terms on your resume. For hands-on tracks, demonstrable work (labs, CTFs, a public project) often counts as much as paper."),
    ])
  );

  // Skill gaps for the recommended track.
  const lv = skillLevels();
  const gapIds = Object.keys(td.skillWeights).filter((id) => lv[id] < 3);
  if (gapIds.length) {
    card.appendChild(
      el("div", { class: "callout" }, [
        el("strong", {}, "Skills to grow for this track: "),
        el("span", {}, gapIds.map((id) => SKILLS.find((s) => s.id === id).label).join(", ")),
      ])
    );
  }

  // Enjoyment mismatch: skilled/eligible on paper but said they don't want more of it.
  const dislikedRelevant = Object.keys(td.skillWeights).filter(
    (id) => state.skillAffinity[id] === "dislike" && td.skillWeights[id] >= 0.4
  );
  if (dislikedRelevant.length) {
    card.appendChild(
      el("div", { class: "callout" }, [
        el("strong", {}, "Worth a gut check: "),
        el(
          "span",
          {},
          `This track leans heavily on ${dislikedRelevant.map((id) => SKILLS.find((s) => s.id === id).label).join(", ")} — you said you don't want more of that kind of work. Skill and interest scores don't capture day-to-day enjoyment, so weigh that before committing.`
        ),
      ])
    );
  }

  // Secondary: how the other tracks ranked (in words, not "eligible now" spam).
  const details = el("details", { class: "rank-details" }, [el("summary", {}, "How your other directions ranked")]);
  const rankList = el("div", { class: "rank-list" });
  ranked.forEach((r) => {
    const rd = TRACKS_DATA[r.track];
    const dislikedHere = Object.keys(rd.skillWeights).filter((id) => state.skillAffinity[id] === "dislike" && rd.skillWeights[id] >= 0.4);
    rankList.appendChild(
      el("div", { class: "rank-row" }, [
        el("span", { class: "rank-name" }, [
          rd.label,
          dislikedHere.length
            ? el("span", { class: "muted small" }, ` — lower partly because you said no to ${dislikedHere.map((id) => SKILLS.find((s) => s.id === id).label).join(", ")}`)
            : null,
        ]),
        el("span", { class: "rank-word" }, fitWord(r.fit)),
      ])
    );
  });
  details.appendChild(rankList);
  card.appendChild(details);

  card.appendChild(
    el("div", { class: "nav-row" }, [
      el("button", { class: "btn-secondary", onclick: () => goTo("interests") }, "Back"),
      el("button", { class: "btn-secondary", onclick: resetAll }, "Start over"),
      el("button", { class: "btn-primary", onclick: () => copyResults(ranked) }, "Copy roadmap"),
    ])
  );
  return card;
}

function copyResults(ranked) {
  const top = ranked[0];
  const td = TRACKS_DATA[top.track];
  const rungs = td.rungs;
  const nextIdx = top.startIdx;
  const midIdx = Math.min(nextIdx + 1, rungs.length - 1);
  const seniorIdx = rungs.length - 1;
  const current = top.currentRungIdx >= 0 ? rungs[top.currentRungIdx] : null;

  const line = (when, rung) => {
    const recs = recommendCerts(rung.certs, top.track).map(certName);
    return `${when}: ${rung.title}${recs.length ? ` — certs: ${recs.join(", ")}` : ""}`;
  };

  const out = [
    `Cybersecurity roadmap — strongest direction: ${td.label} (${fitWord(top.fit)})`,
    current ? `Now: ${current.title}` : "Now: entering security",
    "",
  ];
  out.push(line("Year 1", rungs[nextIdx]));
  if (midIdx > nextIdx) out.push(line("Years 2-4", rungs[midIdx]));
  if (seniorIdx > midIdx) out.push(line("Years 5-10", rungs[seniorIdx]));
  out.push("", "Proof > paper: build a home lab, publish a project/writeup, reframe your experience in security terms.");
  navigator.clipboard?.writeText(out.join("\n"));
}

render();
