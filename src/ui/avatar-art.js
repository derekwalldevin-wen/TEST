const palette = {
  panda: ['#2a232d', '#f5eee1', '#d4ad5c', '#c84d3e'],
  tang: ['#251d2a', '#f2c7b0', '#5a9d82', '#d2a04a'],
  youth: ['#28232d', '#f1c4af', '#b23e45', '#627785'],
  explorer: ['#6c2b2a', '#f2c5a9', '#477aa5', '#d5a044']
};

function defs(id, colors) {
  return `<defs>
    <linearGradient id="portrait-bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".46" stop-color="#315756"/><stop offset="1" stop-color="#102a2c"/></linearGradient>
    <radialGradient id="portrait-light-${id}" cx="50%" cy="38%" r="70%"><stop stop-color="${colors[2]}" stop-opacity=".48"/><stop offset=".68" stop-color="${colors[0]}" stop-opacity=".08"/><stop offset="1" stop-color="${colors[0]}" stop-opacity="0"/></radialGradient>
    <linearGradient id="portrait-cloth-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[3]}"/><stop offset=".48" stop-color="${colors[2]}"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient>
    <filter id="portrait-shadow-${id}" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#061719" flood-opacity=".5"/></filter>
  </defs>`;
}

function common(id, colors) {
  return `<rect width="320" height="360" rx="26" fill="url(#portrait-bg-${id})"/><rect x="1" y="1" width="318" height="358" rx="25" fill="none" stroke="${colors[3]}" stroke-opacity=".48" stroke-width="2"/><circle cx="160" cy="145" r="146" fill="url(#portrait-light-${id})"/><circle cx="160" cy="148" r="122" fill="none" stroke="${colors[3]}" stroke-opacity=".32" stroke-width="3"/><circle cx="160" cy="148" r="132" fill="none" stroke="#f3d98e" stroke-opacity=".14" stroke-width="1.5" stroke-dasharray="2 10"/><g fill="${colors[3]}" opacity=".46"><circle cx="32" cy="48" r="2"/><circle cx="278" cy="61" r="2"/><circle cx="38" cy="264" r="1.5"/><circle cx="281" cy="249" r="1.5"/></g><path d="M26 330h268" stroke="#f1d48a" stroke-opacity=".22" stroke-width="2"/>`;
}

function portraitEyes(y, left, right, leftIris = '#3b2420', rightIris = '#3b2420') {
  return `<ellipse cx="${left}" cy="${y}" rx="20" ry="24" fill="#fffaf0"/><ellipse cx="${right}" cy="${y}" rx="20" ry="24" fill="#fffaf0"/><ellipse cx="${left}" cy="${y+2}" rx="11" ry="15" fill="${leftIris}"/><ellipse cx="${right}" cy="${y+2}" rx="11" ry="15" fill="${rightIris}"/><circle cx="${left-5}" cy="${y-7}" r="4" fill="#fff"/><circle cx="${right-5}" cy="${y-7}" r="4" fill="#fff"/><path d="M${left-28} ${y-38}q28-16 56 0M${right-28} ${y-38}q28-16 56 0" fill="none" stroke="#432b2a" stroke-width="7" stroke-linecap="round"/>`;
}

function blush(y, color = '#d9827e') {
  return `<ellipse cx="91" cy="${y}" rx="20" ry="10" fill="${color}" opacity=".54"/><ellipse cx="229" cy="${y}" rx="20" ry="10" fill="${color}" opacity=".54"/>`;
}

function panda(id) {
  const c = palette.panda;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#portrait-shadow-${id})">
    <path d="M70 360c4-77 35-116 90-116s86 39 90 116Z" fill="url(#portrait-cloth-${id})"/>
    <path d="M87 265q73 39 146 0l-16 95H103Z" fill="#d6b36b" opacity=".9"/>
    <path d="M91 274 239 362" stroke="#c34e3e" stroke-width="18"/><path d="M99 273 247 361" stroke="#e7c46c" stroke-width="5" opacity=".7"/>
    <path d="M99 279h122" stroke="#f7e9c6" stroke-width="15" stroke-linecap="round"/>
    <path d="M77 112c0-59 36-98 83-98s83 39 83 98v38c0 55-36 94-83 94s-83-39-83-94Z" fill="${c[1]}"/>
    <circle cx="100" cy="38" r="35" fill="#25232b"/><circle cx="220" cy="38" r="35" fill="#25232b"/><circle cx="100" cy="38" r="18" fill="#51383d"/><circle cx="220" cy="38" r="18" fill="#51383d"/>
    <ellipse cx="124" cy="136" rx="37" ry="48" fill="#29242a"/><ellipse cx="196" cy="136" rx="37" ry="48" fill="#29242a"/>
    ${portraitEyes(137, 124, 196, '#4b2d25', '#4b2d25')}<ellipse cx="160" cy="184" rx="49" ry="27" fill="#fffaf0"/><ellipse cx="160" cy="174" rx="16" ry="11" fill="#2a1c1b"/><path d="M134 190q26 24 52 0" fill="none" stroke="#5b302d" stroke-width="5" stroke-linecap="round"/>
    <path d="M101 48q59-31 118 0l-8 39H109Z" fill="#c28c40"/><path d="M107 40q53-24 106 0" fill="none" stroke="#e4c489" stroke-width="12" stroke-linecap="round"/>
    <ellipse cx="160" cy="2" rx="37" ry="26" fill="#e4b847"/><circle cx="160" cy="-12" r="7" fill="#fff0ac"/><path d="M160 4 202 13 163 25Z" fill="#e88732"/><circle cx="136" cy="1" r="5" fill="#251d22"/><circle cx="184" cy="1" r="5" fill="#251d22"/>
    ${blush(177, '#d99588')}<circle cx="112" cy="87" r="5" fill="#fff" opacity=".6"/><circle cx="208" cy="87" r="5" fill="#fff" opacity=".6"/>
  </g>`;
}

function tang(id) {
  const c = palette.tang;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#portrait-shadow-${id})">
    <path d="M66 360c4-78 39-112 94-112s90 34 94 112Z" fill="#4e7792"/>
    <path d="M90 259q70 33 140 0l-15 101H105Z" fill="#5c9e82"/>
    <path d="M92 251q68 40 136 0" fill="none" stroke="#d5ae5b" stroke-width="17" stroke-linecap="round"/>
    <path d="M82 232c-18 45-22 78-19 111" fill="none" stroke="#d6ae5b" stroke-width="25" stroke-linecap="round"/><path d="M238 232c18 45 22 78 19 111" fill="none" stroke="#d6ae5b" stroke-width="25" stroke-linecap="round"/>
    <path d="M80 137c-7-75 29-117 80-117s87 42 80 117l-25 22H105Z" fill="#281d29"/>
    <circle cx="105" cy="35" r="43" fill="#281d29"/><circle cx="215" cy="35" r="43" fill="#281d29"/><path d="M92 29h27M201 29h27" stroke="#c79343" stroke-width="9" stroke-linecap="round"/><path d="M105 28q55-38 110 0" fill="none" stroke="#c79343" stroke-width="8"/>
    <path d="M99 93q61-55 122 0v53c0 57-28 88-61 88s-61-31-61-88Z" fill="#f2c7b0"/>
    ${portraitEyes(140, 126, 194, '#4d2826', '#4d2826')}${blush(173, '#d8837d')}
    <path d="M143 184q17 14 34 0" fill="none" stroke="#9b3e4a" stroke-width="5" stroke-linecap="round"/>
    <path d="M96 80q64-49 128 0l-12 34H108Z" fill="#281d29"/><path d="M119 75q41 24 82 0" fill="none" stroke="#3b2b34" stroke-width="12" stroke-linecap="round"/>
    <circle cx="105" cy="45" r="15" fill="#d66758"/><circle cx="105" cy="45" r="6" fill="#f4c66c"/>
    <g transform="translate(270 280) rotate(9)"><circle r="47" fill="#dcae58"/><circle r="39" fill="#f2e0b0"/><g fill="#d86957"><ellipse cx="0" cy="-18" rx="9" ry="17"/><ellipse cx="16" cy="-6" rx="9" ry="17" transform="rotate(60 16 -6)"/><ellipse cx="10" cy="19" rx="9" ry="17" transform="rotate(120 10 19)"/><ellipse cx="-10" cy="19" rx="9" ry="17" transform="rotate(240 -10 19)"/><ellipse cx="-16" cy="-6" rx="9" ry="17" transform="rotate(300 -16 -6)"/></g><path d="M0 17v65" stroke="#a96e35" stroke-width="9" stroke-linecap="round"/></g>
  </g>`;
}

function youth(id) {
  const c = palette.youth;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#portrait-shadow-${id})">
    <path d="M67 360c4-78 38-112 93-112s89 34 93 112Z" fill="url(#portrait-cloth-${id})"/>
    <path d="M96 257h128l-12 103H108Z" fill="#52656b"/><path d="M105 331h110" stroke="#b33e44" stroke-width="17"/>
    <path d="M79 137c-8-75 28-117 81-117s89 42 81 117l-23 21H101Z" fill="#25232b"/>
    <circle cx="94" cy="39" r="39" fill="#25232b"/><circle cx="226" cy="39" r="39" fill="#25232b"/><path d="M78 43q19 15 36 0M206 43q19 15 36 0" fill="none" stroke="#c43e45" stroke-width="8" stroke-linecap="round"/>
    <path d="M100 87q60-53 120 0v60c0 56-28 87-60 87s-60-31-60-87Z" fill="#f1c4af"/>
    ${portraitEyes(141, 126, 194, '#5a211e', '#5a211e')}${blush(174, '#d47e78')}
    <path d="M143 185q17 14 34 0" fill="none" stroke="#873e43" stroke-width="5" stroke-linecap="round"/>
    <path d="M95 84q65-54 130 0l-10 30H105Z" fill="#25232b"/><path d="M111 83q49 25 98 0" fill="none" stroke="#25232b" stroke-width="14" stroke-linecap="round"/>
    <path d="M79 247 241 178" stroke="#607b8a" stroke-width="15"/><rect x="206" y="190" width="55" height="45" rx="9" fill="#956341" transform="rotate(-25 206 190)"/><circle cx="225" cy="215" r="7" fill="#d7ad54"/>
    <g transform="translate(263 289) rotate(-12)"><circle r="28" fill="#c97938"/><path d="M-19-8-8 0M0-25V-10M19-8 8 0" stroke="#5c2b1e" stroke-width="6" stroke-linecap="round"/><circle cx="-10" cy="5" r="3" fill="#2d1918"/><circle cx="10" cy="5" r="3" fill="#2d1918"/><path d="M-7 15q7 6 14 0" fill="none" stroke="#5c2b1e" stroke-width="3"/></g>
  </g>`;
}

function explorer(id) {
  const c = palette.explorer;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#portrait-shadow-${id})">
    <path d="M67 360c4-78 38-112 93-112s89 34 93 112Z" fill="#ece6d2"/>
    <path d="M88 252q72 38 144 0l-16 108H104Z" fill="#f2eee1"/>
    <path d="M92 245 229 181" stroke="#8b4b2d" stroke-width="16"/><path d="M89 240h142" stroke="#8b4b2d" stroke-width="19"/><rect x="132" y="228" width="40" height="35" rx="6" fill="#d5a344"/>
    <rect x="68" y="304" width="37" height="46" rx="10" fill="#8b4b2d"/><rect x="215" y="304" width="37" height="46" rx="10" fill="#8b4b2d"/>
    <path d="M77 137c-7-78 31-119 83-119s90 41 83 119l-24 20H101Z" fill="#6f2927"/>
    <path d="M90 71q70-53 140 0" fill="none" stroke="#a84e32" stroke-width="19" stroke-linecap="round"/><path d="M101 45q59-34 118 0" fill="none" stroke="#c66a3d" stroke-width="9" stroke-linecap="round"/>
    <path d="M161 30q8-47 65-47" fill="none" stroke="#d5a344" stroke-width="11" stroke-linecap="round"/>
    <path d="M101 88q59-52 118 0v59c0 57-27 88-59 88s-59-31-59-88Z" fill="#f2c5a9"/>
    ${portraitEyes(141, 126, 194, '#28618b', '#d19b35')}${blush(174, '#cc7a70')}
    <path d="M143 185q17 14 34 0" fill="none" stroke="#8e413b" stroke-width="5" stroke-linecap="round"/>
    <path d="M104 89q56-45 112 0l-13 35H117Z" fill="#6f2927"/><path d="M123 88q37 21 74 0" fill="none" stroke="#a84e32" stroke-width="13" stroke-linecap="round"/>
    <circle cx="260" cy="248" r="23" fill="#d5a344"/><circle cx="260" cy="248" r="14" fill="#2b5364"/><path d="M260 235v26M247 248h26" stroke="#f5d78a" stroke-width="3"/>
    <path d="M32 303c24-14 45-9 55 12" fill="none" stroke="#d5a344" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>
  </g>`;
}

export function avatarSvg(def) {
  const id = `portrait-${def.id}`;
  const renderer = { panda, tang, youth, explorer }[def.character] || panda;
  return `<svg class="avatar-svg" viewBox="0 0 320 360" role="img" aria-label="${def.name}头像" xmlns="http://www.w3.org/2000/svg">${renderer(id)}</svg>`;
}
