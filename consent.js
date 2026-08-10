/* FRYDENT · Consent-Banner (DSGVO / TDDDG)
   Blockiert externe Komponenten (Dr. Flex) bis zur Einwilligung.
   Kein Cookie, kein Tracking: Speicherung nur in localStorage.
   Einbinden im <head>:  <script src="consent.js"></script>
   Das Dr.-Flex-Skript darf NICHT direkt eingebunden werden,
   es wird ausschliesslich hier nach Einwilligung nachgeladen.
*/
(function () {
  'use strict';

  var KEY      = 'frydent-consent';       // 'all' | 'none'
  var DRFLEX   = 'https://dr-flex.de/embed.js?medicalPracticeId=60190';
  var C = { navy:'#2C4170', blue:'#37538E', gold:'#C4A44E', paper:'#F2EFE8', ink:'#3A4256', line:'#C9CEDB' };

  function get()  { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }

  /* ---------- Dr. Flex erst nach Einwilligung laden ---------- */
  var loaded = false;
  function loadDrFlex(cb) {
    if (loaded) { if (cb) cb(); return; }
    loaded = true;
    var s = document.createElement('script');
    s.src = DRFLEX;
    s.onload = function () { if (cb) cb(); };
    document.head.appendChild(s);
  }

  /* Platzhalter: solange keine Einwilligung vorliegt, bleibt der
     Buchungs-Button nutzbar. Ein Klick fragt die Einwilligung ab
     und laedt den Kalender direkt danach.
     WICHTIG: benannte Funktion statt arguments.callee; das ist im
     strict mode verboten und liess den Klick auf Mobilgeraeten
     kommentarlos scheitern (Race: embed.js noch nicht uebernommen). */
  window.toggleDrFlexAppointments = function frydentToggle() {
    if (get() === 'all') {
      loadDrFlex(function () {
        var tries = 0;
        (function waitFlex() {
          if (window.toggleDrFlexAppointments !== frydentToggle) {
            window.toggleDrFlexAppointments();
          } else if (++tries < 20) {
            setTimeout(waitFlex, 150);
          }
        })();
      });
      return;
    }
    askForBooking();
  };

  /* ---------- Styles ---------- */
  var styled = false;
  function css() {
    if (styled) { return; }
    styled = true;
    var s = document.createElement('style');
    s.textContent = [
      '.fc-ov{position:fixed;inset:0;background:rgba(29,38,64,.55);z-index:9998;display:flex;',
      '  align-items:center;justify-content:center;padding:20px}',
      '.fc-box{background:#fff;max-width:600px;width:100%;border-radius:14px;padding:34px 34px 26px;',
      '  box-shadow:0 20px 60px rgba(20,28,50,.3);font-family:"Plus Jakarta Sans",sans-serif;color:' + C.ink + ';',
      '  max-height:88vh;overflow-y:auto}',
      '.fc-box h2{margin:0 0 14px;font-family:"Quicksand",sans-serif;font-weight:500;font-size:25px;',
      '  color:' + C.navy + ';text-align:center}',
      '.fc-box p{margin:0 0 16px;font-size:14.5px;line-height:1.65}',
      '.fc-opt{background:' + C.paper + ';border-radius:9px;padding:14px 16px;margin:0 0 18px;font-size:14px}',
      '.fc-opt b{display:block;margin-bottom:9px;color:' + C.navy + ';font-size:13.5px}',
      '.fc-opt label{display:flex;gap:9px;align-items:flex-start;line-height:1.5;cursor:pointer}',
      '.fc-opt input{margin-top:3px;flex:none;width:16px;height:16px;accent-color:' + C.blue + '}',
      '.fc-opt small{display:block;color:#6B7385;font-size:12.5px;margin-top:2px}',
      '.fc-btn{display:block;width:100%;padding:14px;margin:0 0 10px;border:none;border-radius:9px;',
      '  font-family:"Quicksand",sans-serif;font-size:15.5px;font-weight:600;cursor:pointer;transition:.2s}',
      '.fc-all{background:' + C.gold + ';color:#2A2410}.fc-all:hover{background:#b3944a}',
      '.fc-none,.fc-save{background:#fff;color:' + C.navy + ';border:1.5px solid ' + C.line + '}',
      '.fc-none:hover,.fc-save:hover{background:' + C.paper + '}',
      '.fc-links{text-align:center;margin-top:14px;font-size:12.5px}',
      '.fc-links a{color:' + C.blue + ';margin:0 8px}',
      '@media(max-width:600px){.fc-box{padding:26px 20px 20px}.fc-box h2{font-size:21px}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ---------- Dialog ---------- */
  var open = false;
  function dialog(booking) {
    if (open) { return; }
    open = true;
    css();
    var ov = document.createElement('div');
    ov.className = 'fc-ov';
    ov.innerHTML =
      '<div class="fc-box" role="dialog" aria-modal="true" aria-labelledby="fc-t">' +
        '<h2 id="fc-t">Datenschutzhinweis</h2>' +
        (booking
          ? '<p>Für die Online-Terminbuchung binden wir den Kalender unseres Dienstleisters <b>Dr. Flex</b> ein. Dabei wird Ihre IP-Adresse an dessen Server übertragen. Um den Kalender zu öffnen, benötigen wir Ihre Einwilligung.</p>'
          : '<p>Unsere Website funktioniert ohne Tracking und ohne Werbe-Cookies. Für die <b>Online-Terminbuchung</b> binden wir jedoch einen externen Dienst ein (Dr. Flex). Dabei wird Ihre IP-Adresse an dessen Server übertragen, deshalb fragen wir Sie vorher.</p>') +
        '<div class="fc-opt">' +
          '<b>Notwendige Funktionen sind immer aktiv</b>' +
          '<label><input type="checkbox" id="fc-ext">' +
            '<span>Externe Komponenten laden' +
              '<small>Online-Terminkalender (Dr. Flex). Ohne Einwilligung erreichen Sie uns weiterhin telefonisch unter 07703 284 oder per Kontaktformular.</small>' +
            '</span>' +
          '</label>' +
        '</div>' +
        '<button type="button" class="fc-btn fc-all" id="fc-yes">Alles erlauben</button>' +
        '<button type="button" class="fc-btn fc-save" id="fc-save">Auswahl speichern</button>' +
        '<button type="button" class="fc-btn fc-none" id="fc-no">Alles ablehnen</button>' +
        '<div class="fc-links">' +
          '<a href="https://info.frydent.de/datenschutz.html" target="_blank" rel="noopener">Datenschutz</a>·' +
          '<a href="https://info.frydent.de/impressum.html" target="_blank" rel="noopener">Impressum</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    var scrollLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function close() {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = scrollLock;
      if (ov.parentNode) { ov.parentNode.removeChild(ov); }
      open = false;
    }

    function accept() {
      save('all'); close();
      loadDrFlex(function () {
        if (booking) setTimeout(function () {
          if (window.toggleDrFlexAppointments) window.toggleDrFlexAppointments();
        }, 250);
      });
    }
    function decline() { save('none'); close(); }

    /* Die Checkbox ist ein reiner Schalter. Sie schliesst den Dialog nicht
       und speichert nichts. Erst ein Klick auf einen der drei Buttons
       trifft die Entscheidung. Frueher rief das change-Ereignis direkt
       accept() auf, dadurch verschwand der Dialog beim Antippen sofort. */
    function applySelection() {
      var box = ov.querySelector('#fc-ext');
      if (box && box.checked) { accept(); } else { decline(); }
    }

    function onKey(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        if (booking) { close(); } else { decline(); }
      }
    }

    ov.querySelector('#fc-yes').onclick  = accept;
    ov.querySelector('#fc-save').onclick = applySelection;
    ov.querySelector('#fc-no').onclick   = decline;
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function (e) {
      if (e.target !== ov) { return; }
      if (booking) { close(); } else { decline(); }
    });

    var first = ov.querySelector('#fc-ext');
    if (first && first.focus) { try { first.focus(); } catch (e) {} }
  }

  function askForBooking() { dialog(true); }

  /* ---------- Start ---------- */
  function init() {
    var v = get();
    if (v === 'all')  { loadDrFlex(); return; }   // Einwilligung liegt vor
    if (v === 'none') { return; }                 // abgelehnt: nichts nachladen
    dialog(false);                                // noch keine Entscheidung
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  /* Nachträgliche Änderung: window.frydentConsentReset() */
  window.frydentConsentReset = function () { save(''); location.reload(); };
})();
