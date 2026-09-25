const palette = {
  panda: ['#2d2630', '#f5eee1', '#d4ad5c', '#c84d3e'],
  tang: ['#251d2a', '#f2c7b0', '#5a9d82', '#d2a04a'],
  youth: ['#28232d', '#f1c4af', '#b23e45', '#627785'],
  explorer: ['#6c2b2a', '#f2c5a9', '#477aa5', '#d5a044']
};

function defs(id, colors) {
  return `<defs>
    <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".58" stop-color="#193b3d"/><stop offset="1" stop-color="#0d2528"/></linearGradient>
    <radialGradient id="halo-${id}" cx="50%" cy="38%" r="62%"><stop stop-color="${colors[2]}" stop-opacity=".42"/><stop offset="1" stop-color="${colors[0]}" stop-opacity="0"/></radialGradient>
    <linearGradient id="cloth-${id}" x1="0" y1="0" x2="0.9" y2="1"><stop stop-color="${colors[3]}"/><stop offset=".42" stop-color="${colors[2]}"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient>
    <filter id="shadow-${id}" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#071719" flood-opacity=".42"/></filter>
  </defs>`;
}

const common = (id, colors) => `<rect width="240" height="320" rx="24" fill="url(#bg-${id})"/><rect x="1" y="1" width="238" height="318" rx="23" fill="none" stroke="${colors[3]}" stroke-opacity=".45" stroke-width="2"/><circle cx="120" cy="112" r="104" fill="url(#halo-${id})"/><path d="M28 246C58 220 77 224 94 246M146 246c18-22 38-26 66 0" fill="none" stroke="${colors[3]}" stroke-opacity=".18" stroke-width="2"/><g fill="${colors[3]}" opacity=".36"><circle cx="28" cy="48" r="2"/><circle cx="207" cy="75" r="2"/><circle cx="38" cy="137" r="1.5"/><circle cx="201" cy="173" r="1.5"/></g>`;

const eyes = (y, left, right, leftIris = '#3c211f', rightIris = '#3c211f') => `<ellipse cx="${left}" cy="${y}" rx="13" ry="15" fill="#fff8ec"/><ellipse cx="${right}" cy="${y}" rx="13" ry="15" fill="#fff8ec"/><ellipse cx="${left}" cy="${y+1}" rx="7" ry="9" fill="${leftIris}"/><ellipse cx="${right}" cy="${y+1}" rx="7" ry="9" fill="${rightIris}"/><circle cx="${left-2}" cy="${y-4}" r="2.5" fill="#fff"/><circle cx="${right-2}" cy="${y-4}" r="2.5" fill="#fff"/><path d="M${left-18} ${y-24}q18-10 36 0M${right-18} ${y-24}q18-10 36 0" fill="none" stroke="#4b2c2a" stroke-width="4" stroke-linecap="round"/>`;

function panda(id) {
  const c = palette.panda;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#shadow-${id})">
    <path d="M62 286c2-45 24-69 58-69s57 24 59 69H62Z" fill="url(#cloth-${id})"/>
    <path d="M69 219q51 28 102 0l-9 67H78Z" fill="#d7b46c" opacity=".7"/>
    <path d="M72 233 167 299" stroke="#c34e3e" stroke-width="13"/><path d="M82 233 177 299" stroke="#e5c26a" stroke-width="4" opacity=".7"/>
    <path d="M88 238h64" stroke="#f6e9c6" stroke-width="11" stroke-linecap="round"/>
    <circle cx="76" cy="282" r="15" fill="#27232b"/><circle cx="164" cy="282" r="15" fill="#27232b"/>
    <circle cx="120" cy="123" r="68" fill="${c[1]}"/>
    <circle cx="67" cy="75" r="22" fill="#25232b"/><circle cx="173" cy="75" r="22" fill="#25232b"/><circle cx="67" cy="75" r="11" fill="#49353b"/><circle cx="173" cy="75" r="11" fill="#49353b"/>
    <ellipse cx="93" cy="128" rx="24" ry="31" fill="#2b252b"/><ellipse cx="147" cy="128" rx="24" ry="31" fill="#2b252b"/>
    ${eyes(129, 93, 147, '#4a2c25', '#4a2c25')}
    <ellipse cx="120" cy="157" rx="30" ry="17" fill="#fffaf0"/><ellipse cx="120" cy="151" rx="10" ry="7" fill="#2a1c1b"/><path d="M105 163q15 13 30 0" fill="none" stroke="#5b302d" stroke-width="3" stroke-linecap="round"/>
    <path d="M83 68q37-19 74 0l-5 22H88Z" fill="#c28c40"/><path d="M87 63q33-13 66 0" fill="none" stroke="#e4c489" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="120" cy="40" rx="22" ry="17" fill="#e4b847"/><circle cx="120" cy="30" r="4" fill="#fff0ac"/><path d="M120 40 142 45 122 51Z" fill="#e88732"/>
    <circle cx="105" cy="39" r="3" fill="#251d22"/><circle cx="135" cy="39" r="3" fill="#251d22"/>
  </g>`;
}

function tang(id) {
  const c = palette.tang;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#shadow-${id})">
    <path d="M67 290c5-48 26-73 53-73s49 25 54 73H67Z" fill="#527f99"/>
    <path d="M87 215h66l-12 37H97Z" fill="#5c9e82"/><path d="M96 212q24 15 48 0" fill="none" stroke="#d4a24a" stroke-width="10"/>
    <path d="M84 190q36 23 72 0l-17 22H101Z" fill="#5c9e82"/>
    <path d="M77 210q-23 35-28 67" fill="none" stroke="#d5ae5b" stroke-width="17" stroke-linecap="round"/><path d="M163 210q23 35 28 67" fill="none" stroke="#d5ae5b" stroke-width="17" stroke-linecap="round"/>
    <circle cx="120" cy="117" r="57" fill="#f2c7b0"/><path d="M65 119c-7-52 18-78 55-78s62 26 55 78l-18 11H82Z" fill="#281d29"/>
    <circle cx="82" cy="52" r="25" fill="#281d29"/><circle cx="158" cy="52" r="25" fill="#281d29"/><path d="M74 50h16M150 50h16" stroke="#c79343" stroke-width="5" stroke-linecap="round"/>
    <path d="M89 43q31-25 63 0" fill="none" stroke="#c79343" stroke-width="5"/>
    ${eyes(120, 100, 140, '#4d2726', '#4d2726')}
    <ellipse cx="86" cy="140" rx="12" ry="6" fill="#d8837d" opacity=".65"/><ellipse cx="154" cy="140" rx="12" ry="6" fill="#d8837d" opacity=".65"/>
    <path d="M111 141q9 8 18 0" fill="none" stroke="#9b3e4a" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(156 202)"><circle r="33" fill="#dfb55f"/><circle r="27" fill="#f2e0b0"/><g fill="#d86957"><ellipse cx="0" cy="-13" rx="6" ry="12"/><ellipse cx="11" cy="-5" rx="6" ry="12" transform="rotate(60 11 -5)"/><ellipse cx="7" cy="13" rx="6" ry="12" transform="rotate(120 7 13)"/><ellipse cx="-7" cy="13" rx="6" ry="12" transform="rotate(240 -7 13)"/><ellipse cx="-11" cy="-5" rx="6" ry="12" transform="rotate(300 -11 -5)"/></g><path d="M0 12v44" stroke="#a96e35" stroke-width="7" stroke-linecap="round"/></g>
    <circle cx="81" cy="55" r="9" fill="#d66758"/><circle cx="81" cy="55" r="3" fill="#f4c66c"/>
  </g>`;
}

function youth(id) {
  const c = palette.youth;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#shadow-${id})">
    <path d="M68 291c5-50 25-76 52-76s47 26 52 76H68Z" fill="url(#cloth-${id})"/>
    <path d="M84 211h72l-9 75H93Z" fill="#52656b"/><path d="M88 286h64l-2 19H89Z" fill="#b33e44"/><path d="M105 211v75M135 211v75" stroke="#819199" stroke-width="3" opacity=".8"/>
    <circle cx="120" cy="119" r="58" fill="#f1c4af"/><path d="M62 122c-9-52 17-79 58-79s67 27 58 79l-17 11H79Z" fill="#25232b"/>
    <circle cx="77" cy="55" r="24" fill="#25232b"/><circle cx="163" cy="55" r="24" fill="#25232b"/><path d="M66 57q12 9 23 0M151 57q12 9 23 0" fill="none" stroke="#c43e45" stroke-width="4" stroke-linecap="round"/>
    <path d="M96 62q24 18 48 0" fill="none" stroke="#25232b" stroke-width="11" stroke-linecap="round"/>
    ${eyes(123, 100, 140, '#5a211e', '#5a211e')}
    <ellipse cx="88" cy="145" rx="12" ry="6" fill="#d47e78" opacity=".6"/><ellipse cx="153" cy="145" rx="12" ry="6" fill="#d47e78" opacity=".6"/>
    <path d="M109 146q11 8 22 0" fill="none" stroke="#873e43" stroke-width="3" stroke-linecap="round"/>
    <path d="M77 220 166 177" stroke="#607b8a" stroke-width="9"/><rect x="142" y="177" width="35" height="31" rx="7" fill="#956341" transform="rotate(-25 142 177)"/><circle cx="156" cy="192" r="4" fill="#d7ad54"/>
    <g transform="translate(161 246) rotate(-14)"><circle r="19" fill="#c97938"/><path d="M-13-5-5 0M0-17v10M13-5 5 0" stroke="#5c2b1e" stroke-width="4" stroke-linecap="round"/><circle cx="-7" cy="3" r="2" fill="#2d1918"/><circle cx="7" cy="3" r="2" fill="#2d1918"/><path d="M-5 10q5 4 10 0" fill="none" stroke="#5c2b1e" stroke-width="2"/></g>
  </g>`;
}

function explorer(id) {
  const c = palette.explorer;
  return `${defs(id, c)}${common(id, c)}<g filter="url(#shadow-${id})">
    <path d="M68 291c5-50 25-76 52-76s47 26 52 76H68Z" fill="#ece6d2"/>
    <path d="M83 213h74l-9 72H92Z" fill="#ece6d2"/><path d="M88 222 164 177" stroke="#8b4b2d" stroke-width="10"/><path d="M86 214h70" stroke="#8b4b2d" stroke-width="14"/><rect x="108" y="205" width="24" height="22" rx="4" fill="#d5a344"/>
    <rect x="67" y="258" width="28" height="32" rx="8" fill="#8b4b2d"/><rect x="145" y="258" width="28" height="32" rx="8" fill="#8b4b2d"/>
    <path d="M72 287h96v19H72Z" fill="#6b3725"/><path d="M83 306h25M132 306h25" stroke="#c7954c" stroke-width="4"/>
    <circle cx="120" cy="119" r="58" fill="#f2c5a9"/><path d="M62 121c-7-52 19-80 58-80s65 28 58 80l-17 9H79Z" fill="#6f2927"/>
    <path d="M85 65q35-28 70 0" fill="none" stroke="#a84e32" stroke-width="12" stroke-linecap="round"/><path d="M91 47q29-18 58 0" fill="none" stroke="#c66a3d" stroke-width="5" stroke-linecap="round"/>
    <path d="M122 48q6-28 44-28" fill="none" stroke="#d5a344" stroke-width="7" stroke-linecap="round"/>
    ${eyes(123, 100, 140, '#28618b', '#d19b35')}
    <ellipse cx="88" cy="145" rx="12" ry="6" fill="#cc7a70" opacity=".6"/><ellipse cx="153" cy="145" rx="12" ry="6" fill="#cc7a70" opacity=".6"/>
    <path d="M109 146q11 8 22 0" fill="none" stroke="#8e413b" stroke-width="3" stroke-linecap="round"/>
    <circle cx="176" cy="218" r="13" fill="#d5a344"/><circle cx="176" cy="218" r="8" fill="#2b5364"/><path d="M176 210v16M168 218h16" stroke="#f5d78a" stroke-width="2"/>
  </g>`;
}

export function avatarSvg(def) {
  const id = `avatar-${def.id}`;
  const renderer = { panda, tang, youth, explorer }[def.character] || panda;
  return `<svg class="avatar-svg" viewBox="0 0 240 320" role="img" aria-label="${def.name}头像" xmlns="http://www.w3.org/2000/svg">${renderer(id)}</svg>`;
}
