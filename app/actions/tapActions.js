export function setCount(num) {
  return {
    type: 'SET_COUNT',
    payload: num,
  };
}

export function setMsFirst(ms) {
  console.warn('setMsFirst called');
  return {
    type: 'SET_MS_FIRST',
    payload: ms,
  };
}

export function setTapBpm(bpm) {
  return {
    type: 'SET_TAP_BPM',
    payload: bpm,
  };
}

export function setMsPrevious(ms) {
  return {
    type: 'SET_MS_PREVIOUS',
    payload: ms,
  };
}

export function clearState() {
  return {
    type: 'CLEAR_STATE',
    payload: null,
  };
}

export default {
  setCount,
};
