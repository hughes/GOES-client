import {connect} from 'react-redux'
import React from 'react';
import { toggleLayer } from '../store';


class LayerSelection extends React.Component {
  handleChange(event) {
    this.props.dispatch(toggleLayer(event.target.name));
  }

  render() {
    return (
      <form>
        Layers:
        <ul>
          {this.props.layers.map(({key, enabled, name}, i) => (
            <li key={key}>
              {name}
              <input
                disabled={this.props.loading}
                type="checkbox"
                name={i}
                checked={enabled}
                onChange={(event) => this.handleChange(event)} />
            </li>
          ))}
        </ul>
      </form>
    );
  }
}

function mapStateToProps(state) {
  const { layers, loading } = state;
  return { layers, loading };
}

export default connect(mapStateToProps)(LayerSelection);
