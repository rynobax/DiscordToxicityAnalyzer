import React, { Component } from 'react';
import {
  Step,
  Stepper,
  StepButton
} from 'material-ui/Stepper';
import BotInfo from './BotInfo/BotInfo';
import Paper from 'material-ui/Paper';
import Discord from 'discord.js';
const client = new Discord.Client();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepIndex: 0,
      completedStepIndex: 0,
      token: ''
    };
    
    this.handleNext = () => {
      const {stepIndex} = this.state;
      this.setState({
        stepIndex: stepIndex + 1,
        completedStepIndex: stepIndex
      });
    };
    
    this.handlePrev = () => {
      const {stepIndex} = this.state;
      if (stepIndex > 0) {
        this.setState({stepIndex: stepIndex - 1});
      }
    };

    this.onTokenInputChange = ((_, token) => this.setState({token}));
    
    this.getStepContent = (stepIndex) => {
      switch (stepIndex) {
        case 0:
          return <BotInfo
                    handleNext={this.handleNext}
                    client={client}
                    token={this.state.token}
                    onInputChange={this.onTokenInputChange}
                  />;
        case 1:
          return '2';
        case 2:
          return '3';
        default:
          return 'Default';
      }
    }  
  }
  render() {
    const {completedStepIndex, stepIndex} = this.state;

    return (
      <Paper style={{width: '100%', maxWidth: 700, margin: 'auto', padding: 32}}>
        <Stepper activeStep={stepIndex} linear={false}>
          <Step>
            <StepButton
              onClick={() => this.setState({stepIndex: 0})}
              disabled={completedStepIndex < 0}
            >
              Create a bot
            </StepButton>
          </Step>
          <Step>
            <StepButton
              onClick={() => this.setState({stepIndex: 1})}
              disabled={completedStepIndex < 1}
            >
              Choose a text channel
            </StepButton>
          </Step>
          <Step>
            <StepButton
              onClick={() => this.setState({stepIndex: 2})}
              disabled={completedStepIndex < 2}
            >
              Run Analysis
            </StepButton>
          </Step>
        </Stepper>
        <div style={{margin: '0 16px'}}>
          <div>
            {this.getStepContent(stepIndex)}
          </div>
        </div>
      </Paper>
    );
  }
}

export default App;
