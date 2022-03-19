let periodToExclamationChance = 0.2;
let stutterChance = 0.1;
let presuffixChance = 0.1;
let suffixChance = 0.2;

function getChance(chance) { return Math.random() < chance; }

let simpleReplacements = {
    "l": "w",
    "r": "w",
    "na": "nya",
    "ne": "nye",
    "ni": "nyi",
    "no": "nyo",
    "nu": "nyu",
    "te": "twe",
    "da": "dwa",
    "ke": "kwe",
    "qe": "qwe",
    "je": "jwe",
    "si": "swi",
    "so": "swo",
    "mi": "mwi",
    "co": "cwo",
    "mo": "mwo",
    "ba": "bwa",
    "pow": "paw",
    "ui": "wi"
}

let wordReplacements = {
    "you": "uwu",
    "no": "nu",
    "oh": "ow",
    "too": "two"
};

let presuffixes = [
    "\\~"
];

let suffixes = [
    ":D",
    "xD",
    ":P",
    ";3",
    "<{^v^}>",
    "^-^",
    "x3",
    "x3",
    "rawr",
    "rawr x3",
    "owo",
    "uwu",
    "-.-",
    "\\>w\\<",
    ":3",
    "XD",
    "nya",
    "nya\\~",
    "nyaa\\~\\~",
    "\\>\\_\\<",
    ":flushed:",
    "^^",
    "^^;;"
];

let replacements = [
    // lowercase
    {
        pattern: /./g,
        replacement: (isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            return match.toLowerCase();
        }
    },
    // . to !
    {
        pattern: /\.(?= |$)/g, // match a . with a space or string end after it
        replacement: (isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(!getChance(periodToExclamationChance))
                return match;
            return "!";
        }
    },
    // simple and word replacements
    {
        pattern: /(?<=\b)[a-z\']+(?=\b)/g, // match a word
        replacement: (isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(match in wordReplacements) // only replace whole words
                match = wordReplacements[match];
            if(!(match in simpleReplacements)) { // don't replace whole words
                for(const [key, val] of Object.entries(simpleReplacements)) {
                    match = match.replaceAll(key, val);
                }
            }
            return match;
        }
    },
    // stutter
    {
        pattern: /(?<= |^)[a-z]/g, // match beginning of a word
        replacement: (isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(!getChance(stutterChance))
                return match;
            return `${match}-${match}`;
        }
    },
    // suffixes
    {
        pattern: /(?<=\.|\!|\?|\,|\;|\-)(?= )|(?=$)/g,
        replacement: (isIgnoredAt) => function(_match, offset, string) {
            if(isIgnoredAt(offset, string)) return "";
            let presuffix = "";
            let suffix = "";
            if(getChance(presuffixChance))
                presuffix = presuffixes[Math.floor(Math.random() * presuffixes.length)];
            if(getChance(suffixChance))
                suffix = ` ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
            return `${presuffix}${suffix}`;
        }
    }
];

module.exports = {
    uwuify: function(string, isIgnoredAt) {
        if(string == null || !/\S/.test(string)) return string;

        newString = string;
        for(let replacement of replacements) {
            newString = newString.replaceAll(replacement.pattern, replacement.replacement(isIgnoredAt));
        }
        return newString;
    }
}
