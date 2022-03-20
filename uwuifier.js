let settings = {
    periodToExclamationChance: 0.2,
    stutterChance: 0.1,
    presuffixChance: 0.1,
    suffixChance: 0.2
};

function getChance(chance) { return Math.random() < chance; }

function escapeString(string) { return string.replaceAll(/(?=[~_<>])/g, '\\'); }

let simpleReplacements = [
    [ 'l', 'w' ],
    [ 'r', 'w' ],
    [ 'na', 'nya' ],
    [ 'ne', 'nye' ],
    [ 'ni', 'nyi' ],
    [ 'no', 'nyo' ],
    [ 'nu', 'nyu' ],
    [ 'pow', 'paw' ],
    [ /(?<!w)ui/g, 'wi' ],
    [ /(?<!w)ue/g, 'we' ]
];

let wordReplacements = {
    'you': 'uwu',
    'no': 'nu',
    'oh': 'ow',
    'too': 'two',
    'attempt': 'attwempt',
    'config': 'cwonfig'
};

let presuffixes = [
    '~',
    '~~'
];

let suffixes = [
    ':D',
    'xD',
    ':P',
    ';3',
    '<{^v^}>',
    '^-^',
    'x3',
    [
        'rawr',
        'rawr~',
        'rawr~~',
        'rawr x3',
        'rawr~ x3',
        'rawr~~ x3'
    ],
    [
        'owo',
        'owo~',
        'owo~~'
    ],
    [
        'uwu',
        'uwu~',
        'uwu~~'
    ],
    '-.-',
    '>w<',
    ':3',
    'XD',
    [
        [
            'nya',
            'nya~',
            'nya~~'
        ],
        [
            'nyaa',
            'nyaa~',
            'nyaa~~'
        ]
    ],
    [
        '>_<',
        '>-<'
    ],
    ':flushed:',
    '👉👈',
    [
        '^^',
        '^^;;'
    ],
    [
        'w',
        'ww'
    ]
];

function chooseSuffixVariation(list) {
    let option = list[Math.floor(Math.random() * list.length)];
    if(Array.isArray(option)) return chooseSuffixVariation(option);
    return option;
}

let replacements = [
    // lowercase
    [
        /./g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            return match.toLowerCase();
        }
    ],
    // . to !
    [
        // match a . with a space or string end after it
        /\.(?= |$)/g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(!getChance(settings.periodToExclamationChance))
                return match;
            return '!';
        }
    ],
    // simple and word replacements
    [
        // match a word
        /(?<=\b)[a-z\']+(?=\b)/g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(match in wordReplacements) // only replace whole words
                match = wordReplacements[match];
            for(const [ pattern, replacement ] of simpleReplacements) {
                // don't replace whole words
                if((pattern instanceof RegExp) && match.match(pattern)?.includes(match) || pattern == match) continue;
                match = match.replaceAll(pattern, replacement);
            }
            return match;
        }
    ],
    // stutter
    [
        // match beginning of a word
        /(?<= |^)[a-z]/g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(!getChance(settings.stutterChance))
                return match;
            return `${match}-${match}`;
        }
    ],
    // suffixes
    [
        /(?<=[\.\!\?\,\;\-])(?= )|(?=$)/g, (escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            let presuffix = '';
            let suffix = '';
            if(getChance(settings.presuffixChance))
                presuffix = chooseSuffixVariation(presuffixes);
            if(getChance(settings.suffixChance))
                suffix = ` ${chooseSuffixVariation(suffixes)}`;
            let finalSuffix = `${presuffix}${suffix}`;
            if(escape) finalSuffix = escapeString(finalSuffix);
            return finalSuffix;
        }
    ]
];

module.exports = {
    settings: settings,
    uwuify: function(string, escape = false, isIgnoredAt = () => false) {
        if(string == null || !/\S/.test(string)) return string;

        newString = string;
        for(const [ pattern, replacement ] of replacements) {
            newString = newString.replaceAll(pattern, replacement(escape, isIgnoredAt));
        }
        return newString;
    }
}
