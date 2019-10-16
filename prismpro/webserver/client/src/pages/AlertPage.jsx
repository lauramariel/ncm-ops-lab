import React, { Component } from 'react';

// Components
import {
  Title,
  Modal,
  InputPlusLabel,
  StackingLayout,
  ElementPlusLabel,
  Button,
  RadioGroup,
  Radio,
  Loader,
  TextLabel,
  Alert
} from 'prism-reactjs';

import EntitySearch from '../components/EntitySearch.jsx';

// Utils
import {
  basicFetch,
  getErrorMessage
} from '../utils/FetchUtils';
import {
  isValidIP
} from '../utils/AppUtil';

class DefaultPage extends Component {

  state = {
    step: 0,
    radio: 'A120241'
  };

  renderModalHeader() {
    return (
      <div className="modal-title-container">
      <Title size="h3">Prism Pro Lab</Title>
      </div>
    );
  }

  onVMSearchErr = (e) => {
    if (e && e.message === 'AUTHENTICATION_REQUIRED') {
      this.setState({
        error: 'Failed to authenticate using default password. Please enter your PC Password to continue.'
      });
    } else {
      this.setState({
        error: e
      });
    }
  }

  renderEntityPicker() {
    const { pcIp, vm, password } = this.state;
    const isValidPcIp = isValidIP(pcIp);
    if (!isValidPcIp || !password) {
      return null;
    }
    return (
      <ElementPlusLabel
        label="Select your VM"
        element={
          <EntitySearch
            onEntitiesChange={ selectedvm => this.setState({ vm : selectedvm }) }
            selectedEntities={ vm }
            placeholder='Type to search for your VM'
            entityType="vm"
            pcIp={ pcIp }
            password={ password }
            onError={ this.onVMSearchErr }
          />
        }
        helpText="Choose the VM that you created for this lab"
      />
    );
  }

  renderBody() {
    const { pcIp, password } = this.state;
    const isValidPcIp = isValidIP(pcIp);
    return (
      <StackingLayout padding="20px">
        <StackingLayout itemSpacing="10px">
          <Title size="h3">Simulate an Alert</Title>
          <div><TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>Select the type of alert to generate, enter the Prism Central information, and select the VM to simulate the alert for to begin.</TextLabel></div>
        </StackingLayout>
        <StackingLayout itemSpacing="20px">
          <Title size="h4">Select the type of alert to simulate</Title>
          <RadioGroup
            id="alert_radiogroup"
            defaultValue={ this.state.radio }
            onChange={ e => this.setState({ radio : e.target.value }) }
            layout="horizontal"
          >
            <Radio
              value="A120241"
              title="VM Memory Constrained"
            />
            <Radio
              value="A120245"
              title="VM Bully"
            />
          </RadioGroup>
        </StackingLayout>
        <InputPlusLabel
          error={ pcIp && !isValidPcIp }
          onChange={e => this.setState({ pcIp : e.target.value }) }
          id="pcIP2"
          value={ pcIp }
          label="Prism Central IP Address"
          placeholder="Enter your Prism Central IP Address"
          helpText={ pcIp && !isValidPcIp ? 'Enter a Valid IP Address' : '' }
        />
        <InputPlusLabel
          onChange={e => this.setState({ password : e.target.value }) }
          id="password"
          value={ password }
          label="Prism Central Password"
          placeholder="Enter your Prism Central Password"
          type="password"
        />
        { this.renderEntityPicker() }
      </StackingLayout>
    );
  }

  getButtonText() {
    return 'Simulate Alert';
  }

  completeCurrentStep() {
    this.setState({
      loading: false,
      error: false,
      showAlertSuccess: false
    });

    // simulate alert
    this.simulateAlert(this.state.radio).then(resp => {
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
  }

  simulateAlert(alert_uid) {
    const { pcIp, vm, password } = this.state;
    // initiate script
    this.setState({ loading: true });
    return basicFetch({
      url: `generate_alert/${alert_uid}`,
      method: 'POST',
      data: JSON.stringify({
        pcIp: pcIp,
        vmId: vm && vm.uuid,
        vmName: vm && vm.name,
        password
      })
    });
  }

  getFooter() {
    const { pcIp, vm } = this.state;
    const enabled = isValidIP(pcIp) && vm;
    return (
      <div>
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
    return (
      <Modal
        width={ 500 }
        visible={ true }
        title="Modal"
        footer={ this.getFooter() }
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
    );
  }
}

export default DefaultPage;
