const pre = {
    "Means like": "ml",
    "Sounds like": "sl",
    "Spelled like": "sp",
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


const pro = {
    "Topics": "topics",
    "Left context": "lc",
    "Right context": "rc",
};

const mmdd = {
    "Definition": "d",
    "Part of speech": "p",
    "Syllable count": "s",
    "Pronunciation": "r",
    "Word frequency": "f",
};
const ta = document.getElementById("textarea");
const ff = document.getElementById('first');
const base = "https://api.datamuse.com/words?";
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
    md.innerHTML += "&nbsp" + m;
    md.innerHTML += "<br>";
}


document.getElementById("submit").onclick = () => {

    if (document.getElementById("t0").value.length > 0) {
        var url = base;

        for (var i = 0; i < Object.keys(selects).length; i++) {
            if (i != 0) url += "&";

            url += selects['s' + i].options[selects['s' + i].selectedIndex].value + '=' + replaceAll(texts['t' + i].value, ' ', '+');

        }

        for (ro in pro) {
            if (document.getElementById(pro[ro]).value != "")
                url += '&' + pro[ro] + '=' + replaceAll(document.getElementById(pro[ro]).value, ' ', '+');
        }
        for (m in mmdd) {
            if (document.getElementById(m).checked) anyChecked = true;
        }
        if (anyChecked) url += '&md=';
        for (m in mmdd) {
            if (document.getElementById(m).checked) url += mmdd[m];
        }
        if (max.value != 0) url += "&max=" + max.value;
        console.log(url);
        dog(url);
    }
};

async function dog(link) {
    var r;
    await fetch(link).then(r => r.json()).then(d => { r = d; })
    for (o of r) {
        var cc = 0;
        for (oo in o) { ta.innerHTML += Object.keys(o)[cc] + ': ' + o[oo] + "\n"; cc++ }
        ta.innerHTML += "\n\n";
    }

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
        ta.innerHTML = "";
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
