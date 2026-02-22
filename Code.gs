var SHEET_NAME = 'JHH Assessment Leads';
var NOTIFY_EMAIL = 'Ethan.Bradford88@gmail.com';

function doPost(e) {
  try {
    // Use e.parameter for form data (works with URLSearchParams)
    var data = e.parameter || {};
    
    // Debug logging
    Logger.log('Received form data: ' + JSON.stringify(data));
    
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheets()[0];
    
    // Check if this is an AI Assessment request vs regular assessment
    if (data.type === 'AI_ASSESSMENT_REQUEST') {
      Logger.log('Processing AI Assessment Request for: ' + data.company);
      
      // Handle AI Assessment Form
      var row = [
        new Date(),                              // Timestamp
        data.fullName || 'Not provided',        // Full Name
        data.email || 'Not provided',           // Email
        data.company || 'Not provided',         // Company
        data.phone || 'Not provided',           // Phone
        data.industry || 'Not specified',       // Industry
        data.companySize || 'Not specified',    // Company Size
        'AI Assessment Request',                 // Tech Level
        data.aiExperience || 'Not specified',   // AI Experience
        data.timeline || 'Not specified',       // Timeline
        data.challenges || 'Not specified',     // Challenges
        'Direct Form Submission',               // Customer Handling
        'Not specified',                        // Revenue
        'Interested in AI',                     // Tech Openness
        data.additionalInfo || 'None provided', // Goals/Additional Info
        'AI Request',                           // Score
        'AI Assessment Form'                    // Category
      ];
    } else {
      Logger.log('Processing Regular Assessment for: ' + (data.company || data.name));
      
      // Handle regular assessment form
      var row = [
        new Date(),
        data.name || data.fullName || 'Not provided',
        data.email || 'Not provided',
        data.company || 'Not provided',
        data.phone || 'Not provided',
        data.industry || 'Not specified',
        data.employees || data.companySize || 'Not specified',
        data.techLevel || 'Not specified',
        data.manualHours || 'Not specified',
        data.aiAdoption || 'Not specified',
        data.challenges || 'Not specified',
        data.customerHandling || 'Not specified',
        data.revenue || 'Not specified',
        data.techOpenness || 'Not specified',
        data.goals || 'Not specified',
        data.score || 0,
        data.category || 'Not specified'
      ];
    }
    
    Logger.log('Adding row to sheet');
    sheet.appendRow(row);
    
    Logger.log('Sending notification email');
    sendNotificationEmail(data);
    
    return ContentService
      .createTextOutput('SUCCESS')
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
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
  try {
    Logger.log('Sending email for data type: ' + data.type);
    
    if (data.type === 'AI_ASSESSMENT_REQUEST') {
      // AI Assessment Form Email
      var subject = '🤖 NEW AI ASSESSMENT REQUEST: ' + (data.company || 'Unknown Company');
      var body = '';
      
      body += '=== NEW AI ASSESSMENT REQUEST ===\n\n';
      
      body += '📋 CONTACT INFORMATION:\n';
      body += '• Name: ' + (data.fullName || 'Not provided') + '\n';
      body += '• Email: ' + (data.email || 'Not provided') + '\n';
      body += '• Company: ' + (data.company || 'Not provided') + '\n';
      body += '• Phone: ' + (data.phone || 'Not provided') + '\n';
      body += '• Job Title: ' + (data.jobTitle || 'Not provided') + '\n\n';
      
      body += '🏢 COMPANY DETAILS:\n';
      body += '• Company Size: ' + (data.companySize || 'Not specified') + '\n';
      body += '• Industry: ' + (data.industry || 'Not specified') + '\n\n';
      
      body += '🤖 AI REQUIREMENTS:\n';
      body += '• Primary Challenge: ' + (data.challenges || 'Not specified') + '\n';
      body += '• Current AI Experience: ' + (data.aiExperience || 'Not specified') + '\n';
      body += '• Implementation Timeline: ' + (data.timeline || 'Not specified') + '\n\n';
      
      if (data.additionalInfo && data.additionalInfo !== 'None provided' && data.additionalInfo.length > 0) {
        body += '💬 ADDITIONAL INFORMATION:\n';
        body += data.additionalInfo + '\n\n';
      }
      
      body += '⏰ NEXT STEPS:\n';
      body += '• CALL WITHIN 24 HOURS\n';
      body += '• Focus conversation on: ' + (data.challenges || 'General AI optimization') + '\n';
      body += '• Timeline expectation: ' + (data.timeline || 'To be determined') + '\n';
      body += '• Email: ' + (data.email || 'Not provided') + '\n\n';
      
      body += '🗓️ Submitted: ' + (data.timestamp || new Date().toISOString()) + '\n';
      
      Logger.log('Sending AI assessment email to: ' + NOTIFY_EMAIL);
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
      
    } else {
      // Regular Assessment Email
      var subject = '📊 NEW ASSESSMENT LEAD: ' + (data.company || data.name || 'Unknown');
      var body = '';
      
      body += '=== NEW WEBSITE ASSESSMENT ===\n\n';
      body += '• Name: ' + (data.name || data.fullName || 'Not provided') + '\n';
      body += '• Email: ' + (data.email || 'Not provided') + '\n';
      body += '• Company: ' + (data.company || 'Not provided') + '\n';
      body += '• Phone: ' + (data.phone || 'Not provided') + '\n';
      
      if (data.score) {
        body += '• Assessment Score: ' + data.score + '\n';
      }
      if (data.challenges) {
        body += '• Main Challenges: ' + data.challenges + '\n';
      }
      
      body += '\n🗓️ Submitted: ' + new Date().toISOString() + '\n';
      
      Logger.log('Sending regular assessment email to: ' + NOTIFY_EMAIL);
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }
    
    Logger.log('Email sent successfully');
    
  } catch (emailError) {
    Logger.log('Error sending email: ' + emailError.toString());
  }
}
