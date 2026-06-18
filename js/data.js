// Data model for the Cybersecurity Career Path Finder.
// Skill categories, scenario-based interest quiz, certifications, and career
// paths are derived from the role/skill/certification guidance in Dice's
// "How to Craft Your Cybersecurity Career Roadmap" article and the NICE
// Workforce Framework / CyberSeek pathway tool it points readers to.

// How "ready now" you are coming in, used to set realistic Year 1 expectations.
const EXPERIENCE_LEVELS = [
  {
    id: "none",
    label: "No formal IT or security job experience",
    desc: "Self-taught, coursework, or just getting started",
    weight: 0,
  },
  {
    id: "it",
    label: "IT experience, not security-focused",
    desc: "e.g. help desk, sysadmin, networking — but not a dedicated security role",
    weight: 1,
  },
  {
    id: "exposure",
    label: "Some security exposure",
    desc: "Security tasks inside a broader role, an internship, or junior security work",
    weight: 2,
  },
  {
    id: "security",
    label: "Currently working in a dedicated security role",
    desc: "Security is already your job title or primary responsibility",
    weight: 3,
  },
];

// Master certification list. Career paths reference these by id so that
// certs the user already holds can be excluded from their roadmap.
const CERTIFICATIONS = [
  { id: "aplus", name: "CompTIA A+" },
  { id: "netplus", name: "CompTIA Network+" },
  { id: "secplus", name: "CompTIA Security+" },
  { id: "cc", name: "(ISC)² Certified in Cybersecurity (CC)" },
  { id: "gsec", name: "GIAC Security Essentials (GSEC)" },
  { id: "awscp", name: "AWS Certified Cloud Practitioner" },
  { id: "az900", name: "Microsoft AZ-900" },
  { id: "ejpt", name: "eLearnSecurity Junior Penetration Tester (eJPT)" },
  { id: "cysa", name: "CompTIA CySA+" },
  { id: "gcih", name: "GIAC Certified Incident Handler (GCIH)" },
  { id: "ceh", name: "Certified Ethical Hacker (CEH)" },
  { id: "oscp", name: "OSCP" },
  { id: "awssec", name: "AWS Certified Security – Specialty" },
  { id: "az500", name: "Microsoft AZ-500" },
  { id: "cisa", name: "CISA" },
  { id: "crisc", name: "CRISC" },
  { id: "cissp", name: "CISSP" },
  { id: "gcfa", name: "GIAC Certified Forensic Analyst (GCFA)" },
  { id: "grem", name: "GIAC Reverse Engineering Malware (GREM)" },
  { id: "osce3", name: "OSCE3" },
  { id: "gxpn", name: "GIAC Exploit Researcher (GXPN)" },
  { id: "ccsp", name: "(ISC)² CCSP" },
  { id: "cism", name: "CISM" },
  { id: "gslc", name: "GIAC Strategic Leadership (GSLC)" },
];

function certName(id) {
  const c = CERTIFICATIONS.find((c) => c.id === id);
  return c ? c.name : id;
}

// Skills are assessed by checking off concrete things you've actually done,
// not by guessing a number on a scale. Your level is inferred from the
// highest task you can honestly check. Anchors describe what each level
// means so the inferred result is easy to sanity-check.
const SKILLS = [
  {
    id: "networking",
    label: "Networking & Systems Fundamentals",
    desc: "TCP/IP, firewalls, OS administration",
    anchors: [
      "No experience configuring networks or servers",
      "Know the concepts (OSI model, IP addressing) but limited hands-on",
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
      "Regularly script to solve work problems (parsing logs, automating checks)",
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
      "Secure cloud environments as part of real work (IAM, networking, posture)",
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
      "Helped handle a real incident (containment, evidence, timeline)",
      "Led an incident response or owns the IR process",
    ],
    tasks: [
      { text: "I understand the phases of incident response (prep, detect, contain, eradicate, recover)", level: 1 },
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

// Vague, scenario-style prompts. Pick everything that genuinely appeals —
// there's no "correct" track per scenario and selections aren't limited to one.
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

const PATHS = [
  {
    id: "soc-analyst",
    name: "SOC Analyst / Security Operations",
    summary: "Monitor security tooling, triage alerts, and respond to incidents as the front line of defense.",
    trackWeights: { defense: 1, offense: 0, cloud: 0, grc: 0.2, leadership: 0 },
    skillWeights: { networking: 1, siem: 1, scripting: 0.5, ir: 0.5 },
    certs: {
      entry: ["secplus", "cc", "gsec"],
      mid: ["cysa", "gcih"],
      senior: ["gcfa", "cissp"],
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
      entry: ["secplus", "gsec"],
      mid: ["gcih", "gcfa", "cysa"],
      senior: ["grem", "oscp"],
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
      entry: ["secplus", "ejpt"],
      mid: ["oscp", "ceh"],
      senior: ["osce3", "gxpn"],
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
      entry: ["secplus", "awscp", "az900"],
      mid: ["awssec", "az500"],
      senior: ["ccsp", "cissp"],
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
      entry: ["cc", "secplus"],
      mid: ["cisa", "crisc"],
      senior: ["cism", "cissp"],
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
      entry: ["secplus"],
      mid: ["cissp"],
      senior: ["cism", "gslc"],
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
