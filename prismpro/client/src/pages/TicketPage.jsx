import React, { Component } from 'react';

// Components
import {
  Table,
  Alert,
  ElementPlusLabel,
  StackingLayout,
  ConfirmModal,
  Paragraph
} from 'prism-reactjs';


import EntitySearch from '../components/EntitySearch.jsx';
// Utils
import {
  basicFetch
} from '../utils/FetchUtils';

class TicketPage extends Component {

  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);


    this.columns = [
      {
        title: 'Creation Time',
        key: 'creation_time',
        render: (creation_time) => {
          let dt = new Date(creation_time);
          return <Paragraph> {dt.toLocaleDateString()+ " " + dt.toLocaleTimeString()}</Paragraph>
        }
      },
      {
        title: 'Task ID',
        key: 'key',
      },
      {
        title: 'Task Status',
        key: 'task_status',
      },
      {
        title: 'Alert Name',
        key: 'alert_name',
      },
      {
        title: 'Alert ID',
        key: 'alert_id'
      },
      {
        title: 'VM Name',
        key: 'vm_name'
      },
      {
        title: 'VM ID',
        key: 'vm_id'
      },
      {
        title: 'URL',
        key: 'url'
      }
    ];

    this.state = {
      ticketData: [],
      visible: false,
      inputVal: '',
      error: false,
      showSuccessBanner: false,
      rowData: null
    };
  }

  modalErrorAlert = <Alert type="error" inline={true} message="Please Select a Playbook to proceed." />;
  successAlert = <Alert type="success" inline={false} message="Ticket resolved successfully!" />;

  componentDidMount() {

    const options = {
      method: 'GET',
      url: 'gettickets'
    }
    basicFetch(options)
      .then(res => {
        for (var prop in res.data.tickets[0]) {
          console.log(prop, res.data.tickets[0][prop]);
        }
        this.setState({
          ticketData: res.data.tickets
        })
      })

  }

  validate() {
    console.log("in validate", this.state)
    const { selectedPlaybook, rowData } = this.state;

    // initiate script
    this.setState({ loading: true });

    if (selectedPlaybook === null) {
      this.setState({
        error: true,
        showSuccessBanner: false
      });
      return;
    }
    else {
      return basicFetch({
        url: `/api/nutanix/v3/action_rules/trigger`,
        method: 'POST',
        data: JSON.stringify({
          trigger_type: "manual_trigger",
          trigger_instance_list: [
            {
              action_rule_uuid: selectedPlaybook.uuid,
              source_entity_info: JSON.stringify({
                type: "vm",
                uuid: rowData.vm_id
              })
            }
          ]
        })
      }).then(resp => {
        if (resp && resp.stderr) {
          this.setState({
            error: resp.stderr,
            loading: false
          });
        } else {
          this.setState({
            error: false,
            visible: false,
            showSuccessBanner: true
          });
        }
      });
    }

  }

  renderEntityPicker() {
    return (
      <ElementPlusLabel
        label={'Select the Playbook to Trigger'}
        element={
          <EntitySearch
            onEntitiesChange={
              selectedPlaybook => {
                console.log("selected playbook", selectedPlaybook)
                this.setState({ selectedPlaybook })
              }
            }
            selectedEntities={this.state.selectedPlaybook}
            placeholder='Type to search for a Playbook'
            entityType="action_rule"
            nameAttr="name"
            onError={() => console.error('TODO do something if there is an error')}
          />
        }
      />
    );
  }


  handleRowAction(key, rowData) {
    // alert(rowData.vm_id);
    this.setState({ rowData, visible:true });

  }


  renderTicketsInTable() {
    return (
      <div>
        <StackingLayout>
          <ConfirmModal
            visible={this.state.visible}
            onConfirm={this.validate}
            confirmTitle="Resolve Ticket"
            confirmButtonLabel="Submit"
            confirmButtonType="primary"
            alignContent="left"
            confirmText={
              <StackingLayout>
                {this.state.error ? this.modalErrorAlert : null}
                { this.renderEntityPicker() }
              </StackingLayout>
            }
          />
        </StackingLayout>

      <Table oldTable={false} loading={false} dataSource={this.state.ticketData} columns={this.columns}
        rowAction={{
          actions: (rowData) => {
            return [
              {
                key: 'custom',
                value: `Resolve Ticket`
              }
            ]
          },
          onRowAction: this.handleRowAction.bind(this),
          //getPopupContainer:()=>document.getElementById('test')
        }} />
         </div>
    );
  }

  render() {
    return (
      <StackingLayout>
        {this.state.showSuccessBanner ? this.successAlert : null}
        {this.renderTicketsInTable()}
      </StackingLayout>
    );
  }
}

export default TicketPage;



