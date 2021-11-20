import { buildIconFile, buildIconFolder } from "./icon";
import { formatBytes, formatDateRelative } from "./formatter";

export function createTable(tableData) {
  const table = document.createElement("table");
  table.setAttribute("class", "table is-hoverable is-fullwidth");
  table.appendChild(Thead());
  table.appendChild(Tbody(tableData));
  return table;
}

function Thead() {
  const tableHead = document.createElement("thead");
  const row = document.createElement("tr");
  tableHead.appendChild(row);

  row.appendChild(HeaderCell("Name"));
  row.appendChild(HeaderCell("Size", { centered: true }));
  row.appendChild(HeaderCell("Date Modified", { centered: true }));

  return tableHead;
}

function Tbody(data) {
  const tableBody = document.createElement("tbody");
  const rows = data.map(Row);

  tableBody.append(...rows);
  return tableBody;
}
function Row(row) {
  return row.type === "prefix" ? RowFolder(row) : RowFile(row);
}

function RowFolder({ name, prefix }) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.appendChild(buildIconFolder());
  nameCell.appendChild(Link(name, prefix));
  row.appendChild(nameCell);

  row.appendChild(TextCell());
  row.appendChild(TextCell());

  return row;
}

function RowFile({ name, url, size, dateModified }) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.appendChild(buildIconFile());
  nameCell.appendChild(Link(name, url));
  row.appendChild(nameCell);

  row.appendChild(TextCell(formatBytes(size)));
  row.appendChild(TextCell(formatDateRelative(dateModified)));

  return row;
}

function HeaderCell(title, options = { centered: false }) {
  const sizeCell = document.createElement("th");
  const classes = [options.centered ? "has-text-centered" : undefined].filter(
    String
  );

  if (classes.length > 0) {
    sizeCell.setAttribute("class", classes.join(" "));
  }
  sizeCell.appendChild(document.createTextNode(title));
  return sizeCell;
}

function TextCell(value = "-") {
  const sizeCell = document.createElement("td");
  sizeCell.setAttribute("class", "has-text-centered");
  sizeCell.appendChild(document.createTextNode(value));
  return sizeCell;
}

function Link(name, url) {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.appendChild(document.createTextNode(name));
  return link;
}
