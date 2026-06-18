// Data model for the Cybersecurity Career Path Finder.
// Built around the role/skill/certification guidance in Dice's "How to Craft
// Your Cybersecurity Career Roadmap" article and the NICE Workforce Framework /
// CyberSeek pathway tool it points readers to.
//
// Design notes (v3): instead of mapping people to one of six flat "paths", each
// track is a LADDER of role rungs (entry -> lead). The tool figures out roughly
// which rung you're already on (from experience + skills), then points at the
// NEXT rung and the ones beyond it — so a 10-year roadmap actually progresses
// instead of repeating your current job title. Certs carry a level so we never
// recommend something at or below what you already hold.

// How "ready" you are coming in. Drives where on the ladder you currently sit.
const EXPERIENCE_LEVELS = [
  { id: "none", label: "No formal IT or security job experience", desc: "Self-taught, coursework, or just getting started", weight: 0, baseRung: 0 },
  { id: "it", label: "IT experience, not security-focused", desc: "e.g. help desk, sysadmin, networking — but not a dedicated security role", weight: 1, baseRung: 0 },
  { id: "exposure", label: "Some security exposure", desc: "Security tasks inside a broader role, an internship, or junior security work", weight: 2, baseRung: 1 },
  { id: "security", label: "Currently working in a dedicated security role", desc: "Security is already your job title or primary responsibility", weight: 3, baseRung: 1 },
];

// Master certification list. `level`: 1=entry, 2=associate/hands-on,
// 3=professional/mid, 4=senior/expert. Recommendations never include a cert
// whose level is <= the highest level you already hold (so a CISA holder is
// never told to "go get Security+").
const CERTIFICATIONS = [
  { id: "aplus", name: "CompTIA A+", level: 1, blurb: "IT support fundamentals" },
  { id: "netplus", name: "CompTIA Network+", level: 1, blurb: "core networking" },
  { id: "secplus", name: "CompTIA Security+", level: 1, blurb: "baseline security knowledge; a common HR/ATS filter" },
  { id: "cc", name: "(ISC)² Certified in Cybersecurity (CC)", level: 1, blurb: "entry-level security cert" },
  { id: "gsec", name: "GIAC Security Essentials (GSEC)", level: 2, blurb: "hands-on security essentials" },
  { id: "awscp", name: "AWS Certified Cloud Practitioner", level: 1, blurb: "AWS cloud fundamentals" },
  { id: "az900", name: "Microsoft AZ-900", level: 1, blurb: "Azure fundamentals" },
  { id: "ejpt", name: "eLearnSecurity Junior Penetration Tester (eJPT)", level: 2, blurb: "entry hands-on pentesting" },
  { id: "cysa", name: "CompTIA CySA+", level: 2, blurb: "analyst / behavioral threat detection" },
  { id: "gcih", name: "GIAC Certified Incident Handler (GCIH)", level: 3, blurb: "incident handling" },
  { id: "ceh", name: "Certified Ethical Hacker (CEH)", level: 2, blurb: "broad ethical-hacking overview" },
  { id: "oscp", name: "OSCP", level: 3, blurb: "hands-on offensive benchmark cert" },
  { id: "awssec", name: "AWS Certified Security – Specialty", level: 3, blurb: "AWS security depth" },
  { id: "az500", name: "Microsoft AZ-500", level: 3, blurb: "Azure security engineer" },
  { id: "cisa", name: "CISA", level: 3, blurb: "IS audit; well respected in GRC" },
  { id: "crisc", name: "CRISC", level: 3, blurb: "IT risk management" },
  { id: "cissp", name: "CISSP", level: 4, blurb: "senior security breadth; a management-track staple" },
  { id: "gcfa", name: "GIAC Certified Forensic Analyst (GCFA)", level: 3, blurb: "digital forensics" },
  { id: "grem", name: "GIAC Reverse Engineering Malware (GREM)", level: 4, blurb: "malware reverse engineering" },
  { id: "osce3", name: "OSCE3", level: 4, blurb: "expert-level offensive" },
  { id: "gxpn", name: "GIAC Exploit Researcher (GXPN)", level: 4, blurb: "exploit development" },
  { id: "ccsp", name: "(ISC)² CCSP", level: 3, blurb: "cloud security professional" },
  { id: "cism", name: "CISM", level: 4, blurb: "security management & governance leadership" },
  { id: "gslc", name: "GIAC Strategic Leadership (GSLC)", level: 4, blurb: "security leadership" },
];

function cert(id) {
  return CERTIFICATIONS.find((c) => c.id === id) || { id, name: id, level: 1, blurb: "" };
}
function certName(id) {
  return cert(id).name;
}

// Skills assessed by checking off concrete things you've actually done. Level is
// inferred from the highest task you can honestly check. The "leadership" axis is
// deliberately NON-technical so GRC / management-bound people aren't scored as if
// hands-on hacking were the only thing that counts.
const SKILLS = [
  {
    id: "networking",
    label: "Networking & Systems Fundamentals",
    desc: "TCP/IP, firewalls, OS administration",
    anchors: [
      "No experience configuring networks or servers",
      "Know the concepts but limited hands-on",
      "Set up a home network/lab or applied basic firewall rules",
      "Administer systems or networks regularly and troubleshoot independently",
      "Design network architecture or harden complex environments",
    ],
    tasks: [
      { text: "I can explain how TCP/IP and subnetting work", level: 2 },
      { text: "I've set up a home lab, VMs, or personal network gear", level: 3 },
      { text: "I've configured firewall rules or ACLs on a real system", level: 3 },
      { text: "I administer servers or networks as part of a job or serious project", level: 4 },
      { text: "I've designed or hardened a production network/system architecture", level: 5 },
    ],
  },
  {
    id: "siem",
    label: "Security Monitoring & SIEM",
    desc: "Log triage, alert analysis, tools like Splunk",
    anchors: [
      "Haven't looked at security logs or alerts",
      "Know what a SIEM is but haven't used one",
      "Have explored a SIEM in a lab (Splunk Free, Wazuh, ELK)",
      "Regularly triage real alerts and write detection queries",
      "Build or tune detection content and lead alert-handling processes",
    ],
    tasks: [
      { text: "I know what a SIEM is and what it's used for", level: 1 },
      { text: "I've explored a SIEM in a lab (Splunk Free, Wazuh, ELK, etc.)", level: 3 },
      { text: "I've triaged real security alerts as part of a job", level: 4 },
      { text: "I've written or tuned detection rules/queries", level: 4 },
      { text: "I've built or led a detection/alerting strategy for a team", level: 5 },
    ],
  },
  {
    id: "scripting",
    label: "Scripting & Automation",
    desc: "Python, PowerShell, Bash",
    anchors: [
      "Haven't written a script",
      "Can follow/modify a script someone else wrote",
      "Write small scripts to automate personal tasks",
      "Regularly script to solve work problems",
      "Build tools or automation other people rely on",
    ],
    tasks: [
      { text: "I can read and modify a script someone else wrote", level: 2 },
      { text: "I've written a script from scratch to automate something for myself", level: 3 },
      { text: "I've used a script to parse logs or process security data", level: 4 },
      { text: "I script regularly to solve real problems at work or in projects", level: 4 },
      { text: "I've built a tool or automation that other people use", level: 5 },
    ],
  },
  {
    id: "crypto",
    label: "Cryptography & Data Protection",
    desc: "Encryption, PKI, secure protocols",
    anchors: [
      "Don't know how encryption is applied in practice",
      "Understand basic concepts (symmetric vs asymmetric, hashing)",
      "Have configured TLS/certificates or encrypted storage",
      "Comfortable evaluating crypto choices for a real system",
      "Design or audit cryptographic implementations",
    ],
    tasks: [
      { text: "I understand the difference between symmetric and asymmetric encryption", level: 2 },
      { text: "I've set up TLS/HTTPS certificates for a site or service", level: 3 },
      { text: "I've configured encrypted storage or a VPN", level: 3 },
      { text: "I've evaluated or chosen crypto/protocol options for a real project", level: 4 },
      { text: "I've audited or designed a cryptographic implementation", level: 5 },
    ],
  },
  {
    id: "cloud",
    label: "Cloud Platforms",
    desc: "AWS, Azure, GCP security configuration",
    anchors: [
      "Haven't used a cloud platform",
      "Have a free-tier account and have clicked around",
      "Deployed and configured resources in a cloud account",
      "Secure cloud environments as part of real work",
      "Architect secure cloud infrastructure at scale",
    ],
    tasks: [
      { text: "I have a free-tier AWS/Azure/GCP account and have used the console", level: 2 },
      { text: "I've deployed and configured real resources (VMs, storage, etc.)", level: 3 },
      { text: "I've configured IAM policies or security groups for a cloud project", level: 4 },
      { text: "I secure or audit cloud environments as part of a job", level: 4 },
      { text: "I've architected secure cloud infrastructure for production use", level: 5 },
    ],
  },
  {
    id: "ir",
    label: "Incident Response & Forensics",
    desc: "Containment, eradication, investigation",
    anchors: [
      "Never been part of handling a security incident",
      "Understand the IR lifecycle conceptually",
      "Practiced incident scenarios in a lab or course",
      "Helped handle a real incident",
      "Led an incident response or own the IR process",
    ],
    tasks: [
      { text: "I understand the phases of incident response", level: 1 },
      { text: "I've practiced IR scenarios in a lab (Blue Team Labs, LetsDefend, CTF, etc.)", level: 3 },
      { text: "I've helped investigate or document a real security incident", level: 4 },
      { text: "I've performed forensic analysis on a compromised system", level: 4 },
      { text: "I've led an incident response or own the IR process for a team", level: 5 },
    ],
  },
  {
    id: "grc",
    label: "GRC: Policy, Risk & Compliance",
    desc: "NIST 800-53, ISO 27001, audits",
    anchors: [
      "Haven't worked with a compliance framework",
      "Have read about frameworks like NIST or ISO 27001",
      "Mapped controls or completed a checklist against a framework",
      "Run risk assessments or audits as part of real work",
      "Own a compliance program or advise leadership on risk strategy",
    ],
    tasks: [
      { text: "I can name and describe a major framework (NIST 800-53, ISO 27001, etc.)", level: 1 },
      { text: "I've mapped controls or completed a self-assessment against a framework", level: 3 },
      { text: "I've contributed to a real risk assessment or audit", level: 4 },
      { text: "I've written or maintained a security policy used by a real team", level: 4 },
      { text: "I own or lead a compliance/risk program", level: 5 },
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Program Management",
    desc: "Risk strategy, stakeholder/board communication, running programs & teams (non-technical)",
    anchors: [
      "Haven't led projects or communicated with stakeholders in a work setting",
      "Have explained technical topics to non-technical people",
      "Have owned a project or initiative end-to-end",
      "Have managed a budget, vendor, program, or mentored others formally",
      "Have led or managed a team — hiring, performance, and strategy",
    ],
    tasks: [
      { text: "I've explained security or technical risk to non-technical stakeholders or execs", level: 2 },
      { text: "I've owned a project or initiative from start to finish", level: 3 },
      { text: "I've mentored or coached other people on the job", level: 3 },
      { text: "I've managed a budget, vendor relationship, or a formal program", level: 4 },
      { text: "I've led or managed a team (hiring, performance reviews, strategy)", level: 5 },
    ],
  },
  {
    id: "offense",
    label: "Offensive Security / Ethical Hacking",
    desc: "Penetration testing, exploitation",
    anchors: [
      "Haven't tried to break into a system",
      "Understand common attack techniques conceptually",
      "Solved boxes/CTF challenges on HackTheBox/TryHackMe",
      "Performed an authorized penetration test or vulnerability assessment",
      "Lead offensive engagements or develop new exploitation techniques",
    ],
    tasks: [
      { text: "I understand common attack techniques (e.g. the OWASP Top 10)", level: 2 },
      { text: "I've solved boxes or challenges on HackTheBox/TryHackMe/CTFs", level: 3 },
      { text: "I've used a tool like Burp Suite or Metasploit on a real or lab target", level: 3 },
      { text: "I've performed an authorized penetration test or vuln assessment", level: 4 },
      { text: "I lead offensive engagements or develop new exploitation techniques", level: 5 },
    ],
  },
  {
    id: "malware",
    label: "Malware Analysis & Reverse Engineering",
    desc: "Static/dynamic analysis, disassembly",
    anchors: [
      "Haven't looked inside a malware sample",
      "Understand the difference between static and dynamic analysis",
      "Run a sample in a sandbox or analyzed one in a lab exercise",
      "Performed real static/dynamic analysis to characterize a threat",
      "Reverse-engineer malware down to the disassembly/code level",
    ],
    tasks: [
      { text: "I know the difference between static and dynamic analysis", level: 2 },
      { text: "I've detonated a sample in a sandbox (e.g. ANY.RUN) or lab exercise", level: 3 },
      { text: "I've used a tool like Ghidra or IDA to look at a binary", level: 4 },
      { text: "I've performed real analysis to characterize a threat or sample", level: 4 },
      { text: "I reverse-engineer malware at the disassembly/code level", level: 5 },
    ],
  },
];

const TRACKS = ["defense", "offense", "cloud", "grc", "leadership"];

// Vague scenarios. Pick everything that genuinely appeals — more than one per
// scenario is expected. Each option maps to a track, but options aren't grouped
// or labeled by track on screen.
const SCENARIOS = [
  {
    setup: "Something's gone wrong systemwide and the on-call channel is blowing up. Nobody's fully sure what happened yet.",
    prompt: "What do you want to be doing right now?",
    options: [
      { track: "defense", text: "Pulling logs and timelines to figure out what actually happened" },
      { track: "offense", text: "Trying to reproduce it, or poke at how it could've been done" },
      { track: "leadership", text: "Talking to stakeholders about impact and what we tell people" },
      { track: "grc", text: "Drafting what the post-incident report and policy fix should say" },
      { track: "cloud", text: "Looking at whether the underlying architecture needs to change" },
    ],
  },
  {
    setup: "A new system is being planned from scratch and you get pulled into the early discussions.",
    prompt: "Which corner of the conversation do you gravitate to?",
    options: [
      { track: "cloud", text: "How it's built — infrastructure, scalability, where it lives" },
      { track: "offense", text: "How someone would try to break it" },
      { track: "defense", text: "How we'd know if something went wrong with it later" },
      { track: "grc", text: "What approvals, policies, or compliance requirements apply" },
      { track: "leadership", text: "What it costs, who owns it, and how it gets prioritized" },
    ],
  },
  {
    setup: "You get a free afternoon at work with no assigned tasks.",
    prompt: "What do you actually spend it on?",
    options: [
      { track: "offense", text: "Messing around on HackTheBox/TryHackMe or a CTF" },
      { track: "defense", text: "Digging through logs or alerts just to see what's there" },
      { track: "cloud", text: "Tinkering in a cloud account or home lab" },
      { track: "grc", text: "Reading up on a framework or writing documentation" },
      { track: "leadership", text: "Catching up with people — 1:1s, networking, planning" },
    ],
  },
  {
    setup: "You just joined a new team and want to make a real impression in week one.",
    prompt: "What do you focus your energy on?",
    options: [
      { track: "defense", text: "Learning the monitoring/detection stack inside and out" },
      { track: "offense", text: "Finding a weakness nobody else has flagged yet" },
      { track: "cloud", text: "Understanding and improving the infrastructure setup" },
      { track: "grc", text: "Mapping how the team's controls line up with a framework" },
      { track: "leadership", text: "Understanding goals, stakeholders, and how to show impact" },
    ],
  },
  {
    setup: "Scrolling through security news, one kind of story always makes you stop and read.",
    prompt: "Which one?",
    options: [
      { track: "offense", text: "A clever exploit or a researcher's writeup of a new attack" },
      { track: "defense", text: "How a SOC team caught (or missed) a breach in progress" },
      { track: "cloud", text: "A misconfiguration that exposed a cloud environment" },
      { track: "grc", text: "A company getting fined or sued over a compliance failure" },
      { track: "leadership", text: "A CISO's interview about strategy or building a security culture" },
    ],
  },
  {
    setup: "A junior teammate is overwhelmed and asks if you can help with something.",
    prompt: "What do you offer to help with?",
    options: [
      { track: "defense", text: "Walking them through triaging an alert" },
      { track: "offense", text: "Showing them how an attacker would approach it" },
      { track: "cloud", text: "Helping them fix a misconfigured resource" },
      { track: "grc", text: "Helping them understand a policy or requirement" },
      { track: "leadership", text: "Helping them prioritize and talk to their manager about workload" },
    ],
  },
];

// Each track is a ladder of rungs (entry -> lead). `skillWeights` drive the
// aptitude part of fit. `dayInLife` is used to help people choose between two
// close tracks. Rungs list role titles, the tier, and the certs typically
// associated with reaching that rung.
const TRACKS_DATA = {
  defense: {
    label: "Defensive Operations (Blue Team)",
    blurb: "Monitor, detect, hunt, and respond — the front line that keeps attackers out and catches them when they get in.",
    dayInLife: "Mostly hands-on-keyboard: dashboards, alerts, investigations. Fast-paced and reactive.",
    skillWeights: { siem: 1, ir: 0.8, networking: 0.6, scripting: 0.5 },
    rungs: [
      { tier: 1, title: "SOC Analyst (Tier 1)", certs: ["secplus", "cc", "gsec"] },
      { tier: 2, title: "SOC Analyst (Tier 2) / Senior Analyst", certs: ["cysa", "gcih"] },
      { tier: 3, title: "Threat Hunter / Incident Responder / Detection Engineer", certs: ["gcfa", "grem"] },
      { tier: 4, title: "DFIR Lead / Detection Engineering Lead / SOC Manager", certs: ["cissp", "gslc"] },
    ],
  },
  offense: {
    label: "Offensive Security (Red Team)",
    blurb: "Find and exploit weaknesses before real attackers do, through authorized testing.",
    dayInLife: "Deep hands-on and adversarial: breaking things, writing up findings. Project-based, often client-facing.",
    skillWeights: { offense: 1, scripting: 0.7, networking: 0.6, malware: 0.5 },
    rungs: [
      { tier: 1, title: "Junior Pentester / AppSec Tester", certs: ["secplus", "ejpt"] },
      { tier: 2, title: "Penetration Tester", certs: ["oscp", "ceh"] },
      { tier: 3, title: "Senior Pentester / Red Team Operator", certs: ["osce3"] },
      { tier: 4, title: "Red Team Lead / Exploit Developer / Researcher", certs: ["gxpn", "grem"] },
    ],
  },
  cloud: {
    label: "Cloud Security",
    blurb: "Secure cloud infrastructure and design resilient, compliant cloud architectures.",
    dayInLife: "Systems-oriented engineering: IAM, posture, infrastructure-as-code. Building and hardening, less firefighting.",
    skillWeights: { cloud: 1, networking: 0.5, scripting: 0.5, crypto: 0.4 },
    rungs: [
      { tier: 1, title: "Cloud Security Analyst (Associate)", certs: ["secplus", "awscp", "az900"] },
      { tier: 2, title: "Cloud Security Engineer", certs: ["awssec", "az500"] },
      { tier: 3, title: "Senior Cloud Security Engineer", certs: ["ccsp"] },
      { tier: 4, title: "Cloud Security Architect / Staff Engineer", certs: ["cissp"] },
    ],
  },
  grc: {
    label: "GRC: Governance, Risk & Compliance",
    blurb: "Assess risk, run compliance programs, and translate frameworks into action. Strong path for non-technical and audit backgrounds.",
    dayInLife: "Structured and people-facing: frameworks, policy, audits, stakeholder conversations. Little to no coding.",
    skillWeights: { grc: 1, leadership: 0.5 },
    rungs: [
      { tier: 1, title: "GRC / Risk & Compliance Analyst", certs: ["cc", "secplus"] },
      { tier: 2, title: "Senior GRC Analyst / IT Auditor", certs: ["cisa", "crisc"] },
      { tier: 3, title: "Risk / Compliance Manager", certs: ["cism"] },
      { tier: 4, title: "Director of Risk / GRC", certs: ["cissp"] },
    ],
  },
  leadership: {
    label: "Security Leadership (Management track)",
    blurb: "Set strategy, own risk at the organizational level, and lead security teams. Usually built on top of a technical or GRC foundation.",
    dayInLife: "People and strategy: meetings, hiring, budgets, board communication. Hands-off-keyboard.",
    skillWeights: { leadership: 1, grc: 0.4, ir: 0.3 },
    rungs: [
      { tier: 1, title: "Security Team Lead", certs: [] },
      { tier: 2, title: "Security Manager", certs: ["cissp"] },
      { tier: 3, title: "Director of Security", certs: ["cism"] },
      { tier: 4, title: "CISO / Head of Security", certs: ["gslc"] },
    ],
  },
};
