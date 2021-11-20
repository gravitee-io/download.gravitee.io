import { fetchItemsS3 } from "./fetch-items-s3";
import { createBreadcrumb } from "./breadcrumb";
import { createTable } from "./list-files";

function getPrefix() {
  let locationHash = window.location.hash.replace(/^#/, "");
  return locationHash.replace(/^\//, "");
}

const breadcrumb = document.getElementById("breadcrumb");
breadcrumb.appendChild(createBreadcrumb(getPrefix()));

fetchItemsS3(getPrefix()).then((e) => {
  const table = document.getElementById("table");
  table.appendChild(createTable(e));
});
