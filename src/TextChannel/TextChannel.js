import React, { Component } from 'react';
import Discord from 'discord.js';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class TextChannel extends Component {
  constructor(props){
    super(props);
    this.channels = props.client.channels.array().filter(e => e.constructor === Discord.TextChannel);
  };

  render() {
    const { channels } = this;
    const { onChannelInputChange, channelValue, handleNext } = this.props;
    return (
      <div>
        <p>
          The channel you want not appearing?  Add the bot to the server using this link: 
          https://discordapp.com/oauth2/authorize?client_id=CLIENT_ID_GOES_HERE&scope=bot&permissions=65536
        </p>
        <div style={{
          margin: 'auto',
          width: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <SelectField
            floatingLabelText="Text Channel"
            value={channelValue}
            onChange={onChannelInputChange}
          >
            {channels.map(({id, name}) => {
              return <MenuItem value={id} primaryText={name} key={id} />
            })}
          </SelectField>
          <RaisedButton
            label="Continue"
            primary
            style={{marginLeft: 10}}
            onClick={handleNext}
            disabled={!channelValue}
          />
        </div>
      </div>
    )
  }
}

export default TextChannel;
