export function relative(childRect, parentRect) {
  return {
    top: childRect.top - parentRect.top,
    right: childRect.right - parentRect.left,
    bottom: childRect.bottom - parentRect.top,
    left: childRect.left - parentRect.left,
    width: childRect.width,
    height: childRect.height
  };
}

export function center(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}