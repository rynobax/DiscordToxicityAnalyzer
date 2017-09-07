import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import { getMessages } from './discordHelper';
import { getPerceptionScores } from './perceptionHelper';
import Data from './Data';

class Analyze extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discordProgress: 0,
      toxicityProgress: 0,
      messagesToUse: 5,
      viewState: 0, // 0 settings, 1 getting, 2 display
      results: []
    }

    this.onMessagesToUseChange = (_, value) => {
      this.setState({messagesToUse: Number(value.replace(/[^\d]/, ''))})
    }
    this.updateDiscordProgress = (x) => {this.setState({discordProgress: x / this.state.messagesToUse})};

    this.getData = () => {
      this.setState({viewState: 1});
      const { updateDiscordProgress } = this;
      const { channel } = this.props;
      const { messagesToUse } = this.state;
      getMessages(channel, messagesToUse, updateDiscordProgress).then(async (messages) => {
        const results = [];
        let toxicityCount = 0;
        for(const msg of messages) {
          if(msg) {
            const scores = await getPerceptionScores(msg.content, []);
            if(scores !== undefined) results.push(Object.assign(msg, {scores}));
          }
          toxicityCount++;
          this.setState({
            toxicityProgress: toxicityCount / messages.length
          });
        }
        this.setState({viewState: 2, results});
      }).catch(console.error);
    }
  }
  
  render() {
    const {onMessagesToUseChange, getData} = this;
    const {messagesToUse, viewState, results} = this.state;
    const settingsView = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <TextField
          floatingLabelText="Messages To Use"
          value={messagesToUse}
          onChange={onMessagesToUseChange}
        />
        <br/>
        <RaisedButton
          label="Continue"
          primary
          onClick={getData}
        />
      </div>
    );
    const gettingView = (
      <div style={{textAlign: 'center'}}>
        <div>
          <h3 style={{margin: 5}}>Getting Messages from Discord:</h3>
          <LinearProgress
            mode="determinate"
            value={this.state.discordProgress}
            max={1}
            style={{height: 10}}
          />
        </div>
        <br/>
        <div>
          <h3 style={{margin: 5}}>Getting Scores from Google:</h3>
          <LinearProgress
            mode="determinate"
            value={this.state.toxicityProgress}
            max={1}
            style={{height: 10}}
          />
        </div>
      </div>
    );
    switch (viewState) {
      case 0:
        return settingsView;
      case 1:
        return gettingView;
      case 2:
        return <Data results={results}/>;
      default:
        return <h1>Invalid viewState {viewState}</h1>;
    }
  }
}

export default Analyze;
