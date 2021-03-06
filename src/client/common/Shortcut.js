import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Mousetrap from 'mousetrap'
import _ from 'lodash'

function click(parent) {
  if (parent) {
    parent.focus()
    parent.click()
  }
  return false
}

class Shortcut extends Component {
  constructor(props) {
    super(props)
    this.parentNode = React.createRef()
  }

  componentDidMount() {
    Mousetrap.bind(this.props.hotkeys, () => click(this.parentNode.current))
  }

  componentWillUnmount() {
    Mousetrap.unbind(this.props.hotkeys)
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.hotkeys, prevProps.hotkeys)) {
      Mousetrap.unbind(prevProps.hotkeys)
      Mousetrap.bind(this.props.hotkeys, () => click(this.parentNode.current))
    }
  }

  render() {
    return <span ref={this.parentNode}/>
  }
}

Shortcut.propTypes = {
  hotkeys: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default Shortcut
