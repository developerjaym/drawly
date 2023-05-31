import AnimationConfig from "./AnimationConfig.js";

export function animateIn(element, onAnimationDone = () => {}) {
    element.classList.remove(AnimationConfig.transitionOutClass)
    element.classList.add(AnimationConfig.transitionInClass);
    onAnimationDone()
}

export function animateOut(element, onAnimationDone = () => {}) {
    element.classList.remove(AnimationConfig.transitionInClass);
    element.classList.add(AnimationConfig.transitionOutClass)
    setTimeout(onAnimationDone, AnimationConfig.animationDuration - 1);
}