// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { analyze } from '../utils/web-audio-beat-detection';

import styles from './AudioDetection.css';

import {
  setDetectedBpm,
} from '../actions/bpmActions';

@connect()
export default class AudioDetection extends Component {
  static propTypes = {
    dispatch: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      audioSrc: null,
      playing: false,
      detecting: false,
    };
  }
  audioChange(e) {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    this.setState({ detecting: true });

    /* eslint-disable */
    reader.onload = () => {
      (new AudioContext()).decodeAudioData(reader.result)
        .then((result) =>
          analyze(result)
            .then(bpm => {
              this.props.dispatch(setDetectedBpm(bpm));
              this.setState({ detecting: false });
            })
            .catch(() => null)
        )
        .catch(() => null);
    };
    /* eslint-enable */

    reader.readAsArrayBuffer(file);
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
    const loading = this.state.detecting ? <Loading /> : null;

    return (
      <div>
        {loading}
        <input type="file" accept="audio/*" onChange={this.audioChange.bind(this)} />
        <audio src={this.state.audioSrc} ref={(ref) => this.audioPlayer = ref} />
        {button}
      </div>
    );
  }
}

function Loading() {
  return (
    <h4>Detecting...</h4>
  );
}
