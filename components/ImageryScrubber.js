import React from 'react';
import api from '../api';
import preloadImage from '../preloader';
import Loader from '../loader';
import {connect} from 'react-redux'
import { selectFrame, setLoading } from '../store';

const LOADING_MESSAGE = 'Loading...';

class ImageryScrubber extends React.Component {
  constructor(props) {
    super(props)
    this.loader = new Loader(),
    this.state = {
      loadingCount: 0,
      loadingComplete: 0,
      loadedImages: [],
      width: 600,
      height: 600,
    };
  }

  componentDidMount() {
    this.loadImages();
  }

  async loadImages() {
    console.log('loading images');
    this.props.dispatch(setLoading(true));

    const {layers, frames} = this.props;

    const enabledLayers = layers
      .filter(layer => layer.enabled)
      .map(layer => layer.key);

    const timestamps = frames
      .map(frame => frame.key);

    const paths = api.generatePaths(timestamps, enabledLayers);
    let loadingComplete = 0;

    this.setState({
      ...this.state,
      loadingCount: paths.length,
      loadingComplete: loadingComplete,
    });

    const loadedImages = await Promise.all(
      paths.map(path => {
        return preloadImage(path).then(img => {
          loadingComplete += 1;
          this.setState({
            ...this.state,
            loadingComplete,
          });
          return img;
        });
      })
    );


    this.setState({
      ...this.state,
      loadedImages,
    })

    this.props.dispatch(setLoading(false));
  }

  componentDidUpdate(prevProps) {
    const {layers, selectedFrameIndex, frames} = this.props;

    const changedLayer = layers.find((layer, index) => {
      const prevLayer = prevProps.layers[index];
      return layer.enabled !== prevLayer.enabled;
    });

    const changedFrames = frames.length !== prevProps.frames.length;

    if(changedLayer || changedFrames) {
      this.loadImages();
    }

    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.state.width, this.state.height);

    const enabledLayers = layers.filter(layer => layer.enabled);
    const enabledLayerCount = enabledLayers.length;
    ctx.globalCompositeOperation = 'source-over';
    // ctx.globalCompositeOperation = 'screen';
    enabledLayers.forEach((layer, i) => {
      const img = this.state.loadedImages[selectedFrameIndex * enabledLayerCount + i];
      if(img) {
        ctx.drawImage(img, 0, 0, this.state.width, this.state.height);
      }
      ctx.globalCompositeOperation = 'screen';
    });

    ctx.globalCompositeOperation = 'source-over';

    if(this.props.loading) {
      this.drawLoadingMessage(ctx);
      this.drawLoadingBar(ctx);
    }
  }

  drawLoadingMessage(ctx) {
    const x = 30, y = 60;
    ctx.font = '30px Sans-serif';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.strokeText(LOADING_MESSAGE, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(LOADING_MESSAGE, x, y);
  }

  drawLoadingBar(ctx) {
    const x = 30, y = 80;
    ctx.font = '30px Sans-serif';
    const textSize = ctx.measureText(LOADING_MESSAGE);
    const progress = this.state.loadingComplete / this.state.loadingCount || 0;

    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + textSize.width, y);
    ctx.stroke();

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + textSize.width * progress, y);
    ctx.stroke();
  }

  render() {
    return (
      <div>
        <canvas ref="canvas" width={this.state.width} height={this.state.height}></canvas>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {layers, frames, selectedFrameIndex, loading} = state;
  return {layers, frames, selectedFrameIndex, loading};
}

export default connect(mapStateToProps)(ImageryScrubber)
