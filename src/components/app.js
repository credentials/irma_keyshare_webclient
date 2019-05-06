import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../pages/home';

export default class App extends Component {

  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path="/" language="nl" />
          <Home path="/en" language="en" />
        </Router>
      </div>
    );
  }
}
