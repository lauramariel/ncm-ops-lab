import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Components
import {
  Loader,
  NavBarLayout,
  MainPageLayout,
  NutanixLogoIcon
} from 'prism-reactjs';

// Prism reactjs style
import 'prism-reactjs/dist/index.css';

import LoginPage from './pages/LoginPage.jsx';
import AlertPage from './pages/AlertPage.jsx';
import TicketPage from './pages/TicketPage.jsx';
import ConfigureBlueMedoraPage from './pages/ConfigureBlueMedoraPage.jsx';
import DebugPage from './pages/DebugPage.jsx';
import StressPage from './pages/StressPage.jsx';

import {
  basicFetch
} from './utils/FetchUtils';

// Styles
import './styles/main.less';

class App extends Component {

  static propTypes = {
    path: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginSuccess: false
    };
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
    
    switch (path) {
      case '/ticketsystem':
        return <TicketPage />;
      case '/debug':
        return <DebugPage />;
      case '/stress':
        return <StressPage />;
      case '/databases':
        return <ConfigureBlueMedoraPage />;
      case '/alerts':
      case '/alerts/':
        return <AlertPage />;
      default:
        return null;
    }
  }

  loginCheck() {
    basicFetch({
      url: '/login/',
      method: 'GET'
    }).then(resp => {
      this.setState({
        loading: false,
        loginSuccess: true
      });
    }).catch(e => {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({
        loading: false,
        loginSuccess: false
      });
    });
  }

  render() {
    return (
      <MainPageLayout
        fullPage={true}
        header={(
          <NavBarLayout className="demo-mode"
            logoIcon={<NutanixLogoIcon style={{ cursor: 'pointer' }} color="gray-1" />}
            layout={NavBarLayout.LAYOUTS.CENTER}
            menuIcon={null}
          />
        )}
        body={<div className="page-body">
          <Loader loading={this.state.loading}>
            {this.renderPage()}
          </Loader>
        </div>}
        oldMainPageLayout={false}
      />
    );
  }

}

export default App;

