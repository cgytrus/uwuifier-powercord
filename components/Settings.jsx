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
        console.log(setting, value)
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
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'periodToExclamationChance', Math.round(val * 100.0) / 100.0)}
                    initialValue={uwuifier.settings.periodToExclamationChance}
                    maxValue={1.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Period to exclamation chance')}
                </SliderInput>
                <SliderInput
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'stutterChance', Math.round(val * 100.0) / 100.0)}
                    initialValue={uwuifier.settings.stutterChance}
                    maxValue={1.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Stutter chance')}
                </SliderInput>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a pre-suffix (\'~\' and \'!\') appearing at the end of your message')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'presuffixChance', Math.round(val * 100.0) / 100.0)}
                    initialValue={uwuifier.settings.presuffixChance}
                    maxValue={1.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Presuffix chance')}
                </SliderInput>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a suffix ("nya~", "^^;;" etc.) appearing at the end of your message')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'suffixChance', Math.round(val * 100.0) / 100.0)}
                    initialValue={uwuifier.settings.suffixChance}
                    maxValue={1.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Suffix chance')}
                </SliderInput>
                <SliderInput
                    note={this.uwuifyIfEnabled(this.props.getSetting, 'Chance of a specific character (\',\' and \'!\') getting duplicated')}
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'duplicateCharactersChance', Math.round(val * 100.0) / 100.0)}
                    initialValue={uwuifier.settings.duplicateCharactersChance}
                    maxValue={1.0}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Duplicate characters chance')}
                </SliderInput>
                <SliderInput
                    onValueChange={val => this.settingChanged(this.props.updateSetting, 'duplicateCharactersAmount', val)}
                    initialValue={uwuifier.settings.duplicateCharactersAmount}
                    markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                    stickToMarkers={true}
                >
                    {this.uwuifyIfEnabled(this.props.getSetting, 'Duplicate characters amount')}
                </SliderInput>
            </div>
        );
    }
}