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
        <ul>
          {this.props.layers.map(({key, enabled, name}, i) => (
            <li key={key}>
              {name}
              <input
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
  const { layers } = state;
  return { layers };
}

export default connect(mapStateToProps)(LayerSelection);
