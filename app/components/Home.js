// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router';
import { connect } from 'react-redux';

import AudioDetection from './AudioDetection.js';

import styles from './Home.css';
import logoImage from '../../resources/logo.png';

import {
  setCount,
  setMsFirst,
  setMsPrevious,
  setTapBpm,
  setDetectedBpm,
  clearState,
} from '../actions/bpmActions';

@connect(store => ({
  count: store.bpmReducer.count,
  msFirst: store.bpmReducer.msFirst,
  msPrevious: store.bpmReducer.msPrevious,
  tapBpm: store.bpmReducer.tapBpm,
  detectedBpm: store.bpmReducer.detectedBpm,
}))
export default class Home extends Component {
  static propTypes = {
    count: React.PropTypes.number,
    msFirst: React.PropTypes.number,
    msPrevious: React.PropTypes.number,
    tapBpm: React.PropTypes.number,
    detectedBpm: React.PropTypes.number,
    dispatch: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      activeKeyCode: 13,
      waitTime: 1000,
    };
  }
  componentDidMount() {
    document.body.addEventListener('keyup', e => {
      this.handleKeyPress(e);
    });
  }
  handleTap(keyCode) {
    this.setState({ activeKeyCode: parseInt(keyCode, 10) });
  }
  handleWaitChange(time) {
    this.setState({ waitTime: time });
  }
  clearState() {
    this.props.dispatch(clearState());
  }
  handleKeyPress(e) {
    const currentMs = (new Date()).getTime();
    let bpmAverage = 0;

    if (e.which !== this.state.activeKeyCode) {
      return;
    }

    // clearTimeout(this.timer);

    if ((currentMs - this.props.msPrevious) > this.state.waitTime) {
      this.clearState();
    }

    if (this.props.count === 0) {
      this.props.dispatch(setMsFirst(currentMs));
      this.props.dispatch(setCount(1));
    } else {
      bpmAverage = Number((60000 * this.props.count) / (currentMs - this.props.msFirst)).toFixed(2);
      this.props.dispatch(setCount(this.props.count + 1));
      this.props.dispatch(setTapBpm(bpmAverage));
    }

    this.props.dispatch(setMsPrevious(currentMs));
    // this.timer = setTimeout(() => this.clearState(), this.state.waitTime * 5);
  }
  render() {
    const { activeKeyCode, waitTime } = this.state;
    const { count, tapBpm, detectedBpm } = this.props;

    const bpmHasDemical = tapBpm && tapBpm.toString().indexOf('.') > -1;
    const tapBpmValues = bpmHasDemical ? tapBpm.toString().split('.') : [tapBpm];

    const tapBpmElement = tapBpmValues.length > 1
      ? <span><strong>{tapBpmValues[0]}</strong>.<small>{tapBpmValues[1]}</small></span>
      : <span><strong>{tapBpmValues[0]}</strong></span>;

    let detectedBpmValue = <small>No file BPM detected</small>;

    if (detectedBpm) {
      detectedBpmValue = <span>{detectedBpm}</span>;
    }

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <img className={styles.logo} src={logoImage} alt="BeatPM" />
          </div>
          <div className={styles.content}>
            <div className={styles.bpmContainer}>
              <hr />
              <div className="row inset-shadow">
                <div className="text-right pad-v pad-h"><em>Tap Bpm</em>:</div>
                <div className="text-left pad-v pad-h light-border-left">{tapBpmElement}</div>
              </div>
              <hr />
              <div className="row inset-shadow">
                <div className="text-right pad-v pad-h"><em>Detected Bpm</em>:</div>
                <div className="text-left pad-v pad-h light-border-left">{detectedBpmValue}</div>
              </div>
              <hr />
            </div>
            <div className="row pad-v">
              <WaitSelector
                handler={this.handleWaitChange.bind(this)}
                waitTime={waitTime}
              />
              <KeycodeSelector
                handler={this.handleTap.bind(this)}
                activeKeyCode={activeKeyCode}
              />
            </div>
            <hr />
            <div className="pad-v-half">
              {count} taps
            </div>
            <hr />
            <AudioDetection />
          </div>
        </div>
      </div>
    );
  }
}

function WaitSelector({ handler, waitTime }) {
  function handleChange(e) {
    handler(e.target.value * 1000);
  }
  const waitOptions = [1, 2, 3, 4, 5];
  return (
    <div className="pad-h">
      <strong className="margin-r-5">Tap Reset</strong>
      <select onChange={handleChange}>
        {waitOptions.map(w => (
          <option
            key={`wait-options_${w}`}
            value={w}
            selected={w * 1000 === waitTime ? true : null}
          >
            {w} Seconds
          </option>
        ))}
      </select>
    </div>
  );
}

WaitSelector.propTypes = {
  handler: React.PropTypes.func,
  waitTime: React.PropTypes.number,
};

function KeycodeSelector({ handler, activeKeyCode }) {
  function handleChange(e) {
    handler(e.target.value);
  }
  const knownKeyCodes = { Enter: 13, Shift: 16, Control: 17, Alt: 18, Space: 32 };
  const letterKeyCodes = [];
  for (let i = 65, max = 90; i <= max; i += 1) {
    letterKeyCodes.push(i);
  }
  return (
    <div className="pad-h">
      <strong className="margin-r-5">Key Press</strong>
      <select onChange={handleChange}>
        {Object.keys(knownKeyCodes).map(k => (
          <option key={`known-key_${k}`} value={knownKeyCodes[k]} selected={activeKeyCode === k ? true : null}>
            {k}
          </option>
        ))}
        <option>---</option>
        {letterKeyCodes.map(k => (
          <option key={`letter-key_${k}`} value={k} selected={activeKeyCode === k ? true : null}>
            {String.fromCharCode(k)}
          </option>
        ))}
      </select>
    </div>
  );
}

KeycodeSelector.propTypes = {
  handler: React.PropTypes.func,
  activeKeyCode: React.PropTypes.number,
};
