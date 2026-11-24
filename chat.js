/* #leonida-dev chat engine.
   personas talk in threads (opener -> answers -> reactions), using the live devlog state.
   reads globals from the page script: last, posts, revealed, peers. */
(() => {
  const $c = document.getElementById('chat');
  if (!$c) return;

  const R = a => a[Math.floor(Math.random() * a.length)];
  const chance = p => Math.random() < p;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const MAX = 12;

  /* ---------- people ---------- */
  const P = {
    n0va:      { gpu: 'rtx 3060 laptop', res: '1080p', tone: 'hype',  col: 'c' },
    k3rnel:    { gpu: 'rtx 4070',        res: '1440p', tone: 'tech',  col: 'c' },
    vx:        { gpu: 'rtx 4080s',       res: '2160p', tone: 'calm',  col: 'c' },
    ghost_77:  { gpu: 'rx 6700 xt',      res: '1440p', tone: 'chill', col: 'c' },
    bitflip:   { gpu: 'rx 7800 xt',      res: '1440p', tone: 'tech',  col: 'c' },
    mara:      { gpu: 'rtx 3070',        res: '1440p', tone: 'chill', col: 'y' },
    dex0:      { gpu: 'gtx 1660s',       res: '1080p', tone: 'worry', col: 'y' },
    lowpoly:   { gpu: 'steam deck',      res: '800p',  tone: 'hype',  col: 'y' },
    sk3ptic:   { gpu: 'rtx 4060',        res: '1080p', tone: 'doubt', col: 'y' },
    tunnelrat: { gpu: 'rx 7600',         res: '1080p', tone: 'tired', col: 'c' },
    oxide:     { gpu: 'rtx 5090',        res: '2160p', tone: 'calm',  col: 'c' },
    pixl:      { gpu: 'arc a770',        res: '1080p', tone: 'worry', col: 'y' },
    rook:      { gpu: 'rtx 3080',        res: '1440p', tone: 'tired', col: 'c' },
    sundae:    { gpu: 'rtx 2060',        res: '1080p', tone: 'hype',  col: 'y' },
  };
  const NAMES = Object.keys(P);
  const FPS = { 'rtx 3060 laptop': 27, 'rtx 4070': 41, 'rtx 4080s': 36, 'rx 6700 xt': 30, 'rx 7800 xt': 38, 'rtx 3070': 33,
    'gtx 1660s': 24, 'steam deck': 14, 'rtx 4060': 29, 'rx 7600': 26, 'rtx 5090': 58, 'arc a770': 22, 'rtx 3080': 37, 'rtx 2060': 21 };

  const PLACES = ['the causeway', 'the boardwalk bar', 'the keys', 'downtown', 'the swamp', 'the marina', 'the bridge at night', 'the beach strip',
    'the tunnel', 'the airport', 'the trailer park', 'the docks', 'the highway north', 'the mall', 'the lighthouse', 'the gas station by the swamp',
    'the rooftop pool', 'the motel strip', 'the old pier', 'the golf course', 'the race track', 'the canal district'];
  const THINGS = ['the radio', 'helicopters', 'the water', 'night rain', 'traffic', 'cops', 'the bar', 'cutscenes', 'peds', 'the swamp',
    'boats', 'the phone', 'the map', 'weather'];
  const PLANS = ['drive the causeway at sunset', 'radio on, drive, nothing else', 'straight into the story, no spoilers', 'cops. 5 stars. immediately',
    'sit in the boardwalk bar for an hour', 'just walk around {place}', 'steal a boat and go to the keys', 'photo mode all night',
    'find every radio station', 'take a heli over {place}', 'drive to {place} in the rain', 'fish lol'];

  /* ---------- context ---------- */
  function ctx(speaker) {
    const L = (typeof last !== 'undefined' && last) || { title: 'mirror is up', dec: 3, s: {} };
    const start = Date.UTC(2026, 10, 24);
    const day = L.date ? Math.round((Date.parse(L.date + 'T00:00:00Z') - start) / 864e5) + 1 : 1;
    const left = Math.max(0, Math.ceil((Date.UTC(2026, 11, 22, 18) - Date.now()) / 864e5));
    const p = P[speaker] || {};
    return {
      day, left, dec: L.dec ?? 0, title: (L.title || '').toLowerCase(), gpu: p.gpu, res: p.res, fps: FPS[p.gpu] ?? 30,
      other: R(NAMES.filter(n => n !== speaker)), place: R(PLACES), thing: R(THINGS),
      peers: (typeof peers !== 'undefined' ? peers : 4800).toLocaleString('en-US'),
      story: L.s?.story ?? 0, online: L.s?.online ?? 0,
    };
  }
  const fill = (t, c) => t.replace(/\{(\w+)\}/g, (_, k) => (k === 'plan' ? fill(R(PLANS), c) : c[k] ?? ''));

  /* ---------- how each tone talks ---------- */
  const TAIL = {
    hype: [' lmao', ' lets gooo', '!!', ' fr', ' no cap'],
    tech: [' btw', ' fwiw', ' afaik', ' iirc', ' in theory'],
    calm: ['.', '.', ' i think', ' anyway'],
    chill: [' lol', ' tbh', ' ngl', ' haha'],
    worry: [' :/', ' i hope', ' hopefully', ' right?'],
    doubt: [' lol', ' idk', ' tho', ' allegedly', ' supposedly'],
    tired: [' ...', ' zzz', ' ugh', ' man'],
  };
  const HEAD = {
    hype: ['yo ', 'bro ', 'ok ', 'dude '],
    tech: ['so ', 'fwiw ', 'technically ', 'from what i read, '],
    calm: ['well, ', 'imo ', 'honestly '],
    chill: ['ngl ', 'honestly ', 'tbh ', 'eh '],
    worry: ['um ', 'ok but ', 'wait ', 'question: '],
    doubt: ['sure, ', 'ok but ', 'idk, ', 'hmm '],
    tired: ['ugh ', 'man ', 'late but ', 'half asleep but '],
  };
  function voice(name, text, kind) {
    const t = P[name]?.tone || 'calm';
    let s = text;
    if (kind !== 'r') {
      if (chance(0.3) && !/^\w+: /.test(s)) s = R(HEAD[t]) + s;
      if (chance(0.35)) s += R(TAIL[t]);
    } else if (chance(0.1)) s += R(TAIL[t]);
    if (t === 'hype' && chance(0.06)) s = s.toUpperCase();
    if (chance(0.06)) { // small typo
      const i = 1 + Math.floor(Math.random() * Math.max(1, s.length - 3));
      if (/[a-z]/.test(s[i]) && /[a-z]/.test(s[i + 1])) s = s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
    }
    return s;
  }

  /* ---------- conversation topics ---------- */
  const T = [
    { w: 5, o: ['will my {gpu} run it', 'is {gpu} enough for the drop', 'what fps should i expect on {gpu}', 'anyone else on {gpu}', '{gpu} at {res}, am i cooked'],
      a: ['check the table, {gpu} is around {fps}', '{fps}ish on {gpu} at {res}. it\'s a dev build', 'it\'ll run, just not at 60', 'drop shadows to medium and you\'re fine',
          'vram matters more than the core here', 'same card, expecting {fps} too', 'don\'t expect miracles from a debug build', '{fps} is playable, it\'s gta not cs',
          'i\'m on {gpu}, planning {res} and praying for {fps}', 'cap it at 30 and it\'ll feel smoother than {fps} unlocked', 'cpu matters too, the recompiler eats cores',
          'consoles run it at 30 anyway', 'the 1% lows are what\'ll hurt, not the avg'],
      r: ['ok cool', 'i\'ll take {fps}', '30 is still gta lol', 'fine by me', 'ty', 'rip', 'gonna lower everything then', 'good enough', 'honestly expected worse',
          'locking to 30 then', 'my fans are gonna scream', 'ok i\'m calm now'] },
    { w: 4, o: ['where\'s the magnet', 'link pls', 'can someone dm the magnet', 'how do i pull it', 'is there a download yet', 'early access anywhere?'],
      a: ['22.12. read the site', 'nobody has it, it\'s sealed', 'stop asking lol', 'drops 22.12 at 18 utc', 'not out. {left} days.', 'there is no early access, that\'s the whole point',
          'scroll up', 'pinned in the devlog'],
      r: ['ok ok', 'sorry', 'waiting then', 'alarm set', 'my bad', '{left} days. fine.', 'understood'] },
    { w: 6, o: ['day {day} post is crazy', '"{title}" lets go', 'did you see today\'s devlog', '"{title}". we\'re so back', 'they actually did it. {title}', 'today\'s post >>>',
          'day {day} and we already have "{title}"', 'who else read "{title}" at midnight', 'today\'s devlog made my week', 'how are they this fast. "{title}"'],
      a: ['yeah saw it', 'insane progress honestly', 'quick_resume at {dec}% now', 'every day something new', 'faster than i thought', 'imagine where it is in {left} days',
          'story bar at {story}% already', 'i read it three times', 'screenshot or it didn\'t happen (jk)', 'day {day} of {left} more. this is going to be close',
          'online bar finally moving, {online}%', 'i check at 00:07 utc every night now', 'tomorrow is gonna be even better', 'that post was short but huge'],
      r: ['for real', 'can\'t wait', 'this chat at 3am is my new life', 'mood', 'same', 'every day i check at midnight', 'addicted to this devlog'] },
    { w: 3, o: ['what do you think is in quick_resume_proto.bin', 'xbox branch {dec}%. what even is it', 'why is the xbox branch locked', 'xbox branch theories go'],
      a: ['probably series x texture packs', '120hz mode would be insane', 'quick resume on pc lol', 'nobody knows, that\'s the point', 'admin said wait for it',
          'my guess is a whole different build', 'something big if they encrypted it twice'],
      r: ['hope it\'s textures', 'we\'ll see', '{dec}% and climbing', 'tinfoil hat on', 'interesting', 'can\'t wait to see'] },
    { w: 3, o: ['this is fake right', 'how do we know any of this is real', 'screenshots or it didn\'t happen', 'smells like a troll', 'who even runs this'],
      a: ['read the devlog bro', 'bench numbers are too boring to be fake', 'if it was fake they\'d say 120 fps', 'it\'s free, nobody\'s selling anything',
          'verify.sh is in the repo, check hashes on the 22nd', 'you can just not download it', 'wait {left} days and see'],
      r: ['hm fair', 'still skeptical', 'we\'ll see on 22.12', 'ok that\'s a good point', 'fine. i\'m in', 'not convinced but ok', 'if it\'s real i owe you'] },
    { w: 4, o: ['first thing you\'re doing when it drops?', '{place} at night in the rain is gonna be unreal', 'free roam or story first', 'who\'s going straight to {place}',
          'what about {thing} at {place}', 'meet at {place} when online works?', 'best spot to watch the sunset, {place}?', 'i just want to see {thing} on pc'],
      a: ['{plan}', '{plan}', '{plan}', 'story. no spoilers in here pls', 'free roam for like 5 hours'],
      r: ['based', 'same', 'that\'s the plan', 'see you at {place}', 'cinema', 'love that'] },
    { w: 3, o: ['what does hyperion actually do', 'how does the gpu bridge work', 'why does first boot take so long', 'why was the sim locked to 30', 'what\'s prism'],
      a: ['recompiles console code to x86 ahead of time', 'turns console gpu commands into vulkan calls', 'shader cache build, ~6 min, only once',
          'physics step was tied to framerate, they interpolate now', 'read the changelog, it\'s all there', 'prism is the gpu bridge, hyperion is the cpu side'],
      r: ['makes sense', 'ty', 'smart', 'learned something', 'wild that it works at all', 'ok i get it now'] },
    { w: 5, o: ['it\'s 3am and i\'m refreshing a devlog', 'my boss thinks i\'m working', 'back from work, what did i miss', 'gm', 'gn chat', 'anyone else not sleeping',
          'night shift gang', 'lunch break check-in'],
      a: ['same lol', 'nothing, same as yesterday', 'today\'s post is up', 'gm', 'go to sleep', 'day {day} of this', '{other} has been here all night', 'welcome back',
          'you missed {other} arguing about fps for an hour', 'just {thing} talk, the usual', 'quick_resume went up to {dec}%', 'chat\'s been quiet, everyone waiting for 00:07',
          '{left} days left, hang in there'],
      r: ['lol', 'fair', 'one more refresh', 'ok ok', 'see you tomorrow', 'classic', 'brb coffee', 'back to "work"', 'night all'] },
    { w: 2, o: ['is mirror #3 gonna get hit too', 'what if they take it down', 'mirror #2 got nuked right?'],
      a: ['there are 9 mirrors', 'they always come back', 'admin said it\'s holding', 'pull it fast on the 22nd', '#3 is on a different host'],
      r: ['hope so', 'fingers crossed', 'ok', 'seeding the second i get it'] },
    { w: 2, o: ['ram question: is 16gb enough', 'hdd or ssd needed?', 'how much space do i need', 'does it need windows 11'],
      a: ['16 works, 32 is smoother', 'ssd. streaming will cry on an hdd', '~125g free to be safe', 'win10 is fine', 'readme has the sizes'],
      r: ['ty', 'time to clean my drive', 'buying an ssd lol', 'good to know'] },
    { w: 2, o: ['amd gang check in', 'intel arc anyone?', 'does it work on linux'],
      a: ['{gpu} here, waiting like everyone', 'arc is rough but boots, per the devlog', 'proton should be ok, it\'s vulkan already', 'amd works since the rdna water fix'],
      r: ['nice', 'phew', 'good news', 'hopium'] },
  ];
  const REVEAL = [
    { w: 1, o: ['wait', 'WAIT', 'bro', 'did you see the last post', 'no.', 'lmaooo'],
      a: ['we got played', '28 days. 28 DAYS', 'i set an alarm for this', 'there is no build??', 'i refreshed every single night', 'my {gpu} deserved better',
          'respect honestly', 'i told you it was fake', 'i literally cleared 125 gigs'],
      r: ['gg', 'i\'m buying the game', 'never pirating again lol', 'well played', 'ok that was funny', 'i hate this chat', 'legendary troll'] },
  ];

  const BOT = [
    'reminder: do not repost devlog screenshots without the mirror link',
    'mirror #3 health ok · {peers} peers · 9/9 in sync',
    'devlog day {day} is up: "{title}"',
    'public drop in {left}d. no early access. no dms.',
    'quick_resume_proto.bin: {dec}% decrypted',
    'check your pull with tools/verify.sh when it drops',
    'scam warning: we never sell anything. no tokens, no wallets, no paid access.',
    'be nice in chat. no doxxing, no links to paid "leaks".',
  ];
  const ADMIN = [
    'working on tomorrow\'s post. it\'s a good one',
    'mirror #3 is holding. thanks to everyone keeping it up',
    'stop dming me for the magnet. 22.12 18:00 utc. that\'s it',
    'to whoever asked: yes, amd works',
    'if you see this sold anywhere for money it\'s a scam. we don\'t sell anything',
    'quick_resume is at {dec}%. don\'t ask what\'s inside, we don\'t know either',
    'read the readme before asking about specs',
    'day {day}. {left} to go.',
  ];
  const ADMIN_REPLY = ['o7', 'king', 'ty admin', 'respect', 'goat', 'thanks for doing this'];

  /* ---------- rendering ---------- */
  const hhmm = d => d.toTimeString().slice(0, 5);
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const typing = document.createElement('div');
  typing.className = 'd';
  typing.style.minHeight = '1.5em';
  $c.after(typing);

  function line(who, text, when = new Date()) {
    let html;
    if (who === '*') html = `<span class="d">${hhmm(when)} * ${esc(text)}</span>`;
    else {
      const col = who === 'admin' ? 'r' : who === 'bot' ? 'g' : P[who]?.col || 'c';
      html = `<span class="d">${hhmm(when)}</span> <span class="${col}">&lt;${who}&gt;</span> ${esc(text)}`;
    }
    $c.insertAdjacentHTML('beforeend', `<div>${html}</div>`);
    while ($c.children.length > MAX) $c.firstChild.remove();
  }

  /* ---------- threads ---------- */
  const pickTopic = () => {
    const pool = (typeof revealed !== 'undefined' && revealed) ? REVEAL : T;
    let n = Math.random() * pool.reduce((s, t) => s + t.w, 0);
    for (const t of pool) if ((n -= t.w) < 0) return t;
    return pool[0];
  };
  function thread() {
    const t = pickTopic();
    const cast = NAMES.slice().sort(() => Math.random() - 0.5);
    const asker = cast[0], out = [];
    out.push([asker, fill(R(t.o), ctx(asker)), 'o']);
    const nA = 1 + Math.floor(Math.random() * 3);
    const answers = t.a.slice().sort(() => Math.random() - 0.5);
    for (let i = 1; i <= nA; i++) {
      const who = cast[i];
      let s = fill(answers[(i - 1) % answers.length], ctx(who));
      if (chance(0.25)) s = `${asker}: ${s}`;
      out.push([who, s, 'a']);
    }
    const reacts = t.r.slice().sort(() => Math.random() - 0.5);
    if (chance(0.7)) out.push([asker, fill(reacts[0], ctx(asker)), 'r']);
    if (chance(0.25)) out.push([cast[nA + 1], fill(reacts[1] || reacts[0], ctx(cast[nA + 1])), 'r']);
    return out.map(([w, s, k]) => [w, voice(w, s, k)]);
  }

  /* ---------- scheduler ---------- */
  const queue = [];
  let nextBot = Date.now() + rnd(150, 210) * 1000;
  let nextAdmin = Date.now() + rnd(600, 1200) * 1000;
  let nextJoin = Date.now() + rnd(60, 150) * 1000;

  function step() {
    const now = Date.now();
    if (now >= nextBot) { queue.unshift(['bot', fill(R(BOT), ctx('vx'))]); nextBot = now + rnd(160, 200) * 1000; }
    if (now >= nextAdmin) {
      queue.unshift(['admin', fill(R(ADMIN), ctx('vx'))]);
      if (chance(0.6)) queue.splice(1, 0, [R(NAMES), R(ADMIN_REPLY)]);
      nextAdmin = now + rnd(600, 1200) * 1000;
    }
    if (now >= nextJoin) { queue.unshift(['*', `${R(NAMES)} ${chance(0.7) ? 'joined' : 'left'}`]); nextJoin = now + rnd(60, 180) * 1000; }
    if (!queue.length) queue.push(...thread());

    const [who, text] = queue.shift();
    const delay = rnd(2000, 10000);
    if (who !== '*' && who !== 'bot') typing.textContent = `${who} is typing…`;
    setTimeout(() => { typing.textContent = ''; line(who, text); step(); }, delay);
  }

  /* ---------- backlog so the room isn't empty on load ---------- */
  function backlog() {
    const msgs = [];
    while (msgs.length < 10) msgs.push(...thread());
    let t = Date.now() - msgs.length * 6000;
    for (const [w, s] of msgs.slice(-10)) { line(w, s, new Date(t)); t += rnd(2000, 10000); }
  }

  const ready = setInterval(() => { // wait for the devlog to load so numbers are right
    if ((typeof last !== 'undefined' && last) || document.readyState === 'complete') { clearInterval(ready); backlog(); step(); }
  }, 300);
})();
