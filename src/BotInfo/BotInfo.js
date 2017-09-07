import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

class BotInfo extends Component {
  constructor(props){
    super(props);
    this.state = {
      error: '',
      testing: false
    };

    const { client, handleNext } = props;
    const handleError = ({message}) => { this.setState({error: message}) };
    this.testToken = () => {
      const { token } = this.props;
      if(!token) return;
      this.setState({error: '', testing: true});
      client.login(token)
        .then(() => {
          handleNext();
        })
        .catch(handleError);
    }
  }

  render() {
    const { testToken } = this;
    const { error, testing } = this.state;
    const { onInputChange, token } = this.props;
    return (
      <div>
        <p>
          Create a bot account <a href='https://discordapp.com/developers/applications/me'>here</a>.<br/>
          Make it a "Bot User".<br/>
          Enter the bot's token below:<br/>
        </p>
        <div style={{display: 'table', margin: 'auto', width: 'auto'}}>
          <TextField
            hintText='Discord Bot Token'
            onChange={onInputChange}
            value={token}
          />
          <RaisedButton
            label="Continue"
            primary
            style={{marginLeft: 10}}
            onClick={testToken}
            disabled={!token}
          />
          <br/>
          <CircularProgress
            size={60}
            thickness={7}
            style={{display: testing ? 'block' : 'none', margin: 'auto'}}
          />
          <span style={{color: 'red'}}>{error}</span>
        </div>
      </div>
    );
  }
}

export default BotInfo;
