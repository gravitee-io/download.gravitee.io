export function buildIconFolder() {
  return buildIcon("far fa-folder");
}
export function buildIconFile() {
  return buildIcon("far fa-file-alt");
}

function buildIcon(iconName) {
  const icon = document.createElement("i");
  icon.setAttribute("class", iconName);

  const span = document.createElement("span");
  span.setAttribute("class", "icon");
  span.setAttribute("style", "margin-right: 1rem");
  span.appendChild(icon);

  return span;
}
