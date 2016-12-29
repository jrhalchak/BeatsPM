// @flow
import React, { Component } from 'react';
// import { Link } from 'react-router';
// import { connect } from 'react-redux';
// import { analyze } from 'web-audio-beat-detector';

import styles from './AudioDetection.css';

import {
  setDetectedBpm,
} from '../actions/bpmActions';

export default class AudioDetection extends Component {
  static propTypes = {
    handler: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      audioSrc: null,
      playing: false,
    };
  }
  audioChange(e) {
    const files = e.target.files;
    const fileUrl = URL.createObjectURL(files[0]);
    
    this.setState({ audioSrc: fileUrl });
  }
  toggleAudio() { 
    if (this.state.playing) {
      this.audioPlayer.pause();
      this.audioPlayer.currentTime = 0;
      this.setState({ playing: false });
    } else {
      this.audioPlayer.play();
      this.setState({ playing: true });
    }
  }
  render() {
    const toggleAudio = this.toggleAudio.bind(this);
    const buttonWithText = this.state.playing
        ? <button className={styles.audioButton} onClick={toggleAudio}>Stop</button>
        : <button className={styles.audioButton} onClick={toggleAudio}>Play</button>;
    const button = !this.state.audioSrc
      ? null
      : buttonWithText;

    return (
      <div>
        <input type="file" accept="audio/*" onChange={this.audioChange.bind(this)} />
        <audio src={this.state.audioSrc} ref={(ref) => this.audioPlayer = ref} />
        {button}
      </div>
    );
  }
}
