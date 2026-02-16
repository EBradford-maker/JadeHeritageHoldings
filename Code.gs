var SHEET_NAME = 'JHH Assessment Leads';
var NOTIFY_EMAIL = 'Ethan.Bradford88@gmail.com';

function doPost(e) {
  try {
    var data = e.parameter;
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheets()[0];
    var row = [
      new Date(),
      data.name || '',
      data.email || '',
      data.company || '',
      data.phone || '',
      data.industry || '',
      data.employees || '',
      data.techLevel || '',
      data.manualHours || '',
      data.aiAdoption || '',
      data.challenges || '',
      data.customerHandling || '',
      data.revenue || '',
      data.techOpenness || '',
      data.goals || '',
      data.score || 0,
      data.category || ''
    ];
    sheet.appendRow(row);
    sendNotificationEmail(data);
    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return ContentService
      .createTextOutput('ERROR: ' + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  var sheet = ss.getSheets()[0];
  sheet.setName('Leads');
  var h = ['Timestamp', 'Full Name', 'Email', 'Company', 'Phone', 'Industry', 'Company Size', 'Tech Level', 'Manual Hours', 'AI Adoption', 'Challenges', 'Customer Handling', 'Revenue', 'Tech Openness', 'Goals', 'Score', 'Category'];
  sheet.getRange(1, 1, 1, h.length).setValues([h]);
  sheet.setFrozenRows(1);
  return ss;
}

function sendNotificationEmail(data) {
  var s = 'New Lead: ' + (data.name || 'Unknown');
  var b = 'Name: ' + (data.name || 'N/A');
  b = b + '\nEmail: ' + (data.email || 'N/A');
  b = b + '\nCompany: ' + (data.company || 'N/A');
  b = b + '\nScore: ' + (data.score || 0);
  MailApp.sendEmail(NOTIFY_EMAIL, s, b);
}
