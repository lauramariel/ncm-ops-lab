import React, { Component } from 'react';

// Components
import {
  Title,
  Modal,
  NavBarLayout,
  MainPageLayout,
  NutanixLogoIcon,
  InputPlusLabel,
  StackingLayout,
  ElementPlusLabel,
  Button,
  Steps,
  Loader,
  TextLabel,
  Alert
} from 'prism-reactjs';

import EntitySearch from './components/EntitySearch.jsx';

// Utils
import {
  basicFetch,
  getErrorMessage
} from './utils/FetchUtils';

// Styles
import './styles/main.less';
import 'prism-reactjs/dist/index.css';

const isValidIP = (ipAddress) => {
  if (!ipAddress) {
    return false;
  }
  // It is okay to pass 79 chars limit so we won't break regex
  /* eslint-disable */
  if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(ipAddress)) {
    /* eslint-enable */
    return true;
  }
  return false;
}

class App extends Component {

  state = {
    step: 0
  };

  renderModalHeader() {
    return (
      <div className="modal-title-container">
      <Title size="h3">Prism Pro Lab</Title>
      </div>
    );
  }

  onVMSearchErr = (e) => {
    this.setState({
      error: e
    });
  }

  renderStep1() {
    const { pcIp, vm, vmIp } = this.state;
    const isValidPcIp = isValidIP(pcIp);
    return (
      <StackingLayout>
        <Title size="h3">Setup: Initiate some setup scripts to begin</Title>
        <div><TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>We will initiate some setup scripts that will stress your VM and set up some data for the lab stories 1-3. Click skip if you have already completed this step, as it does not need to be completed twice.</TextLabel></div>
        <InputPlusLabel
          error={ pcIp && !isValidPcIp }
          onChange={e => this.setState({ pcIp : e.target.value }) }
          id="pcIP"
          value={ pcIp }
          label="Prism Central IP Address"
          placeholder="Enter your Prism Central IP Address"
          helpText={ pcIp && !isValidPcIp ? 'Enter a Valid IP Address' : '' }
        />
        { isValidPcIp ? (
          <ElementPlusLabel
            label="Select your VM"
            element={
              <EntitySearch
                onEntitiesChange={ selectedvm => this.setState({ vm : selectedvm }) }
                selectedEntities={ vm }
                placeholder='Type to search for your VM'
                entityType="vm"
                pcIp={ this.state.pcIp }
                onError={ this.onVMSearchErr }
              />
            }
            helpText="Choose the VM that you created for this lab"
          />
        ) : null }
        { vm && !isValidIP(vm.ip) ? (
          <InputPlusLabel
            error={ vmIp && !isValidIP(vmIp) }
            onChange={e => this.setState({ vmIp : e.target.value }) }
            id="vmIP"
            label="VM IP Address"
            placeholder="Enter the IP Address of your VM"
            helpText={ vmIp && !isValidIP(vmIp) ? 'Enter a Valid IP Address' : '' }
          />
        ) : null }
      </StackingLayout>
    );
  }

  renderStep2() {
    return (
      <StackingLayout>
        <Title size="h3">Story 1-3: Follow the instructions in the lab document</Title>
        <div><TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>When the lab instructions tell you to proceed to the next step, click the 'Continue' button.</TextLabel></div>
      </StackingLayout>
    );
  }

  renderStep3() {
    const { pcIp } = this.state;
    const isValidPcIp = isValidIP(pcIp);
    return (
      <StackingLayout>
        <Title size="h3">Story 4: Simulate VM Memory Constrained Alert</Title>
        <div><TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>In the Setup step we stressed your VMs memory usage. Now we will use that VM and it's high memory usage to simulate a Memory Constrained alert.</TextLabel></div>
        <InputPlusLabel
          error={ pcIp && !isValidPcIp }
          onChange={e => this.setState({ pcIp : e.target.value }) }
          id="pcIP2"
          value={ pcIp }
          label="Prism Central IP Address"
          placeholder="Enter your Prism Central IP Address"
          helpText={ pcIp && !isValidPcIp ? 'Enter a Valid IP Address' : '' }
        />
      </StackingLayout>
    );
  }

  renderStep4() {
    const { pcIp } = this.state;
    const isValidPcIp = isValidIP(pcIp);
    return (
      <StackingLayout>
        <Title size="h3">Story 5: Simulate VM Bully Detected Alert</Title>
        <div><TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>In the Setup step we stressed your VMs CPU usage. Now we will use that VM and it's aggressive CPU usage to simulate a Bully Detected alert.</TextLabel></div>
        <InputPlusLabel
          error={ pcIp && !isValidPcIp }
          onChange={e => this.setState({ pcIp : e.target.value }) }
          value={ pcIp }
          id="pcIP3"
          label="Prism Central IP Address"
          placeholder="Enter your Prism Central IP Address"
          helpText={ pcIp && !isValidPcIp ? 'Enter a Valid IP Address' : '' }
        />
      </StackingLayout>
    );
  }

  renderBody() {
    const steps = [
      { title: 'Setup', content: this.renderStep1(), key: '1' },
      { title: 'Story 1-3', content: this.renderStep2(), key: '2' },
      { title: 'Story 4', content: this.renderStep3(), key: '3' },
      { title: 'Story 5', content: this.renderStep4(), key: '4' }
    ];
    return (
      <Steps
        steps={ steps }
        currentStep={ this.state.step }
        contentWidth={ 420 }
      />
    );
  }

  getButtonText() {
    const { step } = this.state;
    switch(step) {
      case 0:
        return 'Begin Setup';
      case 1:
        return 'Continue';
      case 2:
        return 'Simulate Alert';
      case 3:
        return 'Simulate Alert';
      default:
        return 'Next';
    }
  }

  completeCurrentStep() {
    const { step, pcIp, vmIp, vm } = this.state;
    this.setState({
      loading: false,
      error: false,
      showAlertSuccess: false
    });
    switch(step) {
      case 0:
        const uvmIp = (vm && isValidIP(vm.ip) && vm.ip) || vmIp;
        // initiate script
        this.setState({ loading: true });
        basicFetch({
          url: `begin/`,
          method: 'POST',
          data: JSON.stringify({
            pcIp: pcIp,
            vmIp: uvmIp,
            vmId: vm && vm.uuid,
            vmName: vm && vm.name
          })
        }).then(resp => {
          if (resp && resp.stderr) {
            this.setState({
              error: resp.stderr,
              loading: false
            });
          } else {
            this.setState({
              loading: false,
              step : 1
            });
          }
        }).catch(e => {
          console.log(e);
          this.setState({
            error: e,
            loading: false
          });
        });
        return;
      case 1:
        // Go to the next step...
        this.setState({ step : 2 });
        return;
      case 2:
        // simulate alert
        this.simulateAlert().then(resp => {
          if (resp && resp.stderr) {
            this.setState({
              error: resp.stderr,
              loading: false
            });
          } else {
            this.setState({
              loading: false,
              showAlertSuccess: true,
              step: 3
            });
          }
        }).catch(e => {
          console.log(e)
          this.setState({
            error: e,
            loading: false
          });
        });
        return;
      case 3:
        // simulate alert
        this.simulateAlert().then(resp => {
          if (resp && resp.stderr) {
            this.setState({
              error: resp.stderr,
              loading: false
            });
          } else {
            this.setState({
              loading: false,
              showAlertSuccess: true
            });
          }
        }).catch(e => {
          console.log(e)
          this.setState({
            error: e,
            loading: false
          });
        });
        return;
      default:
        return;
    }
  }

  simulateAlert() {
    // initiate script
    this.setState({ loading: true });
    return basicFetch({
      url: `generate_alert/`,
      method: 'POST',
      data: JSON.stringify({
        pcIp: this.state.pcIp
      })
    });
  }

  getFooter() {
    const { step, pcIp, vmIp, vm } = this.state;
    let enabled = step === 1 || this.state.pcIp;
    if (step === 0) {
      enabled = isValidIP(pcIp) && vm && (isValidIP(vm.ip) || isValidIP(vmIp));
    }
    return (
      <div>
        { step === 1 ? null : (
          <Button
            type="secondary"
            onClick={() => this.setState({
              loading: false,
              error: false,
              showAlertSuccess: false,
              step: step < 3 ? step + 1 : step - 1
            })}>
            { step < 3 ? 'Skip' : 'Back' }
          </Button>
        ) }
        <Button disabled={ !enabled } type="primary" onClick={ () => this.completeCurrentStep() }>
          { this.getButtonText() }
        </Button>
      </div>
    );
  }

  renderAlerts() {
    if (this.state.error) {
      return (
        <Alert
          type={ Alert.TYPE.ERROR }
          message={ getErrorMessage(this.state.error) || 'An unknown error occurred.' }
        />
      );
    } else if (this.state.showAlertSuccess) {
      return (
        <Alert
          type={ Alert.TYPE.SUCCESS }
          message="Alert was Successfully Generated."
        />
      );
    }
    return null;
  }

  render() {
    const footer = this.getFooter();
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
        body={ <div className="page-body">{
          <Modal
            width={ 500 }
            visible={ true }
            title="Modal"
            footer={ footer }
            mask={ false }
            maskClosable={ false }
            customModalHeader={ this.renderModalHeader() }
          >
            <Loader loading={ !!this.state.loading }>
              <StackingLayout>
                { this.renderAlerts() }
                { this.renderBody() }
              </StackingLayout>
            </Loader>
          </Modal>
        }</div> }
        oldMainPageLayout={ false }
      />
    );
  }
}

export default App;
