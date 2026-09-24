/**
 * M8tcha Launch Party RSVP - Google Apps Script Web App
 *
 * SETUP:
 * 1. Create a new Google Sheet (https://sheets.new)
 * 2. Extensions → Apps Script
 * 3. Paste this entire file into the editor (replace Code.gs)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL and paste it into launch-party.astro as GOOGLE_SHEETS_WEB_APP_URL
 *
 * The sheet will auto-create headers on first submission:
 * Timestamp | First Name | Last Name | Email | Phone Number
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone Number'];

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.phone) {
      return jsonResponse({ success: false, error: 'All fields are required.' }, 400);
    }

    // Sanitize inputs (strip anything that looks like a formula)
    const sanitize = (val) => String(val).replace(/^[=+\-@]/, "'$&").trim().slice(0, 500);

    sheet.appendRow([
      new Date(),
      sanitize(data.firstName),
      sanitize(data.lastName),
      sanitize(data.email),
      sanitize(data.phone),
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// Handle CORS preflight
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#0c0b0a')
      .setFontColor('#f5f0eb');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // Apps Script web apps always return 200; status is informational
  return output;
}
