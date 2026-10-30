document.querySelectorAll("[data-image-comparison]").forEach((comparison) => {
  const control = comparison.querySelector(".resume-comparison__control");

  if (!control) {
    return;
  }

  let animationFrame;
  let hasInteracted = false;

  const updateComparison = () => {
    const position = Number(control.value);
    comparison.style.setProperty("--comparison-position", `${position}%`);
    control.setAttribute(
      "aria-valuetext",
      `${Math.round(position)}% before image visible`,
    );
  };

  const stopNudge = () => {
    hasInteracted = true;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  };

  const animateTo = (from, to, duration, onComplete) => {
    const startTime = performance.now();
    const animate = (time) => {
      if (hasInteracted) {
        return;
      }

      const progress = Math.min((time - startTime) / duration, 1);
      const eased =
        progress < 0.5
          ? 4 * progress ** 3
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      control.value = String(from + (to - from) * eased);
      updateComparison();

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else if (!hasInteracted) {
        onComplete();
      }
    };

    animationFrame = requestAnimationFrame(animate);
  };

  const startNudge = () => {
    if (
      hasInteracted ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    animateTo(50, 44, 420, () => {
      animateTo(44, 56, 560, () => {
        animateTo(56, 50, 420, () => {});
      });
    });
  };

  control.addEventListener("input", () => {
    stopNudge();
    updateComparison();
  });
  control.addEventListener("pointerdown", stopNudge);
  control.addEventListener("focus", stopNudge);
  control.addEventListener("keydown", stopNudge);
  updateComparison();

  if (document.readyState === "complete") {
    requestAnimationFrame(startNudge);
  } else {
    window.addEventListener("load", startNudge, { once: true });
  }
});
