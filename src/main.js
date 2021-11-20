import { fetchItemsS3 } from "./fetch-items-s3";
import { createTable } from "./list-files";

function getPrefix() {
  return "graviteeio-apim/distributions/";
}

fetchItemsS3(getPrefix()).then((e) => {
  const table = document.getElementById("table");
  table.appendChild(createTable(e));
});
