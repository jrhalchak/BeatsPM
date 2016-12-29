export default function bpmReducer(state = {
  count: 0,
  msFirst: 0,
  msPrevious: 0,
  tapBpm: 0,
}, action: Object) {
  switch (action.type) {
    case 'SET_COUNT': {
      return {
        ...state,
        count: Number(action.payload),
      };
    }
    case 'SET_MS_FIRST': {
      return {
        ...state,
        msFirst: Number(action.payload),
      };
    }
    case 'SET_TAP_BPM': {
      return {
        ...state,
        tapBpm: Number(action.payload),
      };
    }
    case 'SET_MS_PREVIOUS': {
      return {
        ...state,
        msPrevious: Number(action.payload),
      };
    }
    case 'CLEAR_STATE': {
      return {
        ...state,
        count: 0,
        msFirst: 0,
        msPrevious: 0,
        tapBpm: 0,
      };
    }
    case 'SET_DETECTED_BPM': {
      return {
        ...state,
        detectedBpm: action.payload,
      };
    }
    default:
      return { ...state };
  }
}
