var SHEET_NAME = 'JHH Assessment Leads';
var NOTIFY_EMAIL = 'Ethan.Bradford88@gmail.com';

function doPost(e) {
  try {
    // Handle both URL-encoded and JSON data
    var data = {};
    if (e.parameter) {
      data = e.parameter;
    } else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        data = e.parameter || {};
      }
    }
    
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheets()[0];
    
    // Check if this is an AI Assessment request vs regular assessment
    if (data.type === 'AI_ASSESSMENT_REQUEST') {
      // Handle AI Assessment Form
      var row = [
        new Date(),
        data.fullName || '',
        data.email || '',
        data.company || '',
        data.phone || 'Not provided',
        data.industry || 'Not specified',
        data.companySize || '',
        'AI Assessment Request',
        data.aiExperience || 'Not specified',
        data.timeline || 'Not specified',
        data.challenges || '',
        'Direct Form Submission',
        'Not specified',
        'Interested in AI',
        data.additionalInfo || 'None',
        'AI Request',
        'AI Assessment Form'
      ];
    } else {
      // Handle regular assessment form
      var row = [
        new Date(),
        data.name || data.fullName || '',
        data.email || '',
        data.company || '',
        data.phone || '',
        data.industry || '',
        data.employees || data.companySize || '',
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
    }
    
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
  if (data.type === 'AI_ASSESSMENT_REQUEST') {
    // AI Assessment Form Email
    var s = '🤖 New AI Assessment Request: ' + (data.company || 'Unknown Company');
    var b = '=== NEW AI ASSESSMENT REQUEST ===\n\n';
    b += 'CONTACT INFO:\n';
    b += 'Name: ' + (data.fullName || 'N/A') + '\n';
    b += 'Email: ' + (data.email || 'N/A') + '\n';
    b += 'Company: ' + (data.company || 'N/A') + '\n';
    b += 'Phone: ' + (data.phone || 'Not provided') + '\n';
    b += 'Job Title: ' + (data.jobTitle || 'Not provided') + '\n\n';
    
    b += 'COMPANY DETAILS:\n';
    b += 'Company Size: ' + (data.companySize || 'Not specified') + '\n';
    b += 'Industry: ' + (data.industry || 'Not specified') + '\n\n';
    
    b += 'AI NEEDS:\n';
    b += 'Primary Challenge: ' + (data.challenges || 'Not specified') + '\n';
    b += 'AI Experience: ' + (data.aiExperience || 'Not specified') + '\n';
    b += 'Timeline: ' + (data.timeline || 'Not specified') + '\n\n';
    
    if (data.additionalInfo && data.additionalInfo !== 'None provided') {
      b += 'ADDITIONAL INFO:\n' + data.additionalInfo + '\n\n';
    }
    
    b += '=== NEXT STEPS ===\n';
    b += '• Call within 24 hours to discuss AI assessment\n';
    b += '• Focus on their primary challenge: ' + (data.challenges || 'General optimization') + '\n';
    b += '• Timeline: ' + (data.timeline || 'Unknown') + '\n';
    
    MailApp.sendEmail(NOTIFY_EMAIL, s, b);
  } else {
    // Regular Assessment Email
    var s = '📊 New Assessment Lead: ' + (data.company || data.name || 'Unknown');
    var b = '=== NEW WEBSITE ASSESSMENT ===\n\n';
    b += 'Name: ' + (data.name || data.fullName || 'N/A') + '\n';
    b += 'Email: ' + (data.email || 'N/A') + '\n';
    b += 'Company: ' + (data.company || 'N/A') + '\n';
    b += 'Phone: ' + (data.phone || 'Not provided') + '\n';
    if (data.score) {
      b += 'Assessment Score: ' + data.score + '\n';
    }
    if (data.challenges) {
      b += 'Main Challenges: ' + data.challenges + '\n';
    }
    MailApp.sendEmail(NOTIFY_EMAIL, s, b);
  }
}
