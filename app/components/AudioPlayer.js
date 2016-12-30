import React, { Component } from 'react';

import styles from './AudioPlayer.css';

export default class AudioPlayer extends Component {
  handleRangeChange(e) {
    this.props.timeChange(e.target.value / e.target.max);
  }
  render() {
    const {
      toggleAudio,
      pauseAudio,
      isPlaying,
      audioSrc,
      currentTime,
      duration,
      audioChange,
      fileName,
      isDetecting,
    } = this.props;

    const toggleText = isPlaying ? 'Stop' : 'Play';
    const toggleClass = isPlaying ? styles.stopButton : null;
    const currentVal = (currentTime / duration) * 100;
    const detecting = isDetecting ? <Detecting /> : null;
    if (!audioSrc) {
      return (
        <div className="pad-v">
          <FileInput audioChange={audioChange} isAlone={true} />
        </div>
      );
    }

    return (
      <div className={styles.audioContainer}>
        {detecting}
        <div className={styles.audioControls}>
          <div className="pad-h-half float-right">
            <button className={`${styles.audioButton} ${toggleClass}`} onClick={toggleAudio}>{toggleText}</button>
            <button className={styles.audioButton} onClick={pauseAudio}>Pause</button>
          </div>
          <FileInput audioChange={audioChange} fileName={fileName} isAlone={false} />          
        </div>
        <div className={styles.waveContainer}>
          {this.props.children}
          <progress className={styles.progressOverlay} value={currentVal} max="100" />
        </div>
        <input type="range" min="0" max="100" className={styles.slider} onChange={this.handleRangeChange.bind(this)} value={currentVal} />
      </div>
    );
  }
}

function Detecting() {
  return (
    <div className={styles.detectingMessage}>Attempting BPM Auto-Detect...</div>
  );
}


function FileInput({ audioChange, fileName, isAlone }) {
  const divAlignment = isAlone ? 'text-center' : 'text-left';
  const labelClass = isAlone ? styles.audioInputLabelBig : '';
  return (
    <div className={`pad-h-half ${divAlignment}`}>
      <label htmlFor="audio_input">
        <span className={`${styles.audioInputLabel} ${labelClass}`}>
          {fileName ? 'Change Song' : 'Open a Song' }
        </span>
        {fileName ? <small className={styles.fileName}>- {fileName}</small> : ''}
      </label>
      <input id="audio_input" className={styles.audioInput} type="file" accept="audio/*" onChange={audioChange} />
    </div>
  );
}
