import React from 'react';
import {connect} from 'react-redux'
import ReactInterval from 'react-interval';
import { selectFrame } from '../store';

class TimelineControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoIncrement: true,
    }
  }

  toggleAutoIncrement() {
    this.setState({
      ...this.state,
      autoIncrement: !this.state.autoIncrement,
    });
  }

  changeFrameSlider(event) {
    const frameIndex = event.target.value;
    // make sure it's a valid frame
    if(frameIndex < 0 || frameIndex >= this.props.frames.length) {
      return;
    }
    return this.props.dispatch(selectFrame(frameIndex));
  }

  increment() {
    if(!this.state.autoIncrement) {
      // no auto increment - do nothing
      return;
    }

    const {dispatch, frames, selectedFrameIndex} = this.props;
    if(frames.length === 0) {
      // no frames - do nothing
      return;
    }

    if(selectedFrameIndex === null) {
      // haven't selected a frame yet - use the first one
      return dispatch(selectFrame(0));
    }

    return dispatch(selectFrame((selectedFrameIndex + 1) % frames.length));
  }

  render() {
    return (
      <div>
        <ReactInterval timeout={42} enabled={true} callback={() => this.increment()} />
        <label>
          Auto increment:
          <input
            type="checkbox"
            checked={this.state.autoIncrement}
            onChange={event => this.toggleAutoIncrement(event)} />
        </label>
        <input
          type="range"
          min="0"
          max={this.props.frames.length}
          value={this.props.selectedFrameIndex || 0}
          className="slider"
          id="timelineControl"
          disabled={this.state.autoIncrement}
          onChange={event => this.changeFrameSlider(event)}
        />
      </div>
    );
  }
}


function mapStateToProps(state) {
  const {selectedFrameIndex, frames} = state;
  return {selectedFrameIndex, frames};
}

export default connect(mapStateToProps)(TimelineControl)
