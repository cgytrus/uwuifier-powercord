let settings = {
    periodToExclamationChance: 0.2,
    stutterChance: 0.1,
    presuffixChance: 0.1,
    suffixChance: 0.3,
    duplicateCharactersChance: 0.4,
    duplicateCharactersAmount: 3
};

function getChance(chance) { return Math.random() < chance; }

function escapeString(string) { return string.replaceAll(/(?=[~_<>])/g, '\\'); }

function isCaps(string) { return string == string.toUpperCase(); }

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
    [ /(?<!w)ue/g, 'we' ],
    [ 'attempt', 'attwempt' ],
    [ 'config', 'cwonfig' ]
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
    '~~',
    ','
];

let suffixes = [
    ':D',
    [
        'xD',
        'XD',
    ],
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
    [
        'nya',
        'nya~',
        'nya~~',
        'nyaa',
        'nyaa~',
        'nyaa~~'
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
    ],
    ','
];

function chooseSuffixVariation(list) {
    let option = list[Math.floor(Math.random() * list.length)];
    if(Array.isArray(option)) return chooseSuffixVariation(option);
    return option;
}

let replacements = [
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
    // duplicate characters
    [
        /[,!]/g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            if(getChance(settings.duplicateCharactersChance)) {
                let amount = Math.floor((Math.random() + 1) * (settings.duplicateCharactersAmount - 1));
                let newMatch = match;
                for(let i = 0; i < amount; i++)
                    newMatch += match;
                match = newMatch;
            }
            return match;
        }
    ],
    // simple and word replacements
    [
        // match a word
        /(?<=\b)[a-zA-Z\']+(?=\b)/g, (_escape, isIgnoredAt) => function(match, offset, string) {
            if(isIgnoredAt(offset, string)) return match;
            let caps = isCaps(match);
            match = match.toLowerCase();
            if(match in wordReplacements) // only replace whole words
                match = wordReplacements[match];
            for(const [ pattern, replacement ] of simpleReplacements) {
                // don't replace whole words
                if((pattern instanceof RegExp) && match.match(pattern)?.includes(match) || pattern == match)
                    continue;
                match = match.replaceAll(pattern, replacement);
            }
            return caps ? match.toUpperCase() : match;
        }
    ],
    // stutter
    [
        // match beginning of a word
        /(?<= |^)[a-zA-Z]/g, (_escape, isIgnoredAt) => function(match, offset, string) {
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

        for(const [ pattern, replacement ] of replacements)
            string = string.replaceAll(pattern, replacement(escape, isIgnoredAt));
        return string;
    }
}
