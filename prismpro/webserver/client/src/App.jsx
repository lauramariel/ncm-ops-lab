import React, { Component } from 'react';

// Components
import {
  NavBarLayout,
  MainPageLayout,
  NutanixLogoIcon
} from 'prism-reactjs';

import DefaultPage from './pages/DefaultPage.jsx';
import AlertPage from './pages/AlertPage.jsx';

// Styles
import './styles/main.less';
import 'prism-reactjs/dist/index.css';

class App extends Component {

  renderPage() {
    const { path } = this.props;
    switch(path) {
      case '/alerts':
      case '/alerts/':
        return <AlertPage/>;
      case '/bootcamp':
      case '/bootcamp/':
      default:
        return <DefaultPage />;
    }
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
          { this.renderPage() }
        </div> }
        oldMainPageLayout={ false }
      />
    );
  }
}

export default App;
