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
    sheet = new Array(lc);
    for(var i=0; i<lc; i++) {
        sheet[i] = new Array(mc);
        for(var j=0; j<mc; j++) {
            sheet[i][j] = new Array(bc);
            for(var k=0; k<bc; k++) {
                sheet[i][j][k] = [[]];
            }
        }
    }
    selection = null;
    draw();
}
window.onload = function() {
    setSetting();
}
var w, h;
var selection = null;
var font = "KaiTi";
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
    '.': '△',
    ' ': '一',
    '': false
}
function draw() {
    w = cvs.width = margin * 2 + block * lc + space * (lc - 1);
    h = cvs.height = margin * 2 + block * mc * bc + fin;
    var ctx = cvs.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'grey';
    if(selection) {
        ctx.fillRect(w-selection.x*(block+space)-block-margin, (selection.y*bc+selection.z)*block + margin, block, block);
    }
    ctx.lineWidth = 3;
    ctx.fillStyle = ctx.strokeStyle = 'black';
    ctx.strokeRect(margin, margin, w-margin*2, h-margin*2);
    ctx.beginPath();
    for(var i=1; i<lc; i++) {
        ctx.moveTo(margin+i*block+(i-1)*space, margin);
        ctx.lineTo(margin+i*block+(i-1)*space, h-margin);
        ctx.moveTo(margin+i*block+i*space, margin);
        ctx.lineTo(margin+i*block+i*space, h-margin);
    }
    for(var i=0; i<lc; i++) {
        for(var j=1; j<mc; j++) {
            ctx.moveTo(margin+block*i+space*i, margin+j*bc*block);
            ctx.lineTo(margin+block*(i+1)+space*i, margin+j*bc*block);
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
                ctx.moveTo(margin + block*i + space*i, margin+(bc*j+k)*block);
                ctx.lineTo(margin + block*(i+1) + space*i, margin+(bc*j+k)*block);
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
                ctx.font = `${block/Math.max(2, sheet[i][j][k].length)}px ${font}`;
                for(var l=0; l<sheet[i][j][k].length; l++) {
                    for(var m=0; m<sheet[i][j][k][l].length; m++) {
                        if(notes[sheet[i][j][k][l][m]]) {
                            ctx.fillText(notes[sheet[i][j][k][l][m]], w-margin-(block+space)*i-block+block/2/sheet[i][j][k][l].length*(m*2+1), margin+block*(j*bc+k)+block/2/sheet[i][j][k].length*(l*2+1));
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
    if(x*(block+space)+block<w-rawX-margin) {
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
    }
    draw();
}
cell.onkeypress = function(e) {
    if(e.keyCode==13) {
        try {
            sheet[selection.x][selection.y][selection.z] = JSON.parse(cell.value.replaceAll("'", '"'));
        }
        catch(e) {
            alert(e);
        }
        draw();
    }
}