import React, { Component } from 'react';

// Components
import {
  Loader,
  NavBarLayout,
  MainPageLayout,
  NutanixLogoIcon
} from 'prism-reactjs';

import LoginPage from './pages/LoginPage.jsx';
import AlertPage from './pages/AlertPage.jsx';

import {
  basicFetch
} from './utils/FetchUtils';

// Styles
import './styles/main.less';
import 'prism-reactjs/dist/index.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginSuccess: false
    }
  }

  componentDidMount() {
    this.loginCheck();
  }

  renderPage() {
    if (this.state.loading) {
      return null;
    }
    if (!this.state.loginSuccess) {
      return <LoginPage />;
    }
    const { path } = this.props;
    switch(path) {
      case '/alerts':
      case '/alerts/':
        return <AlertPage/>;
      default:
        return <AlertPage/>;
    }
  }

  loginCheck() {
    basicFetch({
      url: `/login/`,
      method: 'GET'
    }).then(resp => {
      this.setState({
        loading: false,
        loginSuccess: true
      });
    }).catch(e => {
      console.error(e)
      this.setState({
        loading: false,
        loginSuccess: false
      });
    })
  }

  render() {
    return (
      <MainPageLayout
        fullPage={ true }
        header={ (
          <NavBarLayout className="demo-mode"
            logoIcon={ <NutanixLogoIcon style={ { cursor: 'pointer' } } color="gray-1" /> }
            layout={ NavBarLayout.LAYOUTS.CENTER }
            menuIcon={ null }
          />
        ) }
        body={ <div className="page-body">
          <Loader loading={ this.state.loading }>
            { this.renderPage() }
          </Loader>
        </div> }
        oldMainPageLayout={ false }
      />
    );
  }
}

export default App;
