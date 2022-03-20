const { React } = require('powercord/webpack');
const { SliderInput, SwitchItem } = require('powercord/components/settings');

const uwuifier = require('../uwuifier');

module.exports = class Settings extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    uwuifyIfEnabled(getSetting, text) {
        return getSetting('enabled', true) ? uwuifier.uwuify(text) : text;
    }

    settingChanged(updateSetting, setting, value) {
        updateSetting(setting, value);
        uwuifier.settings[setting] = value;
    }

    render() {
        return(
            <div>
                <SwitchItem
                    onChange={() => this.props.toggleSetting('enabled', true)}
                    value={this.props.getSetting('enabled', true)}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Enabled')}
                </SwitchItem>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a period being replaced with an exclamation mark')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'periodToExclamationChance', val / 100.0)}
                    initialValue={uwuifier.settings.periodToExclamationChance * 100.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Period to exclamation chance')}
                </SliderInput>
                <SliderInput
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'stutterChance', val / 100.0)}
                    initialValue={uwuifier.settings.stutterChance * 100.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Stutter chance')}
                </SliderInput>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a tilde (~) appearing at the end of your message')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'presuffixChance', val / 100.0)}
                    initialValue={uwuifier.settings.presuffixChance * 100.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Presuffix chance')}
                </SliderInput>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a suffix ("nya~", "^^;;" etc.) appearing at the end of your message')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'suffixChance', val / 100.0)}
                    initialValue={uwuifier.settings.suffixChance * 100.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Suffix chance')}
                </SliderInput>
            </div>
        );
    }
}