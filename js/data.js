// Data model for the Cybersecurity Career Path Finder.
// Skill categories, interest-quiz tracks, and career paths are derived from
// the role/skill/certification guidance in Dice's "How to Craft Your
// Cybersecurity Career Roadmap" article and the NICE Workforce Framework /
// CyberSeek pathway tool it points readers to.

const SKILLS = [
  { id: "networking", label: "Networking & Systems Fundamentals", desc: "TCP/IP, firewalls, OS administration" },
  { id: "siem", label: "Security Monitoring & SIEM", desc: "Log triage, alert analysis, tools like Splunk" },
  { id: "scripting", label: "Scripting & Automation", desc: "Python, PowerShell, Bash" },
  { id: "crypto", label: "Cryptography & Data Protection", desc: "Encryption, PKI, secure protocols" },
  { id: "cloud", label: "Cloud Platforms", desc: "AWS, Azure, GCP security configuration" },
  { id: "ir", label: "Incident Response & Forensics", desc: "Containment, eradication, investigation" },
  { id: "grc", label: "GRC: Policy, Risk & Compliance", desc: "NIST 800-53, ISO 27001, audits" },
  { id: "offense", label: "Offensive Security / Ethical Hacking", desc: "Penetration testing, exploitation" },
  { id: "malware", label: "Malware Analysis & Reverse Engineering", desc: "Static/dynamic analysis, disassembly" },
];

const SKILL_LEVELS = ["No experience", "Aware of it", "Some hands-on", "Comfortable", "Strong / expert"];

const TRACKS = ["defense", "offense", "cloud", "grc", "leadership"];

const QUESTIONS = [
  {
    text: "When a system breaks unexpectedly, what's your instinct?",
    options: [
      { track: "defense", text: "Dig into the logs to find the root cause" },
      { track: "offense", text: "Think about how it could be exploited before someone else does" },
      { track: "grc", text: "Make sure it's documented and a policy exists to prevent recurrence" },
      { track: "cloud", text: "Redesign the architecture so it's resilient by default" },
      { track: "leadership", text: "Coordinate the response and brief leadership on impact" },
    ],
  },
  {
    text: "Which project sounds most appealing?",
    options: [
      { track: "defense", text: "Building detection rules and triaging alerts in a SOC" },
      { track: "offense", text: "Running a penetration test against a client's network" },
      { track: "cloud", text: "Migrating infrastructure to a secure cloud architecture" },
      { track: "grc", text: "Leading a risk assessment and writing the compliance report" },
      { track: "leadership", text: "Building the security roadmap and budget for a department" },
    ],
  },
  {
    text: "Pick the work style that fits you best:",
    options: [
      { track: "defense", text: "Reactive, fast-paced, watching dashboards" },
      { track: "offense", text: "Creative and adversarial, thinking like an attacker" },
      { track: "cloud", text: "Systems-oriented, designing for scale" },
      { track: "grc", text: "Structured, detail-oriented, policy-driven" },
      { track: "leadership", text: "People-oriented, strategic, decision-making" },
    ],
  },
  {
    text: "What's most satisfying to you?",
    options: [
      { track: "defense", text: "Catching a threat before it causes damage" },
      { track: "offense", text: "Finding a vulnerability nobody else found" },
      { track: "cloud", text: "Designing a system that's secure from day one" },
      { track: "grc", text: "Bringing a team into compliance with a framework" },
      { track: "leadership", text: "Mentoring a team and shaping strategy" },
    ],
  },
  {
    text: "Which tool or activity excites you most?",
    options: [
      { track: "defense", text: "SIEM dashboards and log correlation" },
      { track: "offense", text: "Exploit frameworks and red-team tooling" },
      { track: "cloud", text: "Infrastructure-as-code and cloud security posture tools" },
      { track: "grc", text: "Risk registers and audit frameworks" },
      { track: "leadership", text: "Roadmaps, budgets, and cross-team coordination" },
    ],
  },
  {
    text: "Your ideal first 90 days at a new security job:",
    options: [
      { track: "defense", text: "Learning the detection stack, shadowing the SOC" },
      { track: "offense", text: "Running your first authorized pentest engagement" },
      { track: "cloud", text: "Hardening cloud environments and IAM policies" },
      { track: "grc", text: "Mapping controls to a compliance framework" },
      { track: "leadership", text: "Setting goals and proving impact to stakeholders" },
    ],
  },
];

const PATHS = [
  {
    id: "soc-analyst",
    name: "SOC Analyst / Security Operations",
    summary: "Monitor security tooling, triage alerts, and respond to incidents as the front line of defense.",
    trackWeights: { defense: 1, offense: 0, cloud: 0, grc: 0.2, leadership: 0 },
    skillWeights: { networking: 1, siem: 1, scripting: 0.5, ir: 0.5 },
    certs: {
      entry: ["CompTIA Security+", "(ISC)² Certified in Cybersecurity (CC)", "GIAC Security Essentials (GSEC)"],
      mid: ["CompTIA CySA+", "GIAC Certified Incident Handler (GCIH)"],
      senior: ["GIAC Certified Forensic Analyst (GCFA)", "CISSP"],
    },
    shortTermGoals: [
      "Earn CompTIA Security+",
      "Build a home lab with a free SIEM (e.g. Splunk Free, Wazuh) and generate/triage sample alerts",
      "Attend a local security meetup or join a CTF",
      "Apply to 3 SOC analyst or junior security roles",
    ],
    longTermGoals: ["Move into threat hunting or incident response", "Earn CISSP as you take on more ownership"],
  },
  {
    id: "threat-hunter",
    name: "Threat Hunter / Incident Responder",
    summary: "Proactively hunt for hidden threats and lead the investigation when something goes wrong.",
    trackWeights: { defense: 1, offense: 0.3, cloud: 0, grc: 0, leadership: 0 },
    skillWeights: { siem: 1, ir: 1, malware: 0.7, networking: 0.5 },
    certs: {
      entry: ["CompTIA Security+", "GIAC Security Essentials (GSEC)"],
      mid: ["GIAC Certified Incident Handler (GCIH)", "GIAC Certified Forensic Analyst (GCFA)", "CompTIA CySA+"],
      senior: ["GIAC Reverse Engineering Malware (GREM)", "OSCP"],
    },
    shortTermGoals: [
      "Earn Security+ or GSEC",
      "Practice incident scenarios in a home lab (e.g. Blue Team Labs, LetsDefend)",
      "Join an incident-response or DFIR community",
      "Apply to 3 IR/threat-hunting or SOC tier-2 roles",
    ],
    longTermGoals: ["Specialize in digital forensics or malware analysis", "Lead an incident response team"],
  },
  {
    id: "pentester",
    name: "Penetration Tester / Red Teamer",
    summary: "Find and exploit weaknesses before attackers do, through authorized offensive testing.",
    trackWeights: { offense: 1, defense: 0.2, cloud: 0, grc: 0, leadership: 0 },
    skillWeights: { offense: 1, scripting: 0.8, networking: 0.7, malware: 0.4 },
    certs: {
      entry: ["CompTIA Security+", "eLearnSecurity Junior Penetration Tester (eJPT)"],
      mid: ["OSCP", "Certified Ethical Hacker (CEH)"],
      senior: ["OSCE3", "GIAC Exploit Researcher (GXPN)"],
    },
    shortTermGoals: [
      "Earn Security+, then start eJPT or PNPT",
      "Build a home lab and complete boxes on HackTheBox/TryHackMe",
      "Compete in a CTF",
      "Apply to 3 junior pentester or red-team roles",
    ],
    longTermGoals: ["Earn OSCP and specialize (web, cloud, AD, mobile)", "Move into red team lead or exploit development"],
  },
  {
    id: "cloud-security",
    name: "Cloud Security Engineer / Architect",
    summary: "Secure cloud infrastructure and design resilient, compliant cloud architectures.",
    trackWeights: { cloud: 1, defense: 0.2, offense: 0, grc: 0, leadership: 0 },
    skillWeights: { cloud: 1, networking: 0.6, scripting: 0.6, crypto: 0.4 },
    certs: {
      entry: ["CompTIA Security+", "AWS Certified Cloud Practitioner", "Microsoft AZ-900"],
      mid: ["AWS Certified Security – Specialty", "Microsoft AZ-500"],
      senior: ["(ISC)² CCSP", "CISSP"],
    },
    shortTermGoals: [
      "Earn Security+ and a cloud-provider foundations cert",
      "Build and secure a project in a free-tier AWS/Azure/GCP account",
      "Join a cloud security community or study group",
      "Apply to 3 cloud security engineer roles",
    ],
    longTermGoals: ["Earn AWS Security Specialty or CCSP", "Move into cloud security architecture"],
  },
  {
    id: "grc-analyst",
    name: "GRC / Risk & Compliance Analyst",
    summary: "Assess risk, manage compliance programs, and translate frameworks into action.",
    trackWeights: { grc: 1, leadership: 0.3, defense: 0, offense: 0, cloud: 0 },
    skillWeights: { grc: 1, crypto: 0.3 },
    certs: {
      entry: ["(ISC)² Certified in Cybersecurity (CC)", "CompTIA Security+"],
      mid: ["CISA", "CRISC"],
      senior: ["CISM", "CISSP"],
    },
    shortTermGoals: [
      "Earn (ISC)² CC or Security+",
      "Get hands-on with a framework like NIST 800-53 or ISO 27001 (map controls for a sample org)",
      "Join a GRC or compliance community",
      "Apply to 3 risk/compliance analyst roles",
    ],
    longTermGoals: ["Earn CISA or CRISC", "Move into a CISM-track risk or compliance leadership role"],
  },
  {
    id: "security-leadership",
    name: "Security Leadership (Manager / CISO track)",
    summary: "Set strategy, own risk at the organizational level, and lead security teams.",
    trackWeights: { leadership: 1, grc: 0.4, defense: 0, offense: 0, cloud: 0 },
    skillWeights: { grc: 0.6, ir: 0.4, cloud: 0.3 },
    certs: {
      entry: ["CompTIA Security+"],
      mid: ["CISSP"],
      senior: ["CISM", "GIAC Strategic Leadership (GSLC)"],
    },
    shortTermGoals: [
      "Build deep experience in one technical track first (defense, offense, cloud, or GRC)",
      "Take on a mentoring or team-lead opportunity",
      "Start studying for CISSP",
      "Apply for senior/lead roles that include people or program management",
    ],
    longTermGoals: ["Earn CISSP and then CISM", "Move into a security manager, director, or CISO role"],
  },
];
