var cvs = document.getElementById('sheet');
var cell = document.getElementById('cell');
var sheet, mc, bc, bpl, block, margin = 10, space, fin;
function setSetting() {
    var t=-1;
    lc = Number(document.getElementById('line').value);
    mc = Number(document.getElementById('meas').value);
    bc = Number(document.getElementById('beat').value);
    block = Number(document.getElementById('block').value);
    space = Number(document.getElementById('space').value);
    fin = block/10;
    if(!sheet||sheet.length!=lc) {
        sheet = new Array(lc);
    }
    for(var i=0; i<lc; i++) {
        if(!sheet[i]||sheet[i].length!=mc) {
            sheet[i] = new Array(mc);
        }
        for(var j=0; j<mc; j++) {
            if(!sheet[i][j]||sheet[i][j].length!=bc) {
                sheet[i][j] = new Array(bc);
                for(var k=0; k<bc; k++) {
                    sheet[i][j][k] = [[]];
                }
            }
        }
    }
    selection = null;
    draw();
}
window.onload = setSetting;
function setData() {
    try {
        const _sheet = JSON.parse(document.getElementById('data').value);
        document.getElementById('line').value = _sheet.length;
        document.getElementById('meas').value = _sheet[0].length;
        document.getElementById('beat').value = _sheet[0][0].length;
        sheet = _sheet;
        setSetting();
        draw();
    } catch(err) {
        alert(err);
    }
}
var w, h;
var selection = null;
var font = "serif";
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
    '.': 'ㅿ',
    ' ': '一',
    '+': '丨',
    '-': 'ㆍ',
    '': false,
}
function draw() {
    w = cvs.width = margin * 2 + (block + space) * lc;
    h = cvs.height = margin * 2 + block * mc * bc + fin;
    var ctx = cvs.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'grey';
    if(selection) {
        ctx.fillRect(w-(selection.x+1)*(block+space)-margin, (selection.y*bc+selection.z)*block + margin, block, block);
    }
    ctx.lineWidth = 3;
    ctx.fillStyle = ctx.strokeStyle = 'black';
    ctx.strokeRect(margin, margin, w-margin*2, h-margin*2);
    ctx.beginPath();
    for(var i=0; i<lc; i++) {
        ctx.moveTo(margin+(i+1)*(block+space), margin);
        ctx.lineTo(margin+(i+1)*(block+space), h-margin);
        ctx.moveTo(margin+(i+1)*(block+space)-space, margin);
        ctx.lineTo(margin+(i+1)*(block+space)-space, h-margin);
    }
    for(var i=0; i<lc; i++) {
        for(var j=1; j<mc; j++) {
            ctx.moveTo(margin+(block+space)*i, margin+j*bc*block);
            ctx.lineTo(margin+(block+space)*i+block, margin+j*bc*block);
        }
    }
    ctx.moveTo(margin, h-margin-fin);
    ctx.lineTo(margin+block, h-margin-fin);
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.beginPath();
    for(var i=0; i<lc; i++) {
        for(var j=0; j<mc; j++) {
            for(var k=1; k<bc; k++) {
                ctx.moveTo(margin + (block + space)*i, margin+(bc*j+k)*block);
                ctx.lineTo(margin + (block + space)*i + block, margin+(bc*j+k)*block);
            }
        }
    }
    ctx.stroke();
    ctx.closePath();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for(var i=0; i<lc; i++) {
        for(var j=0; j<mc; j++) {
            for(var k=0; k<bc; k++) {
				let fntSz = Math.max(2, sheet[i][j][k].length);
				for(var l=0; l<sheet[i][j][k].length; l++) {
					fntSz = Math.max(fntSz, sheet[i][j][k][l].length);
				}
                for(var l=0; l<sheet[i][j][k].length; l++) {
					ctx.font = `${block/Math.max(2, Math.max(sheet[i][j][k].length, sheet[i][j][k][l].length))}px ${font}`;
                    for(var m=0; m<sheet[i][j][k][l].length; m++) {
                        if(notes[sheet[i][j][k][l][m]]) {
                            ctx.fillText(notes[sheet[i][j][k][l][m]], w-margin-(block+space)*(i+1)+block/2/sheet[i][j][k][l].length*(m*2+1), margin+block*(j*bc+k)+block/2/sheet[i][j][k].length*(l*2+1));
                        }
                    }
                }
            }
        }
    }
}
cvs.onclick = function(e) {
    var rawX = e.offsetX;
    var rawY = e.offsetY;
    if(rawX<margin||rawX>w-margin||rawY<margin||rawY>h-margin) {
        return;
    }
    var x = Math.floor((w-rawX-margin)/(block+space));
    if(x*(block+space)+space>w-rawX-margin) {
        selection = null;
        cell.parentElement.hidden = true;
        draw();
        return;
    }
    var y = Math.floor((rawY-margin)/bc/block);
    var z = Math.floor(((rawY-margin)-y*bc*block)/block);
    if(selection&&selection.x==x&&selection.y==y&&selection.z==z) {
        selection = null;
        cell.parentElement.hidden = true;
    }
    else {
        selection = {x: x, y: y, z: z};
        cell.value = JSON.stringify(sheet[selection.x][selection.y][selection.z]);
        cell.parentElement.hidden = false;
        cell.focus();
    }
    draw();
}
cell.onkeypress = function(e) {
    if(e.keyCode==13) {
        try {
            sheet[selection.x][selection.y][selection.z] = JSON.parse(cell.value.replaceAll("'", '"'));
        }
        catch(err) {
            alert(err);
        }
        draw();
    }
}