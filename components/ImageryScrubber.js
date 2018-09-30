import React from 'react';
import api from '../api';
import preloadImage from '../preloader';
import Loader from '../loader';
import {connect} from 'react-redux'
import { selectFrame } from '../store';

class ImageryScrubber extends React.Component {
  constructor(props) {
    super(props)
    this.loader = new Loader(),
    this.state = {
      loadedImages: [],
      count: 0,
      width: 400,
      height: 400,
      loading: true,
    };
  }

  async componentDidMount() {
    // await this.loadImages();
  }

  async loadImages() {

    const loadedImages = await Promise.all(
      this.props.images
        .map(img => api.imageryPath(img.timestamp))
        .map(path => preloadImage(path))
    );
    this.setState({
      ...this.state,
      loading: false,
      loadedImages,
    })
  }

  rebuildImageList() {
    console.log('rebuilding images');
  }

  componentDidUpdate(prevProps) {
    const changedLayer = this.props.layers.find((layer, index) => {
      const prevLayer = prevProps.layers[index];
      return layer.enabled !== prevLayer.enabled;
    });
    if(changedLayer) {
      this.rebuildImageList();
    }

    const ctx = this.refs.canvas.getContext('2d');
    const img = this.state.loadedImages[this.state.count];
    if(img) {
      ctx.drawImage(img, 0, 0, this.state.width, this.state.height);
    } else {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, this.state.width, this.state.height);
    }
    if(this.state.loading) {
      const text = 'Loading...';
      const x = 30, y = 60;
      ctx.font = '30px Sans-serif';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = 'white';
      ctx.fillText(text, x, y);
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'white';
    }
  }

  render() {
    const {count} = this.state;
    return (
      <div>
        <canvas ref="canvas" width={this.state.width} height={this.state.height}></canvas>
        {/* <Imagery timestamp={this.props.images[count].timestamp}></Imagery> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {layers, frames, selectedFrameIndex} = state;
  return {layers, frames, selectedFrameIndex};
}

export default connect(mapStateToProps)(ImageryScrubber)
