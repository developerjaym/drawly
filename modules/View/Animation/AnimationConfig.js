const animationConfig = {
  transitionInClass: "expand",
  transitionOutClass: "contract",
  animationDuration: Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--animation-duration")
      .replace("ms", "")
  ),
};

export default animationConfig;
