let observer: IntersectionObserver | null = null;

function needsFallback(): boolean {
  return (
    !CSS.supports("animation-timeline: view()") &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  );
}

export function initReveal(): void {
  observer?.disconnect();
  observer = null;
  if (!needsFallback()) return;

  document.documentElement.classList.add("js-reveal");
  const current = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        current.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll("[data-reveal]")
    .forEach((element) => current.observe(element));
  observer = current;
}
