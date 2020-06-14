const DOMAIN = "justintemps.github.io";
const URI = "cs601-assignment5";
const JSON_DATA = "degrees.json";

// Calling the absolute path of the URL so that this will work if downloaded
const URL = `https://${DOMAIN}/${URI}/${JSON_DATA}`;

// AJAX helper function. Takes a url, makes a request, calls callback if req
// is successful. Otherwise, handles error.
function getURL(url, callback) {
  const req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.addEventListener("load", function () {
    if (req.status < 400) {
      callback(req.response);
    } else {
      callback(null, new Error("Request failed: " + req.data));
    }
  });
  req.addEventListener("error", function () {
    callback(null, new Error("Network error"));
  });
  // Tbh, I've never understood why you have to pass null to req.send()
  req.send(null);
}

// Cycle through the data and returns a list of unique keys on
// all the objects
function getFields(data = []) {
  const allFields = new Set();
  data.forEach((entry) => {
    const fields = Object.keys(entry);
    fields.forEach((field) => allFields.add(field));
  });
  return allFields;
}

// Loop through the fields adding headings to the table
function renderCols(thead, fields) {
  const row = document.createElement("tr");
  fields.forEach((field) => {
    const heading = document.createElement("th");
    const headingContent = document.createTextNode(field);
    heading.appendChild(headingContent);
    row.appendChild(heading);
  });
  thead.appendChild(row);
}

// Apply data to columsn in the table bodies
function renderRows(tbody, fields, data = []) {
  data.forEach((entry) => {
    const row = document.createElement("tr");
    // Make sure the cells are applied in the right order
    fields.forEach((field) => {
      const cell = document.createElement("td");
      // Leave cells blank if this object is missing the field
      const contents = entry[field] ? entry[field] : "";
      const cellContents = document.createTextNode(contents);
      cell.appendChild(cellContents);
      row.append(cell);
    });
    tbody.append(row);
  });
}

function renderContent(data = []) {
  // Parse the data into a JS object
  const parsedData = JSON.parse(data);

  // The mounting point for our app
  const content = document.getElementById("content");

  // Don't keep rendering the table over and over
  if (content.childNodes.length !== 0) {
    return;
  }

  // Instantiate the containers for our table
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Get a unique list of fields for all the data
  const fields = getFields(parsedData);

  // Render the columns with a headingsfor each field
  renderCols(thead, fields);

  // Render the data in the table body
  renderRows(tbody, fields, parsedData);

  // Add the table to the DOM
  table.appendChild(thead);
  table.appendChild(tbody);
  content.appendChild(table);
}

// Make the request and render content when the user clicks the button
button.addEventListener("click", () => {
  getURL(URL, renderContent);
});
