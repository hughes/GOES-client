
import {connect} from 'react-redux'
import api from '../api';
import ImageryScrubber from '../components/ImageryScrubber';

import Layout from '../components/Layout.js'
import LayerSelection from '../components/LayerSelection';
import { setFrames } from '../store';
import TimelineControl from '../components/TimelineControl';

class Index extends React.Component {
  static async getInitialProps ({ reduxStore }) {

    return {};
  }

  async componentDidMount () {
    const {dispatch} = this.props

    const frames = (await api.latest())
      .slice(0, 60)
      .map(v => v.toString())
      .map(v => {
        return {key: v, timestamp: v};
      });

    dispatch(setFrames(frames))
  }

  componentWillUnmount () {
    // clearInterval(this.timer)
  }

  render () {
    return (
      <Layout>
        <h1>GOES-client</h1>
        <ImageryScrubber></ImageryScrubber>
        <LayerSelection></LayerSelection>
        <TimelineControl></TimelineControl>
      </Layout>
    )
  }
}

export default connect()(Index);
