import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <h2>A simple react boilerplate</h2>
        <h2>It contains: </h2>
        <ul>
          <li>webpack dev server by express middleware</li>
          <li>webpack hot replacement</li>
          <li>css modules</li>
          <li>express server and pug template</li>
        </ul>
      </div>
    )
  }
}
