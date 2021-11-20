import { BreadcrumbFolderIcon } from "./icon";

export function Breadcrumb(pathPrefix) {
  const div = document.createElement("div");
  div.setAttribute("class", "buttons is-pulled-left");

  const buttons = pathBreadcrumbs(pathPrefix).map(Button);
  div.append(...buttons);
  return div;
}

function Button({ name, url }) {
  const btn = document.createElement("a");
  btn.setAttribute("class", "button is-info is-rounded");
  btn.setAttribute("href", url);

  if (name === "") {
    btn.setAttribute("style", "font-weight: bolder;");
    btn.appendChild(BreadcrumbFolderIcon());
    btn.appendChild(document.createTextNode("/"));
  } else {
    btn.appendChild(document.createTextNode(name));
  }

  return btn;
}

function pathBreadcrumbs(pathPrefix) {
  return `/${pathPrefix}`
    .match(/(?=[/])|[^/]+[/]?/g)
    .map((pathPrefixPart, index, pathPrefixParts) => ({
      name: decodeURI(pathPrefixPart),
      url: "#" + pathPrefixParts.slice(0, index).join("") + pathPrefixPart,
    }));
}
