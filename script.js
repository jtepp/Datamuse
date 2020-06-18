class Definition {
    constructor(parts, deff) {
        this.parts = parts;
        this.deff = deff;
    }
}
count = 0;
class Curd {
    constructor(word, score, p, d, s, f, r) {
        this.word = word;
        this.score = score;
        this.p = p;
        this.d = d;
        this.s = s;
        this.f = f;
        this.r = r;
    }

}
let root = document.documentElement.style;
var curds = {};
var currFilt = "All";
const filter = document.getElementById('filter');
availParts = [];
party = {
    'n': 'Noun',
    'adj': 'Adjective',
    'a': 'Adjective',
    'adv': 'Adverb',
    'v': 'Verb',
    'pro': 'Pronoun',
    'pron': 'Pronoun',
    'pre': 'Preposition',
    'prep': 'Preposition',
    'in': 'Interjection',
    'int': 'Interjection',
    'con': 'Conjunction',
    'conj': 'Conjunction'
}
const pre = {
    "Means like": "ml",
    "Sounds like": "sl",
    "Spelled like": "sp",
    "Starts with": "st",
    "Ends with": "en",
    "Modified nouns": "rel_jja",
    "Modifying adjectives": "rel_jjb",
    "Synonyms": "rel_syn",
    "Associated words": "rel_trg",
    "Antonyms": "rel_ant",
    "Type of": "rel_spc",
    "General type": "rel_gen",
    "Part of": "rel_com",
    "Frequent follower": "rel_bga",
    "Frequent predecessor": "rel_bgb",
    "Perfect rhyme": "rel_rhy",
    "Near rhyme": "rel_nry",
    "Homophone": "rel_hom",
    "Consonant match": "rel_cns",
};
var starter = '';
var ender = '';
const pro = {
    "Topics": "topics",
    "Left context": "lc",
    "Right context": "rc",
};

document.getElementById("dork").addEventListener('click', (e) => {
    switch (count % 2) {
        case 0:
            root.setProperty('--f', '70%');
            break;
        case 1:
            root.setProperty('--f', '140%');
            break;
    }
    document.getElementById("dork").src = count % 2 + '.png'
    // console.log(root.getPropertyValue('--inv'));

    count++;
})

const mmdd = {
    "Pronunciation": "r",
    // "Part of speech": "p",
    "Syllable count": "s",
    "Definitions": "d",
    // "Word frequency": "f",
};
const cont = document.getElementsByClassName('container')[0];
const ff = document.getElementById('first');
const base = "http://api.datamuse.com/words?";
var bonus = '';
var terms = 1;
var anyChecked = false;
var texts = { "t0": document.getElementById("t0") }
var selects = { "s0": document.getElementById("s0") }
var termStuff = '';
const md = document.getElementById("md");
var ke;
var va;
const max = document.getElementById('max');

for (w in pre) {
    const o = document.createElement("OPTION");
    o.setAttribute("value", pre[w]);
    o.innerHTML = w;

    selects['s0'].appendChild(o);
}


for (m in mmdd) {
    const b = document.createElement("input");
    b.setAttribute('type', 'checkbox');
    b.setAttribute('id', m);
    b.setAttribute("value", m);
    md.appendChild(b);
    const l = document.createElement('label');
    l.setAttribute('for', m);
    l.innerHTML = m;
    md.appendChild(l);
    md.appendChild(document.createElement('br'));
}


document.getElementById("submit").onclick = () => {
    currFilt = "All";
    document.getElementById('seive').setAttribute('style', 'opacity: 1;');
    cont.innerHTML = "";
    starter = '';
    ender = '';
    // document.getElementById('seive').setAttribute('style', 'opacity: 0;');
    if (document.getElementById("t0").value.length > 0) {
        var url = base;

        for (var i = 0; i < Object.keys(selects).length; i++) {
            const temp = selects['s' + i].options[selects['s' + i].selectedIndex].value;
            if (temp != 'en' && temp != 'st' && texts['t' + i].value != '') {
                if (i != 0) url += "&";
                url += temp + '=' + replaceAll(texts['t' + i].value, ' ', '+');
            }
            else if (temp == 'st') { starter += replaceAll(texts['t' + i].value, ' ', '+'); }
            else if (temp == 'en') { ender += replaceAll(texts['t' + i].value, ' ', '+'); }

        }
        if (starter || ender) url += `&sp=${starter}*${ender}`;
        for (ro in pro) {
            if (document.getElementById(pro[ro]).value != "")
                url += '&' + pro[ro] + '=' + replaceAll(document.getElementById(pro[ro]).value, ' ', '+');
        }
        for (m in mmdd) {
            if (document.getElementById(m).checked && m != 'Pronunciation') anyChecked = true;
        }
        url += '&md=pds';
        url += 'fr&ipa=1'
        if (max.value != 0) url += "&max=" + max.value;
        console.log(url);
        dog(url);
    } else {
        // console.log(false);
        document.getElementById('seive').setAttribute('style', 'opacity: 0;');
        cont.innerHTML = "<div style='position: fixed; top: 100px; right:20vw;'>Please provide a search term</div>"
        // document.creat
    }

};

async function dog(link) {


    curds = {};
    availParts = [];
    var filterPass = false;
    var r;
    var part = {};
    var pron = {};
    var fre = {};
    var syls = {};
    var defs = {};
    await fetch(link).then(r => r.json()).then(d => { r = d; })

    for (o of r) {
        const ww = o['word'];
        if (o['defs'] == undefined || o['defs'] == null || o['defs'] == '' || o['defs'].length < 1) o['defs'] = ["n/a	[No definition available]"];
        const tempArray = o['defs'].toString().split(',');
        defs[o] = new Definition([], []);

        for (a of tempArray) {
            if (a.split('	')[0][0] != ' ' && a.split('	')[0][0] != null && a.split('	')[0][0] != '' && a.split('	')[0][0] != 'undefined' && a.split('	')[0][0] != undefined) {
                defs[o].parts.push(party[a.split('	')[0][0]]);
                defs[o].deff.push(a.split('	')[1]);
                if (!availParts.includes(party[a.split('	')[0][0]])) availParts.push(party[a.split('	')[0][0]]);
            }

        }

        pron[o] = o['tags'].slice(0, o['tags'].indexOf('pron:')).pop().split(':')[1];
        var ugh = o['tags'].slice(0, o['tags'].indexOf('pron:'));
        ugh.pop();
        ugh.pop();
        part[o] = ugh;
        fre[o] = o['tags'][o['tags'].length - 1].split(':')[1];
        syls[o] = o['numSyllables'];
        // console.log(o['tags']);
        // console.log(part[o]);
        curds[ww] = new Curd(o['word'], o['score'], defs[o].parts, defs[o].deff, syls[o], fre[o], pron[o]);


        // var cc = 0;
        const cd = document.createElement('div');
        cd.setAttribute('class', 'card');
        cd.setAttribute('id', curds[ww].score);
        cd.setAttribute('onmousedown', 'copy("' + capitalize(curds[ww].word) + '")');
        const h = document.createElement('h1');
        h.setAttribute('id', capitalize(curds[ww].word))
        h.innerHTML = capitalize(curds[ww].word);

        const sup = document.createElement('sup');
        sup.innerHTML = 'Accuracy: ' + curds[ww].score;
        h.appendChild(sup);

        const har = document.createElement('hr');
        har.setAttribute('class', 'har');

        const p = document.createElement('p');
        // delete o['word'];
        // delete o['score'];
        // delete o['tags'];
        // delete o['numSyllables'];
        // delete o['numSyllables'];
        // for (oo in o) { p.innerHTML += Object.keys(o)[cc] + ': ' + o[oo] + "<br>"; cc++; }
        if (document.getElementById('Pronunciation').checked) p.innerHTML += '<b>Pronunciation:</b><br> ' + curds[ww].r + '<br>';
        if (document.getElementById('Syllable count').checked) p.innerHTML += '<b>Syllable count:</b> ' + curds[ww].s + '<br>';
        if (document.getElementById('Definitions').checked && o['defs'] != "n/a	[No definition available]") {
            p.innerHTML += '<b>Definitions:</b><br>';
            for (let i = 0; i < curds[ww].d.length; i++) {
                p.innerHTML += `[${curds[ww].p[i]}] ${capitalize(curds[ww].d[i])}. <br><br>`;
            }
            p.innerHTML += '<br>';
        }

        const sub = document.createElement('sub');
        sub.innerHTML = 'Frequency: ' + curds[ww].f;
        // console.log(p.innerHTML);
        cd.appendChild(h);
        if (p.innerHTML.length > 0) cd.appendChild(har);
        cd.appendChild(p);
        cd.appendChild(sub);

        if (currFilt == "All") filterPass = true;
        else if (Object.values(party).includes(currFilt) && curds[ww].p.includes(currFilt)) {
            filterPass = true;
        }
        else filterPass = false;
        if (filterPass) { cont.appendChild(cd); }



        // for (oo in o) { ta.innerHTML += Object.keys(o)[cc] + ': ' + o[oo] + "\n"; cc++ }
        // ta.innerHTML += "\n\n";
    }
    if (!availParts.includes("All")) availParts.push("All");

    if (availParts.length < 2 || cont.innerHTML == "") { document.getElementById('seive').setAttribute('style', 'opacity: 0;'); cont.innerHTML = "<div style='position: fixed; top: 100px; right:20vw;'>No Results :(</div>" }
    filter.innerHTML = '';
    for (pp of availParts) {
        const l = document.createElement('label');
        l.setAttribute('for', pp);
        l.innerHTML = pp;
        const r = document.createElement('input');
        r.setAttribute('type', 'radio');
        r.setAttribute('name', 'filth');
        r.setAttribute('id', pp)
        r.setAttribute('value', pp);
        r.setAttribute('checked', 'true');
        r.setAttribute('onclick', 'fille("' + pp + '")')
        filter.appendChild(r);
        filter.appendChild(l);
    }




}
function fille(input) {
    currFilt = input;

    cont.innerHTML = "";
    for (ww in curds) {
        const cd = document.createElement('div');
        cd.setAttribute('class', 'card');
        cd.setAttribute('id', curds[ww].score);
        cd.setAttribute('onmousedown', 'copy("' + capitalize(curds[ww].word) + '", ' + curds[ww].score + ')');
        const h = document.createElement('h1');
        h.setAttribute('id', capitalize(curds[ww].word))
        h.innerHTML = capitalize(curds[ww].word);

        const sup = document.createElement('sup');
        sup.innerHTML = 'Accuracy: ' + curds[ww].score;
        h.appendChild(sup);

        const har = document.createElement('hr');
        har.setAttribute('class', 'har');

        const p = document.createElement('p');
        // delete o['word'];
        // delete o['score'];
        // delete o['tags'];
        // delete o['numSyllables'];
        // delete o['numSyllables'];
        // for (oo in o) { p.innerHTML += Object.keys(o)[cc] + ': ' + o[oo] + "<br>"; cc++; }
        if (document.getElementById('Pronunciation').checked) p.innerHTML += '<b>Pronunciation:</b> ' + curds[ww].r + '<br>';
        if (document.getElementById('Syllable count').checked) p.innerHTML += '<b>Syllable count:</b> ' + curds[ww].s + '<br>';
        if (document.getElementById('Definitions').checked && o['defs'] != "n/a	[No definition available]") {
            p.innerHTML += '<b>Definitions:</b><br>';
            for (let i = 0; i < curds[ww].d.length; i++) {
                p.innerHTML += `[${curds[ww].p[i]}] ${capitalize(curds[ww].d[i])}. <br><br>`;
            }
            p.innerHTML += '<br>';
        }

        const sub = document.createElement('sub');
        sub.innerHTML = 'Frequency: ' + curds[ww].f;
        // console.log(p.innerHTML);
        cd.appendChild(h);
        if (p.innerHTML.length > 0) cd.appendChild(har);
        cd.appendChild(p);
        cd.appendChild(sub);

        if (currFilt == "All") filterPass = true;
        else if (Object.values(party).includes(currFilt) && curds[ww].p.includes(currFilt)) {
            filterPass = true;
        }
        else filterPass = false;
        if (filterPass) { cont.appendChild(cd); }
    }


}
function copy(id) {
    const clip = document.getElementById('clip');
    const dd = document.getElementById(id);
    document.getElementById('clip').style.opacity = 1;
    dd.style.background = "green";
    const el = document.createElement('textarea');
    el.value = document.getElementById(id).innerHTML.split('<')[0];
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setTimeout(function () {

        document.getElementById('clip').style.opacity = 0;
        dd.style.background = "none";
    }, 800);


}


function add() {

    ff.appendChild(document.createElement("br"));
    const s = document.createElement("select");
    s.setAttribute('id', 's' + terms);
    ff.appendChild(s);
    const t = document.createElement('input')
    t.setAttribute('type', 'text');
    t.setAttribute('id', 't' + terms);
    ff.appendChild(t);
    const b = document.createElement("input");
    b.setAttribute('type', 'button');
    b.setAttribute('id', 'b' + terms);
    b.setAttribute('value', '+');
    b.setAttribute('onclick', 'add()');
    ff.appendChild(b);



    document.getElementById('b' + (terms - 1)).hidden = true;
    texts['t' + terms] = document.getElementById('t' + terms);
    selects['s' + terms] = document.getElementById('s' + terms);
    for (w in pre) {
        const o = document.createElement("OPTION");
        o.setAttribute("value", pre[w]);
        o.innerHTML = w;

        selects['s' + terms].appendChild(o);
    }



    terms++;
}

document.body.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();

        document.getElementById("submit").click();
    }
});

function replaceAll(tat, s, r) {
    var sss = "";
    for (c of tat) {
        if (c == s) sss += r;
        else sss += c;
    }
    return sss.trim();
};

function capitalize(s) {
    if (typeof s !== 'string') return ''
    return (s.charAt(0).toUpperCase() + s.slice(1)).trim()
}