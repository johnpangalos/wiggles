export let observer;
observer = new IntersectionObserver(
  (elements, obs) => {
    elements.forEach((item) => {
      if (item.intersectionRatio > 0) {
        const image = item.target as HTMLImageElement;
        image.src = image.dataset.src;
        obs.unobserve(image);
      }
    });
  },
  {
    rootMargin: "100px",
    threshold: 1.0,
  }
);
