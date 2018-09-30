import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import api from './api';

const DEFAULT_LAYERS = ['geocolor', 'white'];

const initialLayers = Object.keys(api.layers).map(key => {
  const name = api.layers[key];
  const enabled = DEFAULT_LAYERS.includes(key);
  return {key, name, enabled};
});

const exampleInitialState = {
  selectedFrameIndex: null,
  frames: [],
  layers: initialLayers,
  autoplay: true,
  loading: true,
}

export const actionTypes = {
  TOGGLE_LAYER: 'TOGGLE_LAYER',
  SET_FRAMES: 'SET_FRAMES',
  SELECT_FRAME: 'SELECT_FRAME',
  TOGGLE_AUTOPLAY: 'TOGGLE_AUTOPLAY',
  SET_LOADING: 'SET_LOADING',
};

// reducers
export const reducer = (state=exampleInitialState, action) => {
  switch(action.type) {
    case actionTypes.TOGGLE_LAYER:
      const layer = state.layers[action.layerIndex];
      const beforeLayers = state.layers.slice(0, action.layerIndex);
      const afterLayers = state.layers.slice(action.layerIndex + 1);
      const newLayers = [
        ...beforeLayers,
        {
          ...layer,
          enabled: !layer.enabled,
        },
        ...afterLayers,
      ]
      return {
        ...state,
        layers: newLayers,
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
    case actionTypes.TOGGLE_AUTOPLAY:
      return {
        ...state,
        autoplay: !state.autoplay,
      }
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
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
    layerIndex: parseInt(layerIndex, 10),
  });
}

export const toggleAutoplay = () => dispatch => {
  return dispatch({
    type: actionTypes.TOGGLE_AUTOPLAY,
  });
}

export const setLoading = (loading) => dispatch => {
  return dispatch({
    type: actionTypes.SET_LOADING,
    loading,
  });
}

export function initializeStore(initialState=exampleInitialState) {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
