import React, { Component } from 'react';

// Components
import {
  Title,
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
    this.columns = [
      {
        title: 'Creation Time',
        key: 'creation_time',
        render: (creation_time) => {
          const dt = new Date(creation_time);
          return <Paragraph> {`${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`}</Paragraph>;
        }
      },
      {
        title: 'Ticket ID',
        key: 'key'
      },
      {
        title: 'Ticket Status',
        key: 'task_status'
      },
      {
        title: 'Alert Name',
        key: 'alert_name'
      },
      {
        title: 'VM Name',
        key: 'vm_name'
      },
      {
        title: 'Webhook Id',
        key: 'webhook_id'
      }
    ];

    this.state = {
      ticketData: [],
      inputVal: '',
      error: false,
      showSuccessBanner: false,
      structure: {
        bodyMaxHeight: '1000px'

      }
    };
  }

  successAlert = <Alert type="success" inline={false} message="Ticket resolved successfully!" />;

  componentDidMount() {
    const options = {
      method: 'GET',
      url: 'gettickets'
    };
    basicFetch(options)
      .then(res => {

        this.setState({
          ticketData: res.data.tickets.sort(function (a, b) {
            var dateA = new Date(a.creation_time), dateB = new Date(b.creation_time);
            return dateB - dateA;
          })
        });
      });
  }

  callWebhook(key, rowData) {
    return basicFetch({
      url: '/api/nutanix/v3/action_rules/trigger',
      method: 'POST',
      data: JSON.stringify({
        trigger_type: 'incoming_webhook_trigger',
        trigger_instance_list: [
          {
            webhook_id: rowData.webhook_id,
            entity1: JSON.stringify({
              type: 'vm',
              name: rowData.vm_name,
              uuid: rowData.vm_id
            }),
            entity2: JSON.stringify({
              type: 'alert',
              name: rowData.alert_name,
              uuid: rowData.alert_id
            })
          }
        ]
      })
    });
  }

  renderTicketsInTable() {
    return (
      <div>
        <StackingLayout padding="20px">
          <Title>Prism Pro Service Ticket System</Title>
          <Table
            oldTable={false}
            loading={false}
            dataSource={this.state.ticketData}
            columns={this.columns}
            structure={this.state.structure}
            rowAction={{
              actions: (rowData) => {
                return [
                  {
                    key: 'custom',
                    value: 'Trigger Webhook'
                  }
                ];
              },
              onRowAction: this.callWebhook
            }} />
        </StackingLayout>
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

