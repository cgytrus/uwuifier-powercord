const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');

const uwuifier = require('./uwuifier');

const Settings = require('./components/Settings.jsx');

module.exports = class Uwuify extends Plugin {
    async startPlugin() {
        powercord.api.settings.registerSettings(this.entityID, {
            category: this.entityID,
            label: uwuifier.uwuify('uwuifier'),
            render: Settings
        });

        uwuifier.settings.periodToExclamationChance = this.settings.get('periodToExclamationChance', uwuifier.settings.periodToExclamationChance);
        uwuifier.settings.stutterChance = this.settings.get('stutterChance', uwuifier.settings.stutterChance);
        uwuifier.settings.presuffixChance = this.settings.get('presuffixChance', uwuifier.settings.presuffixChance);
        uwuifier.settings.suffixChance = this.settings.get('suffixChance', uwuifier.settings.suffixChance);
        uwuifier.settings.duplicateCommasChance = this.settings.get('duplicateCommasChance', uwuifier.settings.duplicateCommasChance);

        let ignoreIn = [
            /^<#(?<id>\d{17,19})>$/gd, // channel
            /<a?:\w{2,32}:\d{17,18}>/gd, // emote
            /^<@&(?<id>\d{17,19})>$/gd, // role
            /^<@!?(?<id>\d{17,19})>$/gd, // user
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gd, // link
            /^(@everyone|@here)$/gd, // global ping
            /\`\`\`.*\`\`\`/gsd, // multi-line code
            /\`.*\`/gsd // single-line code
        ];

        function isIgnoredAt(offset, string) {
            for(let pattern of ignoreIn) {
                for(let match of string.matchAll(pattern)) {
                    for(let bounds of match.indices) {
                        if(bounds === undefined) continue;
                        if(bounds[0] <= offset && offset <= bounds[1])
                            return true;
                    }
                }
            }
            return false;
        }

        function startsWithCommand(string) {
            for(let [command] of Object.entries(powercord.api.commands.commands)) {
                if(string.startsWith(`${powercord.api.commands.prefix}${command}`))
                    return true;
            }
            return false;
        }

        let settings = this.settings;
        function uwuifyMessage(message, checkForCommand) {
            try {
                if(checkForCommand && startsWithCommand(message)) return message;
                return uwuifier.uwuify(message, true, isIgnoredAt);
            } catch(error) {
                console.error(error);
                try {
                    sendEphemeralMessage(`${uwuifier.uwuify('oh no! there was an error in uwuifier!! ;-; i\'m gonna show it to you now')}\n${error}`);
                }
                catch {
                    try {
                        sendEphemeralMessage(`ow nyow! t-thewe was an e-ewwow in uwuifiew!!\\~ ;-; i'm gwonna s-show it to uwu nyow uwu\\~\\~\n${error}`);
                    } catch(ephemeralMessageError) {
                        console.error(ephemeralMessageError);
                    }
                }
            }
            return message;
        }

        const CTAC = getModule(m => m.default?.type?.render?.displayName == 'ChannelTextAreaContainer', false).default;
        inject('uwuifier', CTAC.type, 'render', (_, res) => {
            const editor = findInReactTree(res, x => x.props?.promptToUpload && x.props.onSubmit);
            editor.props.onSubmit = (original => function(...args) {
                if(settings.get('enabled', true)) args[0] = uwuifyMessage(args[0], true);
                return original(...args);
            })(editor.props.onSubmit);
            return res;
        });
        CTAC.type.render.displayName = 'ChannelTextAreaContainer';

        powercord.api.commands.registerCommand({
            command: 'uwu',
            description: uwuifier.uwuify('Toggle uwuifying for this message.', true),
            usage: '{c} [message]',
            executor: (args) => ({
                send: true,
                result: settings.get('enabled', true) ? args.join(' ') : uwuifyMessage(args.join(' '), false)
            })
        })
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject('uwuifier');
        powercord.api.commands.unregisterCommand('uwu');
    }
};

function sendEphemeralMessage(content, username = 'Clyde', avatar = 'clyde') {
    sendEphemeralMessageInChannel(getModule(['getLastSelectedChannelId'], false).getChannelId(), content, username, avatar);
}

function sendEphemeralMessageInChannel(channelId, content, username = 'Clyde', avatar = 'clyde') {
    getModule(['sendMessage'], false).receiveMessage(channelId, {
        id: getModule(['fromTimestamp'], false).fromTimestamp(Date.now()), // generate message id
        type: 0, // MessageTypes.DEFAULT
        flags: 64, // MessageFlags.EPHEMERAL
        content: content,
        channel_id: channelId,
        author: {
            id: '1', // LOCAL_BOT_ID
            username: username,
            discriminator: '0000', // NON_USER_BOT_DISCRIMINATOR
            avatar: avatar,
            bot: true
        },
        attachments: [],
        embeds: [],
        pinned: false,
        mentions: [],
        mention_channels: [],
        mention_roles: [],
        mention_everyone: false,
        timestamp: (new Date).toISOString(),
        state: 'SENT', // MessageStates.SENT
        tts: false,
        loggingName: null
    });
}
