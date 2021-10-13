const cvs = document.getElementById('sheet');
const cell = document.getElementById('cell');
let sheet, page, pc, lc, mc, bc, bpl, block, margin = 10, space, fin, font;
function setSetting() {
  pc = Number(document.getElementById('page').value);
  lc = Number(document.getElementById('line').value);
  mc = Number(document.getElementById('meas').value);
  bc = Number(document.getElementById('beat').value);
  block = Number(document.getElementById('block').value);
  space = Number(document.getElementById('space').value);
  font = document.getElementById('font').value;
  fin = block / 10;
  if (!sheet) {
    sheet = new Array(pc);
  }
  while (sheet.length < pc) {
    sheet.push(new Array(lc));
  }
  while (sheet.length > pc) {
    sheet.pop();
  }
  for (let p = 0; p < pc; p++) {
    if (!sheet[p]) {
      sheet[p] = new Array(lc);
    }
    while (sheet[p].length < lc) {
      sheet[p].push(new Array(mc));
    }
    while (sheet[p].length > lc) {
      sheet[p].pop();
    }
    for (let i = 0; i < lc; i++) {
      if (!sheet[p][i]) {
        sheet[p][i] = new Array(mc);
      }
      while (sheet[p][i].length < mc) {
        sheet[p][i].push(new Array(bc));
      }
      while (sheet[p][i].length > mc) {
        sheet[p][i].pop();
      }
      for (let j = 0; j < mc; j++) {
        if (!sheet[p][i][j]) {
          sheet[p][i][j] = new Array(bc);
        }
        while (sheet[p][i][j].length < bc) {
          sheet[p][i][j].push([[]]);
        }
        while (sheet[p][i][j].length > bc) {
          sheet[p][i][j].pop();
        }
        for (let k = 0; k < bc; k++) {
          if (!sheet[p][i][j][k]) {
            sheet[p][i][j][k] = [[]];
          }
        }
      }
    }
  }
  page = 0;
  selection = null;
  draw();
}
window.onload = setSetting;
function setData(value) {
  try {
    document.getElementById('page').value = value.length;
    document.getElementById('line').value = value[0].length;
    document.getElementById('meas').value = value[0][0].length;
    document.getElementById('beat').value = value[0][0][0].length;
    sheet = value;
    setSetting();
    draw();
  } catch (err) {
    alert(err);
  }
}
function download() {
  const filename = prompt("파일 이름? (확장자 제외, 기본값: sheet)", "sheet");
  if (filename) {
    const blob = new Blob([JSON.stringify(sheet)], { type: 'text/json' });
    const anchor = document.createElement('a');
    anchor.download = filename + ".json";
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
  }
}
function upload() {
  fetch(URL.createObjectURL(document.getElementById('sheet-input').files[0])).then(response => response.json()).then(value => setData(value));
}
let w, h;
let selection = null;
const notes = {
  'a;;': '㣴',
  'a;': '僙',
  'a': '黃',
  'a:': '潢',
  'a::': '㶂',
  'b;;': '㣕',
  'b;': '㐲',
  'b': '大',
  'b:': '汏',
  'b::': '𣴘',
  'c;;': '㣖',
  'c;': '㑀',
  'c': '太',
  'c:': '汰',
  'c::': '㳲',
  'd;;': '㣣',
  'd;': '俠',
  'd': '夾',
  'd:': '浹',
  'd::': '㴺',
  'e;;': '㣨',
  'e;': '㑬',
  'e': '姑',
  'e:': '㴌',
  'e::': '㵈',
  'f;;': '㣡',
  'f;': '㑖',
  'f': '仲',
  'f:': '㳞',
  'f::': '㴢',
  'g;;': '㣸',
  'g;': '𠐭',
  'g': '㽔',
  'g:': '㶋',
  'g::': '㶙',
  'h;;': '㣩',
  'h;': '㑣',
  'h': '林',
  'h:': '淋',
  'h::': '㵉',
  'i;;': '𢓡',
  'i;': '侇',
  'i': '夷',
  'i:': '洟',
  'i::': '㴣',
  'j;;': '㣮',
  'j;': '㑲',
  'j': '南',
  'j:': '湳',
  'j::': '㵜',
  'k;;': '㣳',
  'k;': '㒇',
  'k': '無',
  'k:': '潕',
  'k::': '㶃',
  'l;;': '㣹',
  'l;': '㒣',
  'l': '應',
  'l:': '㶐',
  'l::': '㶝',
  '.': '\u25B3',
  ' ': '一',
  '': false,
}
function draw() {
  w = cvs.width = margin * 2 + (block + space) * lc;
  h = cvs.height = margin * 2 + block * mc * bc + fin;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = 'grey';
  if (selection) {
    ctx.fillRect(w - (selection.x + 1) * (block + space) - margin, (selection.y * bc + selection.z) * block + margin, block, block);
  }
  ctx.lineWidth = 3;
  ctx.fillStyle = ctx.strokeStyle = 'black';
  ctx.strokeRect(margin, margin, w - margin * 2, h - margin * 2);
  ctx.beginPath();
  for (let i = 0; i < lc; i++) {
    ctx.moveTo(margin + (i + 1) * (block + space), margin);
    ctx.lineTo(margin + (i + 1) * (block + space), h - margin);
    ctx.moveTo(margin + (i + 1) * (block + space) - space, margin);
    ctx.lineTo(margin + (i + 1) * (block + space) - space, h - margin);
  }
  for (let i = 0; i < lc; i++) {
    for (let j = 1; j < mc; j++) {
      ctx.moveTo(margin + (block + space) * i, margin + j * bc * block);
      ctx.lineTo(margin + (block + space) * i + block, margin + j * bc * block);
    }
  }
  ctx.moveTo(margin, h - margin - fin);
  ctx.lineTo(margin + block, h - margin - fin);
  ctx.stroke();
  ctx.closePath();
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < lc; i++) {
    for (let j = 0; j < mc; j++) {
      for (let k = 1; k < bc; k++) {
        ctx.moveTo(margin + (block + space) * i, margin + (bc * j + k) * block);
        ctx.lineTo(margin + (block + space) * i + block, margin + (bc * j + k) * block);
      }
    }
  }
  ctx.stroke();
  ctx.closePath();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < lc; i++) {
    for (let j = 0; j < mc; j++) {
      for (let k = 0; k < bc; k++) {
        let fntSz = Math.max(2, sheet[page][i][j][k].length);
        for (let l = 0; l < sheet[page][i][j][k].length; l++) {
          fntSz = Math.max(fntSz, sheet[page][i][j][k][l].length);
        }
        for (let l = 0; l < sheet[page][i][j][k].length; l++) {
          ctx.font = `${block / Math.max(2, Math.max(sheet[page][i][j][k].length, sheet[page][i][j][k][l].length))}px '${font}'`;
          for (let m = 0; m < sheet[page][i][j][k][l].length; m++) {
            if (notes[sheet[page][i][j][k][l][m]]) {
              ctx.fillText(notes[sheet[page][i][j][k][l][m]], w - margin - (block + space) * (i + 1) + block / 2 / sheet[page][i][j][k][l].length * (m * 2 + 1), margin + block * (j * bc + k) + block / 2 / sheet[page][i][j][k].length * (l * 2 + 1));
            }
          }
        }
      }
    }
  }
  document.getElementById('page-disp').innerHTML = `${page + 1}/${pc}`;
}
cvs.onclick = function (e) {
  const rawX = e.offsetX;
  const rawY = e.offsetY;
  if (rawX < margin || rawX > w - margin || rawY < margin || rawY > h - margin) {
    return;
  }
  const x = Math.floor((w - rawX - margin) / (block + space));
  if (x * (block + space) + space > w - rawX - margin) {
    selection = null;
    cell.parentElement.hidden = true;
    draw();
    return;
  }
  const y = Math.floor((rawY - margin) / bc / block);
  const z = Math.floor(((rawY - margin) - y * bc * block) / block);
  if (selection && selection.x == x && selection.y == y && selection.z == z) {
    selection = null;
    cell.parentElement.hidden = true;
  }
  else {
    selection = { x: x, y: y, z: z };
    cell.value = JSON.stringify(sheet[page][selection.x][selection.y][selection.z]);
    cell.parentElement.hidden = false;
    cell.focus();
  }
  draw();
}
cell.onkeyup = function (e) {
  if (e.keyCode == 13) {
    try {
      sheet[page][selection.x][selection.y][selection.z] = JSON.parse(cell.value.replaceAll("'", '"'));
      selection = null;
      cell.parentElement.hidden = true;
    }
    catch (err) {
      alert(err);
    }
    draw();
  }
}

/*const freqRatios = {
  "eastern": {
    'a;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 1,
    'b;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 2187 / 2048,
    'c;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 9 / 8,
    'd;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 9 / 8 * 2187 / 2048,
    'e;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 81 / 64,
    'f;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 81 / 64 * 2187 / 2048,
    'g;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 729 / 512,
    'h;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 3 / 2,
    'i;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 3 / 2 * 2187 / 2048,
    'j;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 27 / 16,
    'k;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 27 / 16 * 2187 / 2048,
    'l;;': 128 / 243 * 2048 / 2187 * 128 / 243 * 2048 / 2187 * 243 / 128,
    'a;': 128 / 243 * 2048 / 2187 * 1,
    'b;': 128 / 243 * 2048 / 2187 * 2187 / 2048,
    'c;': 128 / 243 * 2048 / 2187 * 9 / 8,
    'd;': 128 / 243 * 2048 / 2187 * 9 / 8 * 2187 / 2048,
    'e;': 128 / 243 * 2048 / 2187 * 81 / 64,
    'f;': 128 / 243 * 2048 / 2187 * 81 / 64 * 2187 / 2048,
    'g;': 128 / 243 * 2048 / 2187 * 729 / 512,
    'h;': 128 / 243 * 2048 / 2187 * 3 / 2,
    'i;': 128 / 243 * 2048 / 2187 * 3 / 2 * 2187 / 2048,
    'j;': 128 / 243 * 2048 / 2187 * 27 / 16,
    'k;': 128 / 243 * 2048 / 2187 * 27 / 16 * 2187 / 2048,
    'l;': 128 / 243 * 2048 / 2187 * 243 / 128,
    'a': 1,
    'b': 2187 / 2048,
    'c': 9 / 8,
    'd': 9 / 8 * 2187 / 2048,
    'e': 81 / 64,
    'f': 81 / 64 * 2187 / 2048,
    'g': 729 / 512,
    'h': 3 / 2,
    'i': 3 / 2 * 2187 / 2048,
    'j': 27 / 16,
    'k': 27 / 16 * 2187 / 2048,
    'l': 243 / 128,
    'a:': 243 / 128 * 2187 / 2048 * 1,
    'b:': 243 / 128 * 2187 / 2048 * 2187 / 2048,
    'c:': 243 / 128 * 2187 / 2048 * 9 / 8,
    'd:': 243 / 128 * 2187 / 2048 * 9 / 8 * 2187 / 2048,
    'e:': 243 / 128 * 2187 / 2048 * 81 / 64,
    'f:': 243 / 128 * 2187 / 2048 * 81 / 64 * 2187 / 2048,
    'g:': 243 / 128 * 2187 / 2048 * 729 / 512,
    'h:': 243 / 128 * 2187 / 2048 * 3 / 2,
    'i:': 243 / 128 * 2187 / 2048 * 3 / 2 * 2187 / 2048,
    'j:': 243 / 128 * 2187 / 2048 * 27 / 16,
    'k:': 243 / 128 * 2187 / 2048 * 27 / 16 * 2187 / 2048,
    'l:': 243 / 128 * 2187 / 2048 * 243 / 128,
    'a::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 1,
    'b::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 2187 / 2048,
    'c::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 9 / 8,
    'd::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 9 / 8 * 2187 / 2048,
    'e::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 81 / 64,
    'f::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 81 / 64 * 2187 / 2048,
    'g::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 729 / 512,
    'h::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 3 / 2,
    'i::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 3 / 2 * 2187 / 2048,
    'j::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 27 / 16,
    'k::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 27 / 16 * 2187 / 2048,
    'l::': 243 / 128 * 2187 / 2048 * 243 / 128 * 2187 / 2048 * 243 / 128,
  },
  "western": {
    "a;;": Math.pow(2, -24 / 12),
    "b;;": Math.pow(2, -23 / 12),
    "c;;": Math.pow(2, -22 / 12),
    "d;;": Math.pow(2, -21 / 12),
    "e;;": Math.pow(2, -20 / 12),
    "f;;": Math.pow(2, -19 / 12),
    "g;;": Math.pow(2, -18 / 12),
    "h;;": Math.pow(2, -17 / 12),
    "i;;": Math.pow(2, -16 / 12),
    "j;;": Math.pow(2, -15 / 12),
    "k;;": Math.pow(2, -14 / 12),
    "l;;": Math.pow(2, -13 / 12),
    "a;": Math.pow(2, -12 / 12),
    "b;": Math.pow(2, -11 / 12),
    "c;": Math.pow(2, -10 / 12),
    "d;": Math.pow(2, -9 / 12),
    "e;": Math.pow(2, -8 / 12),
    "f;": Math.pow(2, -7 / 12),
    "g;": Math.pow(2, -6 / 12),
    "h;": Math.pow(2, -5 / 12),
    "i;": Math.pow(2, -4 / 12),
    "j;": Math.pow(2, -3 / 12),
    "k;": Math.pow(2, -2 / 12),
    "l;": Math.pow(2, -1 / 12),
    "a": Math.pow(2, 0 / 12),
    "b": Math.pow(2, 1 / 12),
    "c": Math.pow(2, 2 / 12),
    "d": Math.pow(2, 3 / 12),
    "e": Math.pow(2, 4 / 12),
    "f": Math.pow(2, 5 / 12),
    "g": Math.pow(2, 6 / 12),
    "h": Math.pow(2, 7 / 12),
    "i": Math.pow(2, 8 / 12),
    "j": Math.pow(2, 9 / 12),
    "k": Math.pow(2, 10 / 12),
    "l": Math.pow(2, 11 / 12),
    "a:": Math.pow(2, 12 / 12),
    "b:": Math.pow(2, 13 / 12),
    "c:": Math.pow(2, 14 / 12),
    "d:": Math.pow(2, 15 / 12),
    "e:": Math.pow(2, 16 / 12),
    "f:": Math.pow(2, 17 / 12),
    "g:": Math.pow(2, 18 / 12),
    "h:": Math.pow(2, 19 / 12),
    "i:": Math.pow(2, 20 / 12),
    "j:": Math.pow(2, 21 / 12),
    "k:": Math.pow(2, 22 / 12),
    "l:": Math.pow(2, 23 / 12),
    "a::": Math.pow(2, 24 / 12),
    "b::": Math.pow(2, 25 / 12),
    "c::": Math.pow(2, 26 / 12),
    "d::": Math.pow(2, 27 / 12),
    "e::": Math.pow(2, 28 / 12),
    "f::": Math.pow(2, 29 / 12),
    "g::": Math.pow(2, 30 / 12),
    "h::": Math.pow(2, 31 / 12),
    "i::": Math.pow(2, 32 / 12),
    "j::": Math.pow(2, 33 / 12),
    "k::": Math.pow(2, 34 / 12),
    "l::": Math.pow(2, 35 / 12),
  }
};*/
const freqRatios = {
  "eastern": {
    "a;;": 0.2433154746922973,
    "b;;": 0.25982956208596397,
    "c;;": 0.2737299090288345,
    "d;;": 0.29230825734670945,
    "e;;": 0.3079461476574388,
    "f;;": 0.32884678951504814,
    "g;;": 0.34643941611461865,
    "h;;": 0.36497321203844596,
    "i;;": 0.38974434312894596,
    "j;;": 0.4105948635432517,
    "k;;": 0.4384623860200642,
    "l;;": 0.46191922148615816,
    "a;": 0.4932701842725722,
    "b;": 0.5267489711934157,
    "c;": 0.5549289573066437,
    "d;": 0.5925925925925927,
    "e;": 0.6242950769699742,
    "f;": 0.6666666666666669,
    "g;": 0.7023319615912209,
    "h;": 0.7399052764088583,
    "i;": 0.7901234567901235,
    "j;": 0.8323934359599656,
    "k;": 0.8888888888888891,
    "l;": 0.9364426154549612,
    "a": 1,
    "b": 1.06787109375,
    "c": 1.125,
    "d": 1.20135498046875,
    "e": 1.265625,
    "f": 1.3515243530273438,
    "g": 1.423828125,
    "h": 1.5,
    "i": 1.601806640625,
    "j": 1.6875,
    "k": 1.802032470703125,
    "l": 1.8984375,
    "a:": 2.0272865295410156,
    "b:": 2.164880683645606,
    "c:": 2.2806973457336426,
    "d:": 2.435490769101307,
    "e:": 2.565784513950348,
    "f:": 2.73992711523897,
    "g:": 2.8865075781941414,
    "h:": 3.0409297943115234,
    "i:": 3.247321025468409,
    "j:": 3.421046018600464,
    "k:": 3.65323615365196,
    "l:": 3.848676770925522,
    "a::": 4.109890672858455,
    "b::": 4.388833448018282,
    "c::": 4.623627006965762,
    "d::": 4.937437629020567,
    "e::": 5.201580382836482,
    "f::": 5.554617332648138,
    "g::": 5.851777930691043,
    "h::": 6.164836009287683,
    "i::": 6.583250172027423,
    "j::": 6.935440510448643,
    "k::": 7.4061564435308505,
    "l::": 7.802370574254724
  },
  "western": {
    "a;;": 0.25,
    "b;;": 0.2648657735898238,
    "c;;": 0.28061551207734325,
    "d;;": 0.29730177875068026,
    "e;;": 0.3149802624737183,
    "f;;": 0.3337099635425086,
    "g;;": 0.35355339059327373,
    "h;;": 0.3745767692191704,
    "i;;": 0.3968502629920499,
    "j;;": 0.4204482076268573,
    "k;;": 0.44544935907016964,
    "l;;": 0.47193715634084676,
    "a;": 0.5,
    "b;": 0.5297315471796477,
    "c;": 0.5612310241546865,
    "d;": 0.5946035575013605,
    "e;": 0.6299605249474366,
    "f;": 0.6674199270850172,
    "g;": 0.7071067811865475,
    "h;": 0.7491535384383408,
    "i;": 0.7937005259840998,
    "j;": 0.8408964152537146,
    "k;": 0.8908987181403393,
    "l;": 0.9438743126816935,
    "a": 1,
    "b": 1.0594630943592953,
    "c": 1.122462048309373,
    "d": 1.189207115002721,
    "e": 1.2599210498948732,
    "f": 1.3348398541700344,
    "g": 1.4142135623730951,
    "h": 1.4983070768766815,
    "i": 1.5874010519681994,
    "j": 1.6817928305074292,
    "k": 1.7817974362806788,
    "l": 1.887748625363387,
    "a:": 2,
    "b:": 2.1189261887185906,
    "c:": 2.244924096618746,
    "d:": 2.378414230005442,
    "e:": 2.5198420997897464,
    "f:": 2.6696797083400687,
    "g:": 2.82842712474619,
    "h:": 2.996614153753363,
    "i:": 3.174802103936399,
    "j:": 3.3635856610148585,
    "k:": 3.563594872561357,
    "l:": 3.775497250726774,
    "a::": 4,
    "b::": 4.237852377437181,
    "c::": 4.489848193237491,
    "d::": 4.756828460010884,
    "e::": 5.039684199579494,
    "f::": 5.339359416680137,
    "g::": 5.65685424949238,
    "h::": 5.993228307506726,
    "i::": 6.3496042078727974,
    "j::": 6.727171322029717,
    "k::": 7.127189745122715,
    "l::": 7.550994501453547
  }
};

function play() {
  const aFreq = document.getElementById('tone-type').value;
  const freqRatio = freqRatios[document.getElementById('tune-type').value];
  cell.disabled = true;
  for (const element of document.getElementsByTagName("input")) {
    element.disabled = true;
  }
  for (const element of document.getElementsByTagName("textarea")) {
    element.disabled = true;
  }
  for (const element of document.getElementsByTagName("select")) {
    element.disabled = true;
  }
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  let lastFreq = '';
  oscillator.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0;
  for (let p = 0; p < pc; p++) {
    for (let i = 0; i < lc; i++) {
      for (let j = 0; j < mc; j++) {
        for (let k = 0; k < bc; k++) {
          for (let x = 0; x < sheet[p][i][j][k].length; x++) {
            for (let y = 0; y < sheet[p][i][j][k][x].length; y++) {
              const time = (p * lc * mc * bc + i * mc * bc + j * bc + k + x / sheet[p][i][j][k].length + y / sheet[p][i][j][k].length / sheet[p][i][j][k][x].length) * 0.5;
              if (freqRatio[sheet[p][i][j][k][x][y]]) {
                if (sheet[p][i][j][k][x][y] === lastFreq) {
                  gain.gain.setValueAtTime(0, Math.max(time - 0.05, 0));
                }
                gain.gain.setValueAtTime(1, time);
                oscillator.frequency.setValueAtTime(aFreq * freqRatio[sheet[p][i][j][k][x][y]], time);
                lastFreq = sheet[p][i][j][k][x][y];
              }
              else if (sheet[p][i][j][k][x][y] === ".") {
                gain.gain.setValueAtTime(0, time);
                lastFreq = '';
              }
            }
          }
        }
      }
    }
  }
  oscillator.start();
  oscillator.stop(pc * lc * mc * bc * 0.5);
  const originPage = page;
  for (let i = 0; i < pc; i++) {
    setTimeout(idx => {
      page = idx;
      draw();
    }, i * lc * mc * bc * 500, i);
  }
  setTimeout(() => {
    page = originPage;
    draw();
    oscillator.disconnect();
    gain.disconnect();
    cell.disabled = false;
    for (let element of document.getElementsByTagName("input")) {
      element.disabled = false;
    }
    for (let element of document.getElementsByTagName("textarea")) {
      element.disabled = false;
    }
    for (let element of document.getElementsByTagName("select")) {
      element.disabled = false;
    }
  }, pc * lc * mc * bc * 500);
}