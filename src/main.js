import { fetchItemsS3 } from "./fetch-items-s3";
import { Breadcrumb, ListFiles } from "./html";

function getPrefix() {
  let locationHash = window.location.hash.replace(/^#/, "");
  return locationHash.replace(/^\//, "");
}

window.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.appendChild(Breadcrumb(getPrefix()));

  const table = document.getElementById("table");
  fetchItemsS3(getPrefix()).then((e) => table.appendChild(ListFiles(e)));

  window.addEventListener("hashchange", () => {
    breadcrumb.replaceChild(Breadcrumb(getPrefix()), breadcrumb.firstChild);

    fetchItemsS3(getPrefix()).then((e) =>
      table.replaceChild(ListFiles(e), table.firstChild)
    );
  });
});
