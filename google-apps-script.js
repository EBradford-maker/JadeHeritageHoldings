// ============================================================
// Google Apps Script — Jade Heritage Holdings Assessment CRM
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com
// 2. Sign in with Ethan.Bradford88@gmail.com
// 3. Click "New Project"
// 4. Paste this entire script, replacing the default code
// 5. Click "Deploy" → "New deployment"
// 6. Select type: "Web app"
// 7. Set "Execute as": "Me"
// 8. Set "Who has access": "Anyone"
// 9. Click "Deploy" and authorize when prompted
// 10. Copy the Web App URL — it looks like:
//     https://script.google.com/macros/s/XXXXX/exec
// 11. Paste that URL into assessment.js where it says GOOGLE_SCRIPT_URL
//
// The script will auto-create a "JHH Assessment Leads" spreadsheet
// on first submission and email you every new lead.
// ============================================================

var SHEET_NAME = 'JHH Assessment Leads';
var NOTIFY_EMAIL = 'Ethan.Bradford88@gmail.com';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Get or create spreadsheet
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheets()[0];
    
    // Format challenges and goals as strings
    var challenges = Array.isArray(data.challenges) ? data.challenges.join(', ') : (data.challenges || '');
    var goals = Array.isArray(data.goals) ? data.goals.join(', ') : (data.goals || '');
    
    // Append row
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.name || '',               // Full Name
      data.email || '',              // Email
      data.company || '',            // Company
      data.phone || '',              // Phone
      data.industry || '',           // Industry
      data.employees || '',          // Company Size
      data.techLevel || '',          // Tech Level
      data.manualHours || '',        // Manual Hours/Week
      data.aiAdoption || '',         // AI Adoption
      challenges,                    // Top Challenges
      data.customerHandling || '',   // Customer Handling
      data.revenue || '',            // Revenue Range
      data.techOpenness || '',       // Tech Openness
      goals,                         // Goals
      data.score || 0,               // AI Readiness Score
      data.category || ''            // Score Category
    ]);
    
    // Send email notification
    sendNotificationEmail(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Lead captured successfully' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ success: true, message: 'JHH Assessment CRM is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SHEET_NAME);
  
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  
  // Create new spreadsheet with headers
  var ss = SpreadsheetApp.create(SHEET_NAME);
  var sheet = ss.getSheets()[0];
  sheet.setName('Leads');
  
  var headers = [
    'Timestamp', 'Full Name', 'Email', 'Company', 'Phone',
    'Industry', 'Company Size', 'Tech Level', 'Manual Hours/Week',
    'AI Adoption', 'Top Challenges', 'Customer Handling',
    'Revenue Range', 'Tech Openness', 'Goals',
    'AI Readiness Score', 'Score Category'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1B5E20');
  headerRange.setFontColor('#FFFFFF');
  
  // Auto-resize columns
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  return ss;
}

function sendNotificationEmail(data) {
  var subject = '🐉 New Assessment Lead: ' + (data.name || 'Unknown') + ' — Score: ' + (data.score || 'N/A');
  
  var challenges = Array.isArray(data.challenges) ? data.challenges.join(', ') : (data.challenges || 'None specified');
  var goals = Array.isArray(data.goals) ? data.goals.join(', ') : (data.goals || 'None specified');
  
  var body = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    + '  JADE HERITAGE HOLDINGS — NEW LEAD\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
    + '📋 CONTACT INFO\n'
    + '   Name:     ' + (data.name || 'N/A') + '\n'
    + '   Email:    ' + (data.email || 'N/A') + '\n'
    + '   Company:  ' + (data.company || 'N/A') + '\n'
    + '   Phone:    ' + (data.phone || 'N/A') + '\n\n'
    + '📊 ASSESSMENT RESULTS\n'
    + '   Score:    ' + (data.score || 0) + '/100 (' + (data.category || 'N/A') + ')\n'
    + '   Industry: ' + (data.industry || 'N/A') + '\n'
    + '   Size:     ' + (data.employees || 'N/A') + ' employees\n'
    + '   Revenue:  ' + (data.revenue || 'N/A') + '\n\n'
    + '🔍 KEY DETAILS\n'
    + '   Tech Level:     ' + (data.techLevel || 'N/A') + '\n'
    + '   Manual Hours:   ' + (data.manualHours || 'N/A') + '/week\n'
    + '   AI Adoption:    ' + (data.aiAdoption || 'N/A') + '\n'
    + '   Tech Openness:  ' + (data.techOpenness || 'N/A') + '\n'
    + '   Challenges:     ' + challenges + '\n'
    + '   Goals:          ' + goals + '\n'
    + '   Customer Mgmt:  ' + (data.customerHandling || 'N/A') + '\n\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    + '  View all leads in Google Sheets\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
