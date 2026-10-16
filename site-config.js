/* ===== SITE CONFIG — edit this file only =====================================
   Contact channels and demo settings used by every page.
   Leave a channel's value empty ("") to hide it. */

window.NAET_CONTACT = {
  title: "Get in touch",
  intro:
    "Pick whichever channel suits you. We'll walk through your programmes, grading policy, and escalation chain.",
  note: "Typical response time: within one working day.",
  // type: "email" | "phone" | "whatsapp" | "link" | "text"
  channels: [
    { type: "email", label: "EMAIL", value: "" },
    { type: "phone", label: "PHONE", value: "" },
    { type: "whatsapp", label: "WHATSAPP", value: "" },
    { type: "link", label: "BOOK A CALL", value: "Pick a time", href: "" },
    { type: "text", label: "OFFICE", value: "" },
  ],
};

window.NAET_DEMO = {
  url: "https://naet-tat2.onrender.com/",
  note: "Demo resets every 24 hours",
  // Link to a page/file listing the logins (opens in a new tab). "" = use the contact flow.
  credentialsUrl: "credentials.txt",
  credentialsLabel: "Get credentials",
  // Add entries to show a click-to-copy table instead:
  // { role: "Registrar", username: "registrar@example.com", password: "change-me" }
  credentials: [],
};
