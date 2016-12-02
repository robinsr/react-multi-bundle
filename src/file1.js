import React from 'react';

export default class file1 extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  someMethonid() {
    console.log('efefef')
  }

  render() {
    return (
      <div></div>
    );
  }
}
