/* ImmoCalc : module « Marchand de biens »
   À charger APRÈS le script principal de la page :
   <script src="marchand-de-biens.js"></script> juste avant </body> */
(function () {
  // ── Style (reprend les variables d'ImmoCalc) ──
  var css = '.tab-btn.active.c9{background:linear-gradient(135deg,var(--coral),var(--gold));color:#fff}' +
    '.mdb-bar{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}' +
    '.mdb-pill,.mdb-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:40px;border:1px solid var(--border2);background:transparent;color:var(--text2);font-family:Outfit,sans-serif;font-size:12px;cursor:pointer;transition:all .2s;white-space:nowrap;max-width:220px;text-decoration:none}' +
    '.mdb-pill span{overflow:hidden;text-overflow:ellipsis}.mdb-pill i{flex:none;width:8px;height:8px;border-radius:50%}' +
    '.mdb-pill:hover,.mdb-btn:hover{border-color:var(--gold);color:var(--gold)}' +
    '.mdb-pill.on{border-color:var(--gold);color:var(--text);background:var(--gold-dim);font-weight:500}' +
    '.mdb-btn.gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:var(--noir);border-color:transparent;font-weight:600}' +
    '.mdb-btn.gold:hover{color:var(--noir);box-shadow:0 8px 24px rgba(201,168,76,.3)}' +
    '.mdb-btn.warn{border-color:var(--coral2);color:var(--coral2)}' +
    '.mdb-ta{background:var(--card2);border:1px solid var(--border);border-radius:10px;padding:13px 16px;color:var(--text);font-family:Outfit,sans-serif;font-size:14px;width:100%;min-height:100px;resize:vertical;outline:none}' +
    '.mdb-ta:focus{border-color:rgba(201,168,76,.4)}' +
    '.mdb-chk{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text2);text-transform:none;letter-spacing:0;font-weight:400}.mdb-chk input{width:auto}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function f(id, label, val, step, hint) {
    return '<div class="field"><label for="mdb-' + id + '">' + label + '</label><input type="number" id="mdb-' + id + '"' +
      (val !== '' ? ' value="' + val + '"' : '') + ' step="' + step + '"' + (id === 'pret' ? ' placeholder="auto"' : '') + '>' +
      (hint ? '<span class="field-hint">' + hint + '</span>' : '') + '</div>';
  }

  var html = '<div class="module" id="mod-marchand"><div class="calc-card accent-gold">' +
    '<div class="card-header"><div class="card-icon" style="background:rgba(201,168,76,0.15);">🏗️</div><div class="card-header-text"><h2>Marchand de biens</h2><p>Simulez une opération : achat, travaux, revente, TVA sur marge, impôt et marge nette</p></div></div>' +
    '<div class="mdb-bar" id="mdb-tabs"></div>' +
    '<div class="mdb-bar"><button type="button" class="mdb-btn gold" id="mdb-new">+ Nouveau projet</button><button type="button" class="mdb-btn" id="mdb-copy">Copier le projet</button><button type="button" class="mdb-btn" id="mdb-del">Supprimer le projet</button><button type="button" class="mdb-btn" id="mdb-shareb">Transmettre le projet</button></div>' +
    '<div class="sub-section"><div class="sub-section-title" style="color:var(--gold2)">📁 Projet</div><div class="form-grid">' +
    '<div class="field"><label for="mdb-pnom">Nom du projet</label><input type="text" id="mdb-pnom" placeholder="Ex. Immeuble rue Victor Hugo"></div>' +
    '<div class="field"><label for="mdb-padr">Adresse</label><input type="text" id="mdb-padr" placeholder="Numéro, rue, code postal, ville"></div>' +
    '<div class="field"><label for="mdb-pstat">Statut</label><select id="mdb-pstat"></select></div></div>' +
    '<div class="field"><label for="mdb-pnote">Notes pour l\'équipe</label><textarea id="mdb-pnote" class="mdb-ta" placeholder="Points à suivre, contacts, décisions, prochaines étapes…"></textarea></div>' +
    '<p class="field-hint" style="margin-top:12px">Les projets sont enregistrés dans ce navigateur, sur cet appareil.</p></div>' +
    '<div class="sub-section hidden" id="mdb-share"><div class="sub-section-title" style="color:var(--gold2)">📤 Transmettre le projet</div>' +
    '<div class="field"><label for="mdb-sOut">Résumé à envoyer à l\'équipe</label><textarea id="mdb-sOut" class="mdb-ta" readonly></textarea></div>' +
    '<div class="mdb-bar" style="margin:12px 0 20px"><button type="button" class="mdb-btn gold" id="mdb-cpS">Copier le résumé</button><a class="mdb-btn" id="mdb-mail" target="_blank" rel="noopener">Envoyer par e-mail</a></div>' +
    '<div class="field"><label for="mdb-sCode">Code du projet</label><textarea id="mdb-sCode" class="mdb-ta" style="min-height:70px" readonly></textarea><span class="field-hint">Un collègue le colle dans son simulateur pour retrouver toutes les données.</span></div>' +
    '<div class="mdb-bar" style="margin:12px 0 20px"><button type="button" class="mdb-btn" id="mdb-cpC">Copier le code</button></div>' +
    '<div class="field"><label for="mdb-sImp">Importer un projet</label><textarea id="mdb-sImp" class="mdb-ta" style="min-height:70px" placeholder="Collez ici un code reçu"></textarea></div>' +
    '<div class="mdb-bar" style="margin:12px 0 0"><button type="button" class="mdb-btn" id="mdb-imp">Importer le projet</button><span class="field-hint" id="mdb-msg" role="status" style="align-self:center"></span></div></div>' +
    '<div class="section-label" style="color:var(--text2)">Achat</div><div class="form-grid">' +
    f('achat', 'Prix d\'achat (€)', 250000, 1000) +
    '<div class="field"><label for="mdb-regime">Régime des droits</label><select id="mdb-regime"><option value="1.5">Marchand de biens (≈ 1,5 %)</option><option value="7.5">Droits pleins (≈ 7,5 %)</option><option value="custom">Autre</option></select></div>' +
    f('notaire', 'Frais de notaire (%)', 1.5, 0.1, 'Taux sur le prix d\'achat') + f('agA', 'Frais d\'agence à l\'achat (%)', 0, 0.5) + '</div>' +
    '<div class="section-label" style="color:var(--text2)">Travaux et détention</div><div class="form-grid">' +
    f('trav', 'Travaux HT (€)', 80000, 1000, 'TVA supposée récupérable') + f('hon', 'Maîtrise d\'œuvre (% travaux)', 8, 0.5) +
    f('mois', 'Durée de l\'opération (mois)', 12, 1) + f('chg', 'Charges de détention (€/mois)', 300, 50, 'Taxe foncière, copro, assurance, énergie') + '</div>' +
    '<div class="section-label" style="color:var(--text2)">Financement</div><div class="form-grid">' +
    f('app', 'Apport personnel (€)', 60000, 1000) + f('pret', 'Montant du prêt (€)', '', 1000, 'Vide = calculé : achat + travaux − apport') +
    f('tx', 'Taux du crédit (%)', 4.5, 0.1, 'In fine, intérêts seuls') + f('dos', 'Frais de dossier et garanties (%)', 1.5, 0.1) + '</div>' +
    '<div class="section-label" style="color:var(--text2)">Revente</div><div class="form-grid">' +
    f('vente', 'Prix de revente (€)', 450000, 1000) + f('agV', 'Frais d\'agence à la vente (%)', 4, 0.5) + f('div', 'Diagnostics et frais divers (€)', 2000, 100) +
    '<div class="field"><label>TVA sur marge</label><label class="mdb-chk" for="mdb-tvam"><input type="checkbox" id="mdb-tvam" checked> Appliquer la TVA sur marge (20 %)</label></div></div>' +
    '<div id="mdb-res" class="result-grid"></div><div id="mdb-banner"></div>' +
    '<div class="note-box"><strong>Hypothèses :</strong> TVA sur marge à 20 % (achat hors TVA), impôt sur les sociétés à 15 % jusqu\'à 42 500 € de bénéfice puis 25 %, prêt remboursé in fine. Estimation indicative, à valider avec votre expert-comptable et votre notaire.</div>' +
    '</div></div>';

  // ── Injection dans la page : bouton d'onglet + module ──
  var nav = document.querySelector('.nav-tabs'), main = document.querySelector('main');
  if (!nav || !main) return;
  var btn = document.createElement('button');
  btn.className = 'tab-btn c9'; btn.textContent = '🏗️ Marchand de biens';
  btn.onclick = function () { showModule('marchand', btn); };
  nav.appendChild(btn);
  main.insertAdjacentHTML('beforeend', html);

  // ── Logique ──
  var $m = function (i) { return document.getElementById('mdb-' + i); };
  var F = ['achat', 'regime', 'notaire', 'agA', 'trav', 'hon', 'mois', 'chg', 'app', 'pret', 'tx', 'dos', 'vente', 'agV', 'tvam', 'div'];
  var ST = [['Prospection', '#6A6460'], ['Étude', '#3A8FC4'], ['Offre faite', '#C9A84C'], ['Compromis signé', '#5AB4E8'], ['Acquis', '#9278CC'], ['Travaux en cours', '#E07860'], ['En vente', '#3DCAB4'], ['Vendu', '#52D48E'], ['Abandonné', '#C45A42']];
  var KEY = 'immocalc-mdb-v1', S = { p: [], a: null }, DEF = {}, dt = null, L = {};
  var nv = function (i) { var x = parseFloat($m(i).value); return isNaN(x) ? 0 : x; };
  var cl = function (o) { return JSON.parse(JSON.stringify(o)); };
  function snap() { var o = {}; F.forEach(function (k) { var e = $m(k); o[k] = e.type === 'checkbox' ? e.checked : e.value; }); return o; }
  function put(o) { F.forEach(function (k) { var e = $m(k); if (e.type === 'checkbox') e.checked = o[k] === undefined ? true : o[k]; else if (o[k] !== undefined) e.value = o[k]; }); }
  function cur() { return S.p.filter(function (p) { return p.id === S.a; })[0]; }
  function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function mk(n, vals, s, ad) { return { id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name: n, address: ad || '', status: s || ST[0][0], notes: '', values: vals }; }
  function save() { var p = cur(); if (p) { p.values = snap(); persist(); } }
  var eur = function (x) { return fmt(x) + ' €'; };

  function calc() {
    var A = nv('achat'), V = nv('vente'), T = nv('trav'), M = nv('mois'), on = $m('tvam').checked;
    var notaire = A * nv('notaire') / 100, agA = A * nv('agA') / 100, hon = T * nv('hon') / 100;
    var base = A + notaire + agA + T + hon, auto = Math.max(0, base - nv('app'));
    var emp = nv('pret') > 0 ? nv('pret') : auto;
    $m('pret').placeholder = 'auto : ' + eur(auto);
    var inter = emp * nv('tx') / 100 * M / 12, dos = emp * nv('dos') / 100, chg = nv('chg') * M, agV = V * nv('agV') / 100, dv = nv('div');
    var cout = base + inter + dos + chg + agV + dv;
    var tva = on ? Math.max(0, V - A) * 20 / 120 : 0;
    var avant = V - tva - cout;
    var is = avant > 0 ? Math.min(avant, 42500) * 0.15 + Math.max(0, avant - 42500) * 0.25 : 0;
    var net = avant - is, fp = nv('app');
    var d = (on ? 5 / 6 : 1) - nv('agV') / 100, seuil = d > 0 ? (cout - agV - (on ? A / 6 : 0)) / d : 0;
    var mc = cout > 0 ? net / cout * 100 : 0, mcA = cout > 0 ? avant / cout * 100 : 0, mq = V > 0 ? net / V * 100 : 0, roi = fp > 0 ? net / fp * 100 : 0;
    L = { A: A, T: T, V: V, cout: cout, net: net, mc: mc };
    var col = net >= 0 ? 'var(--mint2)' : 'var(--coral2)';
    showResult('mdb-res',
      resultBox('Bénéfice net', fmt(net), '€', col, 'Après impôt sur les sociétés') +
      resultBox('Bénéfice avant impôt', fmt(avant), '€', 'var(--gold2)') +
      resultBox('Taux de marge nette', fmtD(mc, 1), '%', col, 'Sur coût de revient · avant impôt ' + fmtD(mcA, 1) + ' %') +
      resultBox('Taux de marque nette', fmtD(mq, 1), '%', 'var(--sky2)', 'Sur prix de revente') +
      resultBox('Rendement sur apport', fp > 0 ? fmtD(roi, 1) : '—', fp > 0 ? '%' : '', 'var(--violet2)') +
      resultBox('Coût de revient', fmt(cout), '€', 'var(--coral2)') +
      resultBox('TVA sur marge', fmt(tva), '€', 'var(--muted)', on ? '20 % de la marge' : 'Non appliquée') +
      resultBox('Impôt société', fmt(is), '€', 'var(--muted)', '15 % puis 25 %') +
      resultBox('Prêt', fmt(emp), '€', 'var(--teal2)', 'Coût : ' + eur(inter + dos) + ' (intérêts + frais)') +
      resultBox('Prix de revente minimum', fmt(seuil), '€', 'var(--text2)', 'Équilibre avant impôt'));
    var cls = mc >= 15 ? 'green' : mc >= 8 ? 'orange' : 'red';
    var msg = mc >= 15 ? '🟢 Opération rentable : marge nette de ' + fmtD(mc, 1) + ' %' : mc >= 8 ? '🟡 Marge correcte mais fragile : ' + fmtD(mc, 1) + ' %' : '🔴 Marge insuffisante : ' + fmtD(mc, 1) + ' %';
    $m('banner').innerHTML = '<div class="feasibility-banner ' + cls + '">' + msg + '</div>';
  }

  function tabs() {
    var t = $m('tabs'); t.innerHTML = '';
    S.p.forEach(function (p) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'mdb-pill' + (p.id === S.a ? ' on' : '');
      var c = ST.filter(function (s) { return s[0] === p.status; })[0];
      var i = document.createElement('i'); i.style.background = c ? c[1] : '#6A6460';
      var s = document.createElement('span'); s.textContent = p.name || 'Sans nom';
      b.appendChild(i); b.appendChild(s); b.onclick = function () { go(p.id); }; t.appendChild(b);
    });
  }
  function shareOpen() { return !$m('share').classList.contains('hidden'); }
  function show() {
    var p = cur(); put(p.values);
    $m('pnom').value = p.name; $m('padr').value = p.address; $m('pstat').value = p.status; $m('pnote').value = p.notes || '';
    calc(); tabs(); if (shareOpen()) fillShare();
  }
  function go(id) { save(); S.a = id; persist(); show(); }
  function resetDel() { clearTimeout(dt); dt = null; var b = $m('del'); b.textContent = 'Supprimer le projet'; b.classList.remove('warn'); }

  function summary() {
    var p = cur();
    return ['Projet : ' + (p.name || 'Sans nom'), 'Adresse : ' + (p.address || 'non renseignée'), 'Statut : ' + p.status, '',
      'Prix d\'achat : ' + eur(L.A), 'Travaux (HT) : ' + eur(L.T), 'Coût de revient total : ' + eur(L.cout), 'Prix de revente : ' + eur(L.V),
      'Bénéfice net après impôt : ' + eur(L.net), 'Taux de marge nette : ' + fmtD(L.mc, 1) + ' %', '', 'Notes : ' + (p.notes || 'aucune')].join('\n');
  }
  function fillShare() {
    var p = cur(), s = summary();
    $m('sOut').value = s;
    $m('mail').href = 'mailto:?subject=' + encodeURIComponent('Projet : ' + (p.name || 'Sans nom')) + '&body=' + encodeURIComponent(s);
    $m('sCode').value = 'MDB1:' + btoa(unescape(encodeURIComponent(JSON.stringify({ name: p.name, address: p.address, status: p.status, notes: p.notes || '', values: snap() }))));
  }
  function cp(id, b) {
    var e = $m(id), o = b.textContent;
    function done(ok) { b.textContent = ok ? 'Copié' : 'Sélectionné, faites Ctrl+C'; setTimeout(function () { b.textContent = o; }, 2000); }
    e.focus(); e.select();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(e.value).then(function () { done(true); }, function () { done(document.execCommand('copy')); });
      else done(document.execCommand('copy'));
    } catch (x) { done(false); }
  }

  var META = { pnom: 'name', padr: 'address', pstat: 'status', pnote: 'notes' };
  function onIn(e) {
    var id = (e.target.id || '').replace('mdb-', '');
    if (META[id]) { cur()[META[id]] = e.target.value; persist(); if (id === 'pnom' || id === 'pstat') tabs(); }
    else if (F.indexOf(id) > -1) {
      if (id === 'regime' && e.target.value !== 'custom') $m('notaire').value = e.target.value;
      if (id === 'notaire') $m('regime').value = (e.target.value === '1.5' || e.target.value === '7.5') ? e.target.value : 'custom';
      save(); calc();
    } else return;
    if (shareOpen()) fillShare();
  }
  var mod = document.getElementById('mod-marchand');
  mod.addEventListener('input', onIn); mod.addEventListener('change', onIn);

  $m('new').onclick = function () { save(); var p = mk('Nouveau projet', cl(DEF)); S.p.push(p); S.a = p.id; persist(); show(); $m('pnom').select(); };
  $m('copy').onclick = function () { save(); var p = cur(), c = mk((p.name || 'Sans nom') + ' (copie)', cl(p.values), p.status, p.address); c.notes = p.notes || ''; S.p.splice(S.p.indexOf(p) + 1, 0, c); S.a = c.id; persist(); show(); };
  $m('del').onclick = function () {
    if (!dt) { this.textContent = 'Confirmer la suppression'; this.classList.add('warn'); dt = setTimeout(resetDel, 4000); return; }
    resetDel(); var i = S.p.indexOf(cur()); S.p.splice(i, 1);
    if (!S.p.length) S.p.push(mk('Nouveau projet', cl(DEF)));
    S.a = S.p[Math.min(i, S.p.length - 1)].id; persist(); show();
  };
  $m('shareb').onclick = function () { var s = $m('share'); s.classList.toggle('hidden'); this.textContent = shareOpen() ? 'Fermer la transmission' : 'Transmettre le projet'; if (shareOpen()) fillShare(); };
  $m('cpS').onclick = function () { cp('sOut', this); };
  $m('cpC').onclick = function () { cp('sCode', this); };
  $m('imp').onclick = function () {
    var m = $m('msg');
    try {
      var t = $m('sImp').value.trim(); if (t.indexOf('MDB1:') !== 0) throw 0;
      var o = JSON.parse(decodeURIComponent(escape(atob(t.slice(5)))));
      save(); var p = mk(o.name || 'Projet importé', o.values || cl(DEF), o.status, o.address); p.notes = o.notes || '';
      S.p.push(p); S.a = p.id; persist(); show(); $m('sImp').value = ''; m.textContent = 'Projet importé.';
    } catch (e) { m.textContent = 'Code invalide : copiez-le en entier.'; }
  };

  // ── Démarrage ──
  $m('pstat').innerHTML = ST.map(function (s) { return '<option>' + s[0] + '</option>'; }).join('');
  DEF = snap();
  try { var r = localStorage.getItem(KEY); if (r) { var o = JSON.parse(r); if (o && o.p && o.p.length) S = o; } } catch (e) {}
  if (!S.p.length) S.p.push(mk('Projet 1', snap()));
  if (!cur()) S.a = S.p[0].id;
  show();
})();
