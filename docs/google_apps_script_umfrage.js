// ============================================================
// FRYDENT Patientenportal – Umfrage Backend (Google Apps Script)
// ============================================================
// ANLEITUNG:
// 1. Öffne Google Sheets → neues Spreadsheet erstellen → Name: "FRYDENT Umfrage"
// 2. In Zeile 1 folgende Spaltenüberschriften eintragen:
//    A1: Zeitstempel | B1: Bewertung | C1: Themen | D1: Verständlich | E1: Feedback | F1: Sprache
// 3. Menü: Erweiterungen → Apps Script
// 4. Den gesamten Code unten einfügen (vorhandenen Code löschen)
// 5. Oben auf "Bereitstellen" → "Neue Bereitstellung"
// 6. Typ: "Web-App" auswählen
//    - Beschreibung: "FRYDENT Umfrage"
//    - Ausführen als: "Ich" (dein Account)
//    - Zugriff: "Jeder" (damit Patienten ohne Login senden können)
// 7. Auf "Bereitstellen" klicken → URL kopieren und mir schicken!

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toLocaleString('de-DE'),  // Zeitstempel
      data.rating || '',                    // Bewertung (1-5)
      (data.topics || []).join(', '),       // Gewünschte Themen
      data.understandable || '',            // Verständlich? (Ja/Teilweise/Nein)
      data.feedback || '',                  // Freitext-Feedback
      data.language || 'de'                 // Sprachversion der Seite
    ]);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Für CORS-Preflight
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'FRYDENT Umfrage API aktiv' })
  ).setMimeType(ContentService.MimeType.JSON);
}
