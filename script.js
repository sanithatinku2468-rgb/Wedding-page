const invitation = window.INVITATION_DATA || {};
const couple = invitation.couple || {};
const copy = invitation.text || {};
const eventDetails = invitation.event || {};
const links = invitation.links || {};
const assets = invitation.assets || {};

const setText = (id, value) => {
  const node = document.getElementById(id);
  if (node && value) node.textContent = value;
};

const setImage = (id, src, alt) => {
  const node = document.getElementById(id);
  if (!node || !src) return;
  node.src = src;
  if (alt !== undefined) node.alt = alt;
};

const setMeta = (selector, value) => {
  const node = document.querySelector(selector);
  if (node && value) node.setAttribute("content", value);
};

document.title = copy.pageTitle || document.title;
setMeta('meta[name="description"]', copy.shareDescription);
setMeta('meta[property="og:title"]', copy.pageTitle);
setMeta('meta[property="og:description"]', copy.shareDescription);
setMeta('meta[property="og:image"]', assets.sharePreview);

setText("coverKicker", copy.coverKicker);
setText("coverTitle", couple.displayName);
setText("coverDate", eventDetails.displayDate);
setText("coverButtonText", copy.coverButton);
setText("navStory", copy.navStory);
setText("navMoments", copy.navMoments);
setText("navDetails", copy.navDetails);
setText("coupleKicker", copy.coupleKicker);
setText("brideName", couple.firstName);
setText("groomName", couple.secondName);
setText("heroDate", eventDetails.displayDate);
setText("heroDateRepeat", eventDetails.displayDate);
setText("heroKicker", copy.heroKicker);
setText("heroHeading", copy.heroHeading);
setText("storyKicker", copy.storyKicker);
setText("storyHeading", copy.storyHeading);
const storyBody = document.getElementById("storyBody");
if (storyBody && copy.storyBody) {
  const phrase = "Why not a forever?";
  if (copy.storyBody.includes(phrase)) {
    const [before, after] = copy.storyBody.split(phrase);
    storyBody.innerHTML = `${before}<span class="italian-script">${phrase}</span>${after}`;
  } else {
    storyBody.textContent = copy.storyBody;
  }
}
setText("detailsKicker", copy.detailsKicker);
setText("eventTitle", copy.eventTitle);
setText("whenLabel", copy.whenLabel);
setText("whereLabel", copy.whereLabel);
setText("lunchLabel", copy.lunchLabel);
setText("dressLabel", copy.dressLabel);
setText("eventDate", eventDetails.displayDate);
setText("eventTime", eventDetails.displayTime);
setText("venueName", eventDetails.venueName);
setText("venueAddress", eventDetails.venueAddress);
setText("lunchVenueName", eventDetails.lunchVenueName);
setText("lunchVenueAddress", eventDetails.lunchVenueAddress);
setText("dressCode", copy.dressCode);
setText("dressNote", copy.dressNote);
setText("heroRsvpButton", copy.heroRsvpButton);
setText("musicButtonText", copy.musicButton);
setText("mapButtonText", copy.mapButton);
setText("countdownDays", copy.countdownDays);
setText("countdownHours", copy.countdownHours);
setText("countdownMinutes", copy.countdownMinutes);
setText("countdownSeconds", copy.countdownSeconds);
setText("blessingKicker", copy.blessingKicker);
setText("blessingVerse", copy.blessingVerse);
setText("blessingReference", copy.blessingReference);
setText("rsvpKicker", copy.rsvpKicker);
setText("rsvpHeading", copy.rsvpHeading);
setText("rsvpButtonText", copy.rsvpButton);

setImage("coverPhoto", assets.coverPhoto, "");
setImage("qrImage", assets.qrCode, `QR code for ${eventDetails.venueName || "the venue"} map location`);
setImage(
  "lunchQrImage",
  assets.lunchQrCode,
  `QR code for ${eventDetails.lunchVenueName || "the lunch venue"} map location`
);

const heroPhoto = document.querySelector(".hero-photo");
if (heroPhoto && assets.heroPhoto) heroPhoto.src = assets.heroPhoto;

if (assets.coupleBackground) {
  document.documentElement.style.setProperty("--couple-bg", `url("${assets.coupleBackground}")`);
}

const galleryTrack = document.querySelector(".gallery-track");
if (galleryTrack && Array.isArray(assets.gallery) && assets.gallery.length) {
  galleryTrack.innerHTML = assets.gallery
    .map(
      (image) => `
        <figure>
          <img src="${image.src}" alt="${image.alt || ""}" loading="lazy" decoding="async" />
        </figure>
      `
    )
    .join("");
}

const timeline = document.querySelector(".timeline-section");
if (timeline && Array.isArray(invitation.schedule) && invitation.schedule.length) {
  timeline.innerHTML = invitation.schedule
    .map(
      (item) => `
        <div class="timeline-item">
          <time>${item.time}</time>
          <span>${item.label}</span>
        </div>
      `
    )
    .join("");
} else if (timeline) {
  timeline.remove();
}

document.getElementById("mapLink").href = links.map || "#";
document.getElementById("qrLink").href = links.map || "#";
document.getElementById("lunchMapLink").href = links.lunchMap || "#";
document.getElementById("lunchQrLink").href = links.lunchMap || "#";
document.getElementById("rsvpLink").href = links.rsvp || "#";

const music = document.getElementById("weddingMusic");
if (music && assets.music) music.src = assets.music;

const target = new Date(eventDetails.countdownDateTime).getTime();
const counts = {
  days: document.querySelector('[data-count="days"]'),
  hours: document.querySelector('[data-count="hours"]'),
  minutes: document.querySelector('[data-count="minutes"]'),
  seconds: document.querySelector('[data-count="seconds"]'),
};

function updateCountdown() {
  const distance = Math.max(target - Date.now(), 0);
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  counts.days.textContent = String(days).padStart(2, "0");
  counts.hours.textContent = String(hours).padStart(2, "0");
  counts.minutes.textContent = String(minutes).padStart(2, "0");
  counts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", () => img.classList.add("is-loaded"));
  img.addEventListener("error", () => img.classList.remove("is-loaded"));
  if (img.complete && img.naturalWidth) img.classList.add("is-loaded");
});

const musicButton = document.querySelector(".music-button");
const openButton = document.querySelector(".open-invite");
const progressBar = document.querySelector(".scroll-progress span");
const revealSections = document.querySelectorAll(".reveal-section");
let musicRequested = false;

async function playMusic() {
  musicRequested = true;
  await music.play();
  musicButton.classList.add("is-playing");
  musicButton.setAttribute("aria-pressed", "true");
}

function pauseMusic() {
  musicRequested = false;
  music.pause();
  musicButton.classList.remove("is-playing");
  musicButton.setAttribute("aria-pressed", "false");
}

openButton.addEventListener("click", async () => {
  document.body.classList.remove("invitation-closed");
  document.body.classList.add("invitation-open");
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    await playMusic();
  } catch {
    musicButton.classList.remove("is-playing");
  }
});

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

revealSections.forEach((section) => revealObserver.observe(section));
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

document.addEventListener("visibilitychange", async () => {
  if (!document.hidden && musicRequested && music.paused) {
    try {
      await playMusic();
    } catch {
      musicButton.classList.remove("is-playing");
    }
  }
});

musicButton.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await playMusic();
    } else {
      pauseMusic();
    }
  } catch {
    musicButton.classList.remove("is-playing");
  }
});
