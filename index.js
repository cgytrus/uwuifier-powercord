const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');

const { uwuify } = require('./uwuifier');

module.exports = class Uwuify extends Plugin {
    async startPlugin() {
        let ignoreIn = [
            /^<#(?<id>\d{17,19})>$/gd, // channel
            /<a?:\w{2,32}:\d{17,18}>/gd, // emote
            /^<@&(?<id>\d{17,19})>$/gd, // role
            /^<@!?(?<id>\d{17,19})>$/gd, // user
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/gd, // link
            /^(@everyone|@here)$/gd, // global ping
            /\`\`\`.*\`\`\`/gd, // multi-line code
            /\`.*\`/gd // single-line code
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

        const CTAC = getModule(m => m.default?.type?.render?.displayName == 'ChannelTextAreaContainer', false).default;
        inject('uwuifierSend', CTAC.type, 'render', (_, res) => {
            const editor = findInReactTree(res, x => x.props?.promptToUpload && x.props.onSubmit);
            editor.props.onSubmit = (original => function(...args) {
                if(args[0].startsWith(powercord.api.commands.prefix)) return original(...args);
                args[0] = uwuify(args[0], isIgnoredAt);
                return original(...args);
            })(editor.props.onSubmit);
            return res;
        });
        CTAC.type.render.displayName = 'ChannelTextAreaContainer';

        powercord.api.commands.registerCommand({
            command: 'nouwu',
            description: uwuify('disable uwuifying for this message', () => false),
            usage: '{c} [unuwuified text to send]',
            executor: (args) => ({
                send: true,
                result: args.join(' ')
            })
        })
    }

    pluginWillUnload() {
        powercord.api.settings.unregisterSettings(this.entityID);
        uninject('uwuifierSend');
    }
};
