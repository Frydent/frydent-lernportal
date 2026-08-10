/* ============================================================
   FRYDENT · PRAXISURLAUB · ZENTRALE STEUERUNG
   ============================================================

   NUR DIESER BLOCK WIRD GEPFLEGT.
   Alle sieben Sprachfassungen von praxisinfo lesen ihre Daten
   hier heraus: praxisinfo.html (de) und praxisinfo_en / _pl /
   _ro / _ru / _tr / _ar.html

   So schalten Sie einen Urlaub:
     1. aktiv       auf true setzen
     2. von / bis   erster und letzter Urlaubstag
     3. wiederAb    erster Arbeitstag danach
     4. vertretung  Zeitraum, Name, Adresse, Telefon eintragen
     5. Datei speichern und hochladen. Fertig.

   Der Block erscheint automatisch "vorlaufTage" Tage vor
   Urlaubsbeginn und verschwindet automatisch am ersten
   Arbeitstag. Es muss nichts nachtraeglich abgeschaltet werden.

   Zum vollstaendigen Abschalten genuegt  aktiv: false
   ============================================================ */

window.FRYDENT_URLAUB = {

  aktiv: true,

  von:      '2026-09-07',   /* erster Urlaubstag        */
  bis:      '2026-09-23',   /* letzter Urlaubstag       */
  wiederAb: '2026-09-24',   /* erster Arbeitstag danach */

  vorlaufTage: 21,          /* so viele Tage vorher wird der Hinweis eingeblendet */

  vertretung: [
    {
      von: '2026-09-07',
      bis: '2026-09-23',
      name: 'Dr. Gudrun Holm',
      adresse: 'Paulinerstraße 5, 79848 Bonndorf',
      maps: 'https://maps.google.com/?q=Paulinerstra%C3%9Fe+5+79848+Bonndorf',
      telText: '07703 1616',
      telHref: '+4977031616'
    }
  ]

};

/* ============================================================
   AB HIER NICHTS MEHR AENDERN
   ============================================================ */
(function () {
  'use strict';

  var U = window.FRYDENT_URLAUB || {};

  /* ---------- Sprachdaten ---------- */
  var I18N = {
    de: {
      ws:['So.','Mo.','Di.','Mi.','Do.','Fr.','Sa.'],
      wl:['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
      M :['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
      tlRange:'{ws1} {d1}.{m1}. – {ws2} {d2}.{m2}.{y}',
      tlWieder:'Ab {ws3} {d3}.{m3}.{y}',
      cardRange:'{d1}. {M1} – {d2}. {M2} {y}',
      period:'{d1}.{m1}. – {d2}.{m2}.{y}',
      reopen:'Ab {wl3}, {d3}.{m3}.{y}, sind wir wieder für Sie da.',
      label:'Praxisurlaub',
      sub:'Unsere Praxis ist bis zum {d2}.{m2}. geschlossen.'
    },
    en: {
      ws:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      wl:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      M :['January','February','March','April','May','June','July','August','September','October','November','December'],
      tlRange:'{ws1} {d1} {M1} – {ws2} {d2} {M2} {y}',
      tlWieder:'From {ws3} {d3} {M3} {y}',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1} {M1} – {d2} {M2} {y}',
      reopen:'From {wl3}, {d3} {M3} {y}, we will be here for you again.',
      label:'Practice holiday',
      sub:'Our practice is closed until {d2} {M2}.'
    },
    pl: {
      ws:['Nd','Pon','Wt','Śr','Czw','Pt','Sob'],
      wl:['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'],
      wr:['niedzieli','poniedziałku','wtorku','środy','czwartku','piątku','soboty'],
      M :['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'],
      tlRange:'{ws1} {d1}.{m1}. – {ws2} {d2}.{m2}.{y}',
      tlWieder:'Od {ws3} {d3}.{m3}.{y}',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1}.{m1}. – {d2}.{m2}.{y}',
      reopen:'Od {wr3} {d3}.{m3}.{y} jesteśmy znów do Państwa dyspozycji.',
      label:'Urlop gabinetu',
      sub:'Gabinet jest zamknięty do {d2}.{m2}.'
    },
    ro: {
      ws:['Dum','Lun','Mar','Mie','Joi','Vin','Sâm'],
      wl:['duminică','luni','marți','miercuri','joi','vineri','sâmbătă'],
      M :['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'],
      tlRange:'{ws1} {d1}.{m1} – {ws2} {d2}.{m2}.{y}',
      tlWieder:'Din {ws3} {d3}.{m3}.{y}',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1}.{m1} – {d2}.{m2}.{y}',
      reopen:'Din {wl3}, {d3}.{m3}.{y}, suntem din nou la dispoziția dumneavoastră.',
      label:'Concediu',
      sub:'Cabinetul este închis până la {d2}.{m2}.'
    },
    ru: {
      ws:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
      wl:['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
      wr:['воскресенья','понедельника','вторника','среды','четверга','пятницы','субботы'],
      M :['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
      tlRange:'{ws1} {d1}.{m1} – {ws2} {d2}.{m2}.{y}',
      tlWieder:'С {ws3} {d3}.{m3}.{y}',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1}.{m1} – {d2}.{m2}.{y}',
      reopen:'С {wr3} {d3}.{m3}.{y} мы снова в вашем распоряжении.',
      label:'Отпуск',
      sub:'Кабинет закрыт до {d2}.{m2}.'
    },
    tr: {
      ws:['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'],
      wl:['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
      M :['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
      tlRange:'{ws1} {d1}.{m1}. – {ws2} {d2}.{m2}.{y}',
      tlWieder:'{d3}.{m3}.{y} {ws3}’den itibaren',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1}.{m1}. – {d2}.{m2}.{y}',
      reopen:'{d3} {M3} {y} {wl3} günü tekrar hizmetinizdeyiz.',
      label:'Muayenehane tatili',
      sub:'{d2}.{m2}. tarihine kadar kapalıyız.'
    },
    ar: {
      ws:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      wl:['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
      M :['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
      tlRange:'{ws1} {d1}.{m1} – {ws2} {d2}.{m2}.{y}',
      tlWieder:'من {ws3} {d3}.{m3}.{y}',
      cardRange:'{d1} {M1} – {d2} {M2} {y}',
      period:'{d1}.{m1} – {d2}.{m2}.{y}',
      reopen:'اعتباراً من يوم {wl3} {d3}.{m3}.{y} نكون مجدداً في خدمتكم.',
      label:'إجازة العيادة',
      sub:'العيادة مغلقة حتى {d2}.{m2}.'
    }
  };

  var lang = (document.documentElement.getAttribute('lang') || 'de').slice(0,2).toLowerCase();
  var T = I18N[lang] || I18N.de;

  /* ---------- Helfer ---------- */
  function d(iso) { return iso ? new Date(iso + 'T00:00:00') : null; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function today() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }

  /* Token 1 = Beginn, 2 = Ende, 3 = Wiederbeginn */
  function tokens(a, b, c) {
    var t = {};
    var set = function (i, dt) {
      if (!dt) { return; }
      t['d' + i]  = pad(dt.getDate());
      t['m' + i]  = pad(dt.getMonth() + 1);
      t['M' + i]  = T.M[dt.getMonth()];
      t['ws' + i] = T.ws[dt.getDay()];
      t['wl' + i] = T.wl[dt.getDay()];
      t['wr' + i] = (T.wr || T.wl)[dt.getDay()];
      t.y = dt.getFullYear();
    };
    set(1, a); set(2, b); set(3, c);
    return t;
  }

  function fill(tpl, t) {
    if (!tpl) { return ''; }
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return (t[k] === undefined || t[k] === null) ? '' : t[k];
    });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ---------- Status: laeuft der Urlaub bzw. steht er an? ---------- */
  var von = d(U.von), bis = d(U.bis), wieder = d(U.wiederAb);
  var gueltig = !!(U.aktiv && von && bis && von <= bis);

  /* Fuer das Status-Banner der Sprechzeiten (Array-Form wie bisher) */
  var tk = tokens(von, bis, wieder);
  U.closures = gueltig ? [{
    from:  U.von,
    to:    U.bis,
    label: T.label,
    sub:   fill(T.sub, tk)
  }] : [];

  if (!gueltig) { return; }

  var heute   = today();
  var abZeigen = new Date(von.getTime() - (U.vorlaufTage || 0) * 86400000);
  var bisZeigen = wieder ? new Date(wieder.getTime() - 1) : bis;
  var sichtbar = heute >= abZeigen && heute <= bisZeigen;

  /* ---------- Darstellung ---------- */
  function mapSvg() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
           '<path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>' +
           '<circle cx="12" cy="11" r="3"></circle></svg>';
  }
  function telSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
           '<path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>';
  }

  function vertretungHtml() {
    var list = U.vertretung || [];
    var out = '';
    for (var i = 0; i < list.length; i++) {
      var v = list[i];
      var vt = tokens(d(v.von) || von, d(v.bis) || bis, null);
      out += '<div class="vertretung-item">' +
               '<div class="v-period">' + esc(fill(T.period, vt)) + '</div>' +
               '<div class="v-name">' + esc(v.name) + '</div>' +
               (v.adresse ? '<a href="' + esc(v.maps || '#') + '" target="_blank" rel="noopener" class="v-map">' +
                 mapSvg() + esc(v.adresse) + '</a>' : '') +
               (v.telText ? '<a href="tel:' + esc(v.telHref || v.telText.replace(/\s/g,'')) + '" class="v-phone">' +
                 telSvg() + esc(v.telText) + '</a>' : '') +
             '</div>';
    }
    return out;
  }

  /* ---------- Reihenfolge der Bloecke je nach Phase ----------
     Vor dem Urlaub ist die Praxis offen. Wichtigste Information sind
     die Sprechzeiten, der Urlaub ist eine Vorankuendigung und steht
     direkt darunter, damit Patienten noch rechtzeitig einen Termin
     machen koennen.

       Status · Sprechzeiten · Urlaub · Notdienst

     Waehrend des Urlaubs ist die Praxis geschlossen. Dann zaehlt nur
     noch, wer vertritt und ab wann wir wieder da sind. Der Urlaubsblock
     rutscht nach ganz oben, darunter der Notdienst fuer akute Faelle,
     die reguleren Sprechzeiten zuletzt.

       Status · Urlaub · Notdienst · Sprechzeiten
  */
  function sortieren(block) {
    var hours = document.querySelector('.hours');
    var notdienst = document.querySelector('.notdienst');
    if (!hours || !notdienst || !block.parentNode) { return; }

    /* Ueberschrift der Sprechzeiten gehoert zum Block dazu */
    var kopf = hours.previousElementSibling;
    var start = (kopf && kopf.className && kopf.className.indexOf('section-title') > -1) ? kopf : hours;

    var imUrlaub = heute >= von && heute <= bis;

    if (imUrlaub) {
      start.parentNode.insertBefore(block, start);
      block.parentNode.insertBefore(notdienst, block.nextSibling);
    } else {
      notdienst.parentNode.insertBefore(block, notdienst);
    }
  }

  function render() {
    var block = document.getElementById('fu-urlaub');
    if (!block) { return; }

    if (!sichtbar) { block.hidden = true; block.style.display = 'none'; return; }

    var t = tokens(von, bis, wieder);
    var slots = {
      tlRange:   fill(T.tlRange, t),
      tlWieder:  fill(T.tlWieder, t),
      cardRange: fill(T.cardRange, t),
      reopen:    fill(T.reopen, t)
    };
    for (var key in slots) {
      if (!Object.prototype.hasOwnProperty.call(slots, key)) { continue; }
      var nodes = block.querySelectorAll('[data-fu="' + key + '"]');
      for (var i = 0; i < nodes.length; i++) { nodes[i].textContent = slots[key]; }
    }

    var grid = block.querySelector('[data-fu="vertretung"]');
    if (grid) {
      grid.innerHTML = vertretungHtml();
      /* bei nur einem Vertreter nicht auf halber Breite stehen lassen */
      grid.style.gridTemplateColumns = (U.vertretung || []).length < 2 ? '1fr' : '';
    }

    sortieren(block);

    block.hidden = false;
    block.style.display = '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else { render(); }
})();
