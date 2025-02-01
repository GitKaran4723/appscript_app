function doGet(e) {
 // var usn = e.parameter.usn;
 // var dob = e.parameter.dob;
  var usn = e.parameter.usn;
  var dob = e.parameter.dob;

  if (!usn || !dob) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing USN or DOB" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify(getStudentData(usn, dob)))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStudentData(usn, dob) {
  var sheetId = "1vbREvOx8NJT3g4WlqXmyiV6x7KjK_9OXILRCX_sheet_ID"; // Replace with your actual Google Sheet ID
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Overall Percentage"); // Replace with your sheet name
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var jsonData = null;

  for (var i = 1; i < data.length; i++) {
    var sheetUSN = data[i][0].toString().trim(); // Ensure USN is treated as a string
    var sheetDOB = formatDate(data[i][2]); // Convert the sheet's DOB to DD-MM-YYYY format

    if (sheetUSN === usn && sheetDOB === dob) { // Matching USN and DOB
      jsonData = {};
      for (var j = 0; j < headers.length; j++) {
        jsonData[headers[j]] = data[i][j];
      }
      return jsonData;
    }
  }

  return { error: "Invalid Credentials" };
}

function formatDate(date) {
  if (date instanceof Date) {
    return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd-MM-yyyy");
  }
  return date.toString().trim();
}
