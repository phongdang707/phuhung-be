var XLSX = require("xlsx");

function make_book({ nameSheet }) {
  var ws = XLSX.utils.aoa_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  return wb;
}

module.exports = { make_book };
