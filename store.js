import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const exampleInitialState = {
  selectedFrameIndex: null,
  frames: [],
  layers: [{
    key: 'geocolor',
    enabled: true,
    name: 'Geocolor',
  }],
}

export const actionTypes = {
  TOGGLE_LAYER: 'TOGGLE_LAYER',
  SET_FRAMES: 'SET_FRAMES',
  SELECT_FRAME: 'SELECT_FRAME',
};

// reducers
export const reducer = (state=exampleInitialState, action) => {
  switch(action.type) {
    case actionTypes.TOGGLE_LAYER:
      const layer = state.layers[action.layerIndex];
      return {
        ...state,
        layers: [
          ...state.layers.slice(0, action.layerIndex),
          {
            ...layer,
            enabled: !layer.enabled,
          },
          ...state.layers.slice(action.layerIndex + 1),
        ],
      };
    case actionTypes.SET_FRAMES:
      return {
        ...state,
        frames: action.frames,
      };
    case actionTypes.SELECT_FRAME:
      return {
        ...state,
        selectedFrameIndex: action.selectedFrameIndex,
      }
    default: return state;
  }
}

// actions
export const selectFrame = (selectedFrameIndex) => dispatch => {
  return dispatch({
    type: actionTypes.SELECT_FRAME,
    selectedFrameIndex,
  });
}

export const setFrames = (frames) => dispatch => {
  return dispatch({
    type: actionTypes.SET_FRAMES,
    frames,
  });
}

export const toggleLayer = (layerIndex) => dispatch => {
  return dispatch({
    type: actionTypes.TOGGLE_LAYER,
    layerIndex,
  });
}

export function initializeStore(initialState=exampleInitialState) {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
