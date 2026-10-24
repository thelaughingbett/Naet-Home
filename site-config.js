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
    id: "record",
    url: "./Naet__System_of_Record.mp4",
    tab: "System of record",
    title: "What a system of record means for a university",
    caption: "One student record shared by every office.",
    poster: "",
  },
  {
    id: "portal",
    url: "./Naet__The_Portal_Cure.mp4",
    tab: "The portal problem",
    title: "The cure for the typical student portal",
    caption:
      "Why most university portals fail, and what Naet does differently.",
    poster: "",
  },
  {
    id: "overview",
    url: "./Naet__Lifecycle_of_Data.mp4",
    tab: "Student lifecycle",
    title: "Naet at a glance",
    caption: "How data moves through the student lifecycle.",
    poster: "",
  },
  {
    id: "architecture",
    url: "./Naet__The_Antidote_to_Chaos.mp4",
    tab: "Architecture",
    title: "Architecture & design decisions",
    caption: "Why Naet is built the way it is.",
    poster: "",
  },
  {
    id: "results",
    url: "./The_Journey_of_the_68.mp4",
    tab: "Result journey",
    title: "The journey of a result: lecturer to HOD to student",
    caption:
      "How a single grade is entered, approved by the Head of Department, and published.",
    poster: "",
  },
];
// Leave the array empty (or give every video an empty url) and all "Watch"
// buttons stay hidden.

window.NAET_DEMO = {
  url: "https://naet-tat2.onrender.com/",
  note: "Demo resets every 24 hours",
  // Link to a page/file listing the logins (opens in a new tab). "" = use the contact flow.
  credentialsUrl: "credentials.html",
  credentialsLabel: "Get credentials",
  // Add entries to show a click-to-copy table instead:
  // { role: "Registrar", username: "registrar@example.com", password: "change-me" }
  credentials: [],
};
