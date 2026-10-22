/* ===== SITE CONFIG — edit this file only =====================================
   Contact channels and demo settings used by every page.
   Leave a channel's value empty ("") to hide it. */

window.NAET_CONTACT = {
  title: "Get in touch",
  intro:
    "Pick whichever channel suits you. We'll walk through your programmes, grading policy, and escalation chain.",
  note: "Typical response time: within one working day.",
  countryCode: "254",
  whatsappMessage: "Hello Naet, I'd like to request a walkthrough.",
  floatingWhatsApp: false, // set false to hide the floating button
  channels: [
    { type: "email", label: "EMAIL", value: "naetrecords.help@gmail.com" },
    { type: "phone", label: "PHONE", value: "0180793705" },
    { type: "whatsapp", label: "WHATSAPP", value: "0180793705" },
    { type: "link", label: "BOOK A CALL", value: "", href: "" },
    { type: "text", label: "OFFICE", value: "" },
  ],
};

window.NAET_VIDEOS = [
  {
    id: "overview",
    url: "./Naet__Lifecycle_of_Data.mp4",
    title: "Naet at a glance",
    caption: "How data moves through the student lifecycle.",
    poster: "",
  },
  {
    id: "architecture",
    url: "./Naet__The_Antidote_to_Chaos.mp4",
    title: "Architecture & design decisions",
    caption:
      "Why Naet is built the way it is: one record, pluggable integrations, and an auditable trail.",
    poster: "",
  },
];
// Leave the array empty (or give every video an empty url) and all "Watch"
// buttons stay hidden.

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
