/* FRYDENT · Consent-Banner (DSGVO / TDDDG)
   Blockiert externe Komponenten (Dr. Flex) bis zur Einwilligung.
   Kein Cookie, kein Tracking: Speicherung nur in localStorage.
   Einbinden im <head>:  <script src="consent.js"></script>
   Das Dr.-Flex-Skript darf NICHT direkt eingebunden werden,
   es wird ausschliesslich hier nach Einwilligung nachgeladen.

   Die Texte richten sich nach dem lang-Attribut der Seite.
   Fehlt eine Sprache, wird Deutsch benutzt; der Dialog kann
   dadurch nie leer bleiben.
*/
(function () {
  'use strict';

  var KEY      = 'frydent-consent';       // 'all' | 'none'
  var DRFLEX   = 'https://dr-flex.de/embed.js?medicalPracticeId=60190';
  var BASIS    = 'https://info.frydent.de/';
  var TELEFON  = '07703 284';
  var C = { navy:'#2C4170', blue:'#37538E', gold:'#C4A44E', paper:'#F2EFE8', ink:'#3A4256', line:'#C9CEDB' };

  /* ---------- Sprachtexte ---------- */
  var I18N = {
    de: {
      titel:'Datenschutzhinweis',
      start:'Unsere Website funktioniert ohne Tracking und ohne Werbe-Cookies. Für die <b>Online-Terminbuchung</b> binden wir jedoch einen externen Dienst ein (Dr. Flex). Dabei wird Ihre IP-Adresse an dessen Server übertragen, deshalb fragen wir Sie vorher.',
      buchung:'Für die Online-Terminbuchung binden wir den Kalender unseres Dienstleisters <b>Dr. Flex</b> ein. Dabei wird Ihre IP-Adresse an dessen Server übertragen. Um den Kalender zu öffnen, benötigen wir Ihre Einwilligung.',
      aendern:'Hier können Sie Ihre Entscheidung jederzeit ändern. Unsere Website funktioniert ohne Tracking und ohne Werbe-Cookies. Nur für die <b>Online-Terminbuchung</b> binden wir einen externen Dienst ein (Dr. Flex), dabei wird Ihre IP-Adresse an dessen Server übertragen.',
      optKopf:'Notwendige Funktionen sind immer aktiv',
      optLabel:'Externe Komponenten laden',
      optHinweis:'Online-Terminkalender (Dr. Flex). Ohne Einwilligung erreichen Sie uns weiterhin telefonisch unter {tel} oder per Kontaktformular.',
      alles:'Alles erlauben', speichern:'Auswahl speichern', ablehnen:'Alles ablehnen',
      datenschutz:'Datenschutz', impressum:'Impressum',
      einstellungen:'Datenschutz-Einstellungen'
    },
    en: {
      titel:'Privacy notice',
      start:'Our website works without tracking and without advertising cookies. For <b>online appointment booking</b>, however, we embed an external service (Dr. Flex). This transfers your IP address to their server, which is why we ask you beforehand.',
      buchung:'For online appointment booking we embed the calendar of our service provider <b>Dr. Flex</b>. This transfers your IP address to their server. We need your consent to open the calendar.',
      aendern:'You can change your decision here at any time. Our website works without tracking and without advertising cookies. Only for <b>online appointment booking</b> do we embed an external service (Dr. Flex), which transfers your IP address to their server.',
      optKopf:'Essential functions are always active',
      optLabel:'Load external components',
      optHinweis:'Online appointment calendar (Dr. Flex). Without consent you can still reach us by phone on {tel} or via the contact form.',
      alles:'Allow all', speichern:'Save selection', ablehnen:'Reject all',
      datenschutz:'Privacy policy', impressum:'Legal notice',
      einstellungen:'Privacy settings'
    },
    pl: {
      titel:'Informacja o ochronie danych',
      start:'Nasza strona działa bez śledzenia i bez reklamowych plików cookie. Do <b>rezerwacji wizyt online</b> osadzamy jednak zewnętrzną usługę (Dr. Flex). Państwa adres IP zostaje wtedy przekazany na jej serwer, dlatego pytamy wcześniej.',
      buchung:'Do rezerwacji wizyt online osadzamy kalendarz naszego usługodawcy <b>Dr. Flex</b>. Państwa adres IP zostaje przekazany na jego serwer. Do otwarcia kalendarza potrzebujemy Państwa zgody.',
      aendern:'Tutaj mogą Państwo w każdej chwili zmienić swoją decyzję. Nasza strona działa bez śledzenia i bez reklamowych plików cookie. Zewnętrzną usługę (Dr. Flex) osadzamy wyłącznie na potrzeby <b>rezerwacji wizyt online</b>, przekazywany jest wtedy Państwa adres IP.',
      optKopf:'Funkcje niezbędne są zawsze aktywne',
      optLabel:'Ładuj komponenty zewnętrzne',
      optHinweis:'Kalendarz wizyt online (Dr. Flex). Bez zgody nadal mogą Państwo skontaktować się z nami telefonicznie pod numerem {tel} lub przez formularz kontaktowy.',
      alles:'Zezwól na wszystko', speichern:'Zapisz wybór', ablehnen:'Odrzuć wszystko',
      datenschutz:'Polityka prywatności', impressum:'Impressum',
      einstellungen:'Ustawienia prywatności'
    },
    ro: {
      titel:'Informare privind protecția datelor',
      start:'Site-ul nostru funcționează fără urmărire și fără cookie-uri publicitare. Pentru <b>programarea online</b> integrăm însă un serviciu extern (Dr. Flex). Adresa dumneavoastră IP este transmisă către serverul acestuia, de aceea vă întrebăm în prealabil.',
      buchung:'Pentru programarea online integrăm calendarul furnizorului nostru <b>Dr. Flex</b>. Adresa dumneavoastră IP este transmisă către serverul acestuia. Pentru a deschide calendarul avem nevoie de acordul dumneavoastră.',
      aendern:'Aici vă puteți modifica oricând decizia. Site-ul nostru funcționează fără urmărire și fără cookie-uri publicitare. Doar pentru <b>programarea online</b> integrăm un serviciu extern (Dr. Flex), care primește adresa dumneavoastră IP.',
      optKopf:'Funcțiile necesare sunt întotdeauna active',
      optLabel:'Încarcă componente externe',
      optHinweis:'Calendar de programări online (Dr. Flex). Fără acord ne puteți contacta în continuare telefonic la {tel} sau prin formularul de contact.',
      alles:'Permite tot', speichern:'Salvează selecția', ablehnen:'Respinge tot',
      datenschutz:'Confidențialitate', impressum:'Mențiuni legale',
      einstellungen:'Setări de confidențialitate'
    },
    ru: {
      titel:'Уведомление о защите данных',
      start:'Наш сайт работает без отслеживания и без рекламных файлов cookie. Однако для <b>онлайн-записи на приём</b> мы подключаем внешний сервис (Dr. Flex). При этом ваш IP-адрес передаётся на его сервер, поэтому мы спрашиваем вас заранее.',
      buchung:'Для онлайн-записи на приём мы подключаем календарь нашего поставщика услуг <b>Dr. Flex</b>. При этом ваш IP-адрес передаётся на его сервер. Чтобы открыть календарь, нам необходимо ваше согласие.',
      aendern:'Здесь вы можете в любой момент изменить своё решение. Наш сайт работает без отслеживания и без рекламных файлов cookie. Внешний сервис (Dr. Flex) подключается только для <b>онлайн-записи на приём</b>, при этом передаётся ваш IP-адрес.',
      optKopf:'Необходимые функции активны всегда',
      optLabel:'Загружать внешние компоненты',
      optHinweis:'Онлайн-календарь записи (Dr. Flex). Без согласия вы по-прежнему можете связаться с нами по телефону {tel} или через контактную форму.',
      alles:'Разрешить всё', speichern:'Сохранить выбор', ablehnen:'Отклонить всё',
      datenschutz:'Конфиденциальность', impressum:'Юридическая информация',
      einstellungen:'Настройки конфиденциальности'
    },
    tr: {
      titel:'Veri koruma bilgilendirmesi',
      start:'Web sitemiz takip ve reklam çerezleri olmadan çalışır. Ancak <b>çevrimiçi randevu</b> için harici bir hizmet (Dr. Flex) kullanıyoruz. Bu sırada IP adresiniz bu hizmetin sunucusuna aktarılır, bu nedenle size önceden soruyoruz.',
      buchung:'Çevrimiçi randevu için hizmet sağlayıcımız <b>Dr. Flex</b>’in takvimini kullanıyoruz. Bu sırada IP adresiniz sunucusuna aktarılır. Takvimi açmak için onayınıza ihtiyacımız var.',
      aendern:'Kararınızı buradan istediğiniz zaman değiştirebilirsiniz. Web sitemiz takip ve reklam çerezleri olmadan çalışır. Harici hizmeti (Dr. Flex) yalnızca <b>çevrimiçi randevu</b> için kullanıyoruz, bu sırada IP adresiniz aktarılır.',
      optKopf:'Gerekli işlevler her zaman etkindir',
      optLabel:'Harici bileşenleri yükle',
      optHinweis:'Çevrimiçi randevu takvimi (Dr. Flex). Onay vermeseniz de bize {tel} numaralı telefondan veya iletişim formu üzerinden ulaşabilirsiniz.',
      alles:'Tümüne izin ver', speichern:'Seçimi kaydet', ablehnen:'Tümünü reddet',
      datenschutz:'Gizlilik politikası', impressum:'Yasal bilgiler',
      einstellungen:'Gizlilik ayarları'
    },
    ar: {
      titel:'إشعار حماية البيانات',
      start:'يعمل موقعنا دون تتبّع ودون ملفات تعريف ارتباط إعلانية. لكن من أجل <b>حجز المواعيد عبر الإنترنت</b> ندمج خدمة خارجية (Dr. Flex). عندئذ يُنقل عنوان IP الخاص بكم إلى خادمها، لذلك نسألكم مسبقاً.',
      buchung:'من أجل حجز المواعيد عبر الإنترنت ندمج تقويم مزوّد الخدمة <b>Dr. Flex</b>. عندئذ يُنقل عنوان IP الخاص بكم إلى خادمه. لفتح التقويم نحتاج إلى موافقتكم.',
      aendern:'يمكنكم تغيير قراركم هنا في أي وقت. يعمل موقعنا دون تتبّع ودون ملفات تعريف ارتباط إعلانية. لا ندمج الخدمة الخارجية (Dr. Flex) إلا من أجل <b>حجز المواعيد عبر الإنترنت</b>، وعندئذ يُنقل عنوان IP الخاص بكم.',
      optKopf:'الوظائف الضرورية مفعّلة دائماً',
      optLabel:'تحميل المكوّنات الخارجية',
      optHinweis:'تقويم المواعيد عبر الإنترنت (Dr. Flex). بدون موافقة يمكنكم الوصول إلينا هاتفياً على {tel} أو عبر نموذج الاتصال.',
      alles:'السماح بالكل', speichern:'حفظ الاختيار', ablehnen:'رفض الكل',
      datenschutz:'سياسة الخصوصية', impressum:'البيانات القانونية',
      einstellungen:'إعدادات الخصوصية'
    }
  };

  var lang = (document.documentElement.getAttribute('lang') || 'de').slice(0, 2).toLowerCase();
  if (!I18N[lang]) { lang = 'de'; }
  var T = I18N[lang];

  function seite(name) { return BASIS + name + (lang === 'de' ? '' : '_' + lang) + '.html'; }

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
      /* Fokusrahmen nur fuer Tastaturbedienung, nicht beim Antippen */
      '.fc-box:focus{outline:none}',
      '.fc-opt input:focus{outline:none}',
      '.fc-opt input:focus-visible{outline:2px solid ' + C.gold + ';outline-offset:2px}',
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

  /* ---------- Dialog ----------
     modus: 'start'         erster Besuch, noch keine Entscheidung
            'buchung'       Klick auf den Terminkalender
            'einstellungen' nachtraegliche Aenderung ueber den Fusszeilenlink
  */
  var open = false;
  function dialog(modus) {
    if (open) { return; }
    open = true;
    var booking   = modus === 'buchung';
    var aenderung = modus === 'einstellungen';
    css();
    var ov = document.createElement('div');
    ov.className = 'fc-ov';
    ov.setAttribute('dir', document.documentElement.getAttribute('dir') || (lang === 'ar' ? 'rtl' : 'ltr'));
    ov.innerHTML =
      '<div class="fc-box" role="dialog" aria-modal="true" aria-labelledby="fc-t" tabindex="-1">' +
        '<h2 id="fc-t">' + T.titel + '</h2>' +
        '<p>' + (booking ? T.buchung : aenderung ? T.aendern : T.start) + '</p>' +
        '<div class="fc-opt">' +
          '<b>' + T.optKopf + '</b>' +
          '<label><input type="checkbox" id="fc-ext">' +
            '<span>' + T.optLabel +
              '<small>' + T.optHinweis.replace('{tel}', TELEFON) + '</small>' +
            '</span>' +
          '</label>' +
        '</div>' +
        '<button type="button" class="fc-btn fc-all" id="fc-yes">' + T.alles + '</button>' +
        '<button type="button" class="fc-btn fc-save" id="fc-save">' + T.speichern + '</button>' +
        '<button type="button" class="fc-btn fc-none" id="fc-no">' + T.ablehnen + '</button>' +
        '<div class="fc-links">' +
          '<a href="' + seite('datenschutz') + '" target="_blank" rel="noopener">' + T.datenschutz + '</a>·' +
          '<a href="' + seite('impressum') + '" target="_blank" rel="noopener">' + T.impressum + '</a>' +
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

    /* Wird eine bereits erteilte Einwilligung zurueckgezogen, ist der
       Dr.-Flex-Code in dieser Seite schon geladen. Ein Neuaufbau der Seite
       ist der einzige ehrliche Weg, ihn wieder loszuwerden. */
    function decline() {
      var vorher = get();
      save('none');
      close();
      if (vorher === 'all' && loaded) { location.reload(); }
    }

    /* Die Checkbox ist ein reiner Schalter. Sie schliesst den Dialog nicht
       und speichert nichts. Erst ein Klick auf einen der drei Buttons
       trifft die Entscheidung. Frueher rief das change-Ereignis direkt
       accept() auf, dadurch verschwand der Dialog beim Antippen sofort. */
    function applySelection() {
      var box = ov.querySelector('#fc-ext');
      if (box && box.checked) { accept(); } else { decline(); }
    }

    /* Nur beim allerersten Besuch bedeutet Wegklicken eine Ablehnung.
       Bei Buchung und nachtraeglicher Aenderung bleibt alles wie es war. */
    function abbrechen() { if (modus === 'start') { decline(); } else { close(); } }

    function onKey(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        abbrechen();
      }
    }

    /* Beim Nachjustieren den gespeicherten Stand anzeigen */
    if (aenderung && get() === 'all') {
      var vor = ov.querySelector('#fc-ext');
      if (vor) { vor.checked = true; }
    }

    ov.querySelector('#fc-yes').onclick  = accept;
    ov.querySelector('#fc-save').onclick = applySelection;
    ov.querySelector('#fc-no').onclick   = decline;
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function (e) {
      if (e.target !== ov) { return; }
      abbrechen();
    });

    /* Fokus auf den Dialog selbst, nicht auf die Checkbox. Sonst zeichnet
       die Browser den Fokusrahmen als schwarzen Kasten um das Kaestchen. */
    var boxEl = ov.querySelector('.fc-box');
    if (boxEl && boxEl.focus) { try { boxEl.focus({ preventScroll: true }); } catch (e) {} }
  }

  function askForBooking() { dialog('buchung'); }

  /* ---------- Nachtraegliche Aenderung ----------
     Die DSGVO verlangt, dass eine Einwilligung so leicht zurueckgenommen
     werden kann wie sie erteilt wurde. Der Link dafuer wird automatisch
     in die Fusszeile gesetzt, damit keine einzelne Seite gepflegt werden
     muss. Er faellt weder auf noch stoert er das Layout: er uebernimmt
     Aussehen und Trennzeichen des vorhandenen Datenschutz-Links. */
  window.frydentConsentOpen = function (e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    dialog('einstellungen');
    return false;
  };

  function einstellungenLink() {
    if (document.getElementById('fc-settings')) { return; }

    var kandidaten = document.querySelectorAll('a[href*="datenschutz"], a[href*="Datenschutz"]');
    var ziel = null;
    for (var i = 0; i < kandidaten.length; i++) {
      if (kandidaten[i].id !== 'fc-settings') { ziel = kandidaten[i]; }
    }
    if (!ziel || !ziel.parentNode) { return; }

    var a = document.createElement('a');
    a.id = 'fc-settings';
    a.href = '#';
    a.textContent = T.einstellungen;
    a.setAttribute('role', 'button');
    if (ziel.className) { a.className = ziel.className; }
    if (ziel.getAttribute('style')) { a.setAttribute('style', ziel.getAttribute('style')); }
    a.style.cursor = 'pointer';
    a.onclick = window.frydentConsentOpen;

    /* Trennzeichen der Fusszeile uebernehmen, falls eines benutzt wird.
       Bei Flex-Layouts mit gap steht zwischen den Links nur Leerraum,
       dann wird auch keines eingefuegt. */
    var davor = ziel.previousSibling;
    var trenner = null;
    if (davor && davor.nodeType === 3 && /[·|•–-]/.test(davor.nodeValue)) {
      trenner = document.createTextNode(davor.nodeValue);
    }

    var nach = ziel.nextSibling;
    if (trenner) { ziel.parentNode.insertBefore(trenner, nach); }
    ziel.parentNode.insertBefore(a, trenner ? trenner.nextSibling : nach);
  }

  /* ---------- Start ---------- */
  function init() {
    einstellungenLink();
    var v = get();
    if (v === 'all')  { loadDrFlex(); return; }   // Einwilligung liegt vor
    if (v === 'none') { return; }                 // abgelehnt: nichts nachladen
    dialog('start');                              // noch keine Entscheidung
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  /* Nachträgliche Änderung: window.frydentConsentReset() */
  window.frydentConsentReset = function () { save(''); location.reload(); };
})();
