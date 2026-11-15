const byId = id => document.getElementById(id);
const sms = byId('sms'), result = byId('result');
function add(parent, tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  parent.append(node);
  return node;
}
function reset() { result.replaceChildren(); }
sms.oninput = reset;
byId('clear').onclick = () => { sms.value = ''; reset(); sms.focus(); };
byId('example').onclick = () => {
  sms.value = 'URGENT! You have won a free prize. Claim now at https://example.invalid/prize';
  reset(); sms.focus();
};
byId('check').onclick = () => {
  reset();
  const message = sms.value.trim();
  if (!message) { add(result,'p','Enter a message first.'); return; }
  const prediction = classify(message);
  if (!prediction.known) {
    add(result,'h2','Insufficient familiar English text');
  } else {
    add(result,'h2',prediction.label === 'spam' ? 'Likely spam' : 'Likely ham (ordinary SMS)');
    if (prediction.evidence.length) add(result,'p','Words pushing the model toward spam: ' +
      prediction.evidence.slice(0,3).map(item => item[0]).join(', ') + '.');
  }
  const patterns = /https?:\/\/\S+|www\.\S+|\b(?:urgent|immediately|act now|claim now|prize|winner|password|pin|verification code)\b/gi;
  const matches = [...message.matchAll(patterns)];
  add(result,'p',matches.length ? 'Safety cues: check links, pressure, rewards and requests for secrets.' : 'No listed warning pattern matched. Stay cautious.');
  const copy = add(result,'p','');
  let start = 0;
  for (const match of matches) {
    copy.append(message.slice(start,match.index));
    add(copy,'mark',match[0]);
    start = match.index + match[0].length;
  }
  copy.append(message.slice(start));
};
const audit = byId('audit'), report = MODEL.report;
const percent = x => (100*x).toFixed(2)+'%';
for (const [name, row] of [['Trained model',report.model],['Always ham',report.baseline]]) {
  add(audit,'h2',name);
  add(audit,'p', 'Accuracy '+percent(row.accuracy)+' · Spam precision '+
    (row.precision === null ? 'undefined (no alerts)' : percent(row.precision))+
    ' · Spam recall '+percent(row.recall)+'. False alarms: '+row.fp+'. Missed spam: '+row.fn+'.');
}
add(audit,'h2','Five held-out mistakes');
add(audit,'p','First five errors in the fixed test order. All examples come from the public collection.');
const list = add(audit,'ol','');
for (const error of report.errors) {
  const item = add(list,'li','');
  add(item,'strong',error.actual+' predicted as '+error.predicted);
  add(item,'p',error.text);
}
