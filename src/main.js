import { fetchItemsS3 } from "./fetch-items-s3";
import { createBreadcrumb } from "./breadcrumb";
import { createTable } from "./list-files";

function getPrefix() {
  let locationHash = window.location.hash.replace(/^#/, "");
  return locationHash.replace(/^\//, "");
}

window.addEventListener("DOMContentLoaded", () => {
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.appendChild(createBreadcrumb(getPrefix()));

  const table = document.getElementById("table");
  fetchItemsS3(getPrefix()).then((e) => {
    table.appendChild(createTable(e));
  });

  window.addEventListener("hashchange", () => {
    breadcrumb.replaceChild(
      createBreadcrumb(getPrefix()),
      breadcrumb.firstChild
    );

    fetchItemsS3(getPrefix()).then((e) => {
      table.replaceChild(createTable(e), table.firstChild);
    });
  });
});
