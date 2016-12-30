// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { analyze } from '../utils/web-audio-beat-detection';

import AudioPlayer from './AudioPlayer';

import styles from './AudioDetection.css';

import {
  setDetectedBpm,
} from '../actions/bpmActions';

@connect()
export default class AudioDetection extends Component {
  static propTypes = {
    activeKeyCode: React.PropTypes.number,
    dispatch: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      audioSrc: null,
      playing: false,
      detecting: false,
      currentTime: 0,
      duration: 0,
      fileName: null,
    };
  }
  componentDidMount() {
    function bodyListener(e) {
      if (e.which !== this.props.activeKeyCode && this.state.audioSrc) {
        if (this.state.playing) {
          this.pauseAudio();
        } else {
          this.toggleAudio();
        }
      }
    }

    this.audioPlayer.addEventListener('timeupdate', () => {
      this.setState({ currentTime: this.audioPlayer.currentTime });
    });
    this.audioPlayer.addEventListener('ended', () => {
      this.setState({ currentTime: 0 });
      this.audioPlayer.currentTime = 0;
      this.setState({ playing: false });
    });

    document.body.removeEventListener('keyup', bodyListener);
    document.body.addEventListener('keyup', bodyListener.bind(this));
  }
  audioChange(e) {
    const file = e.target.files[0];
    const blobUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    this.setState({ detecting: true, fileName: file.name });

    /* eslint-disable */
    reader.onload = () => {
      (new AudioContext()).decodeAudioData(reader.result)
        .then((result) => {
          analyze(result)
            .then(bpm => {
              this.props.dispatch(setDetectedBpm(bpm));
              this.setState({ detecting: false, duration: result.duration });
              this.drawWaveform(result);
            })
            .catch(() => null)
        })
        .catch(() => null);
    };
    /* eslint-enable */

    reader.readAsArrayBuffer(file);
    this.setState({ audioSrc: blobUrl });
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
  skipToTime(percent) {
    const currentTime = this.audioPlayer.duration * percent;

    this.setState({ currentTime });
    this.audioPlayer.currentTime = currentTime;
  }
  pauseAudio() {
    this.audioPlayer.pause();
    this.setState({ playing: false });
  }
  drawWaveform(samples) { // eslint-disable-line
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#43cea2';
    const data = samples.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    for (let i = 0; i < width; i += 1) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j += 1) {
        const datum = data[(i * step) + j];
        if (datum < min) {
          min = datum;
        }
        if (datum > max) {
          max = datum;
        }
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  }
  render() {
    const canvas = this.state.audioSrc
      ? <canvas ref={ref => this.canvas = ref} className={styles.canvas} width={600} height={120} />
      : null;

    return (
      <div>
        <audio
          src={this.state.audioSrc}
          ref={ref => this.audioPlayer = ref}
        />
        <AudioPlayer
          audioChange={this.audioChange.bind(this)}
          toggleAudio={this.toggleAudio.bind(this)}
          pauseAudio={this.pauseAudio.bind(this)}
          timeChange={this.skipToTime.bind(this)}
          isPlaying={this.state.playing}
          audioSrc={this.state.audioSrc}
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          fileName={this.state.fileName}
          isDetecting={this.state.detecting}
        >
          {canvas}
        </AudioPlayer>
      </div>
    );
  }
}