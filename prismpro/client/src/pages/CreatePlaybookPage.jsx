import React, { Component } from 'react';
import request_body from '../../playbook_request_body.json';


// Components
import {
    FlexLayout,
    StackingLayout,
    InputPlusLabel,
    Button,
    Title,
    Alert
} from 'prism-reactjs';

// Utils
import {
    basicFetch
} from '../utils/FetchUtils';



class CreatePlaybookPage extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.createPlaybook = this.createPlaybook.bind(this);
        this.state = {
            buttonEnable: false,
            playbookName: "",
            actionTriggerTypeUuid:"",
            showSuccessBanner: false,
        };
    }

    componentDidMount() {

    }

    modalErrorAlert = <Alert type="error" inline={true} message="Playbook not created" />;
    successAlert = <Alert type="success" inline={false} message="Playbook created successfully!" />;

    createPlaybook(event) {

        try {
            const r_body = {
                "entity_type": "trigger_type",
                "group_member_attributes": [
                  {
                    "attribute": "name"
                  },
                  {
                    "attribute": "display_name"
                  }
                ],
                "group_member_count": 20
              }
              

            const options = {
                method: 'POST',
                url: '/api/nutanix/v3/groups',
                data: JSON.stringify(r_body)
            }
            basicFetch(options)
                .then(res => {
                    console.log("response from groups", res)
                    this.setState({
                        actionTriggerTypeUuid: res.data.group_results[0].entity_results[1].entity_id
                    })

                    try {
                        event.preventDefault();
                        request_body.spec.resources.name = this.state.playbookName
                        request_body.spec.resources.trigger_list[0].action_trigger_type_reference.uuid = this.state.actionTriggerTypeUuid
                        console.log("req.body", request_body)
            
                        const options = {
                            method: 'POST',
                            url: '/api/nutanix/v3/action_rules',
                            data: JSON.stringify(request_body)
                        }
                        basicFetch(options)
                            .then(res => {
                                this.setState({
                                    playbookName: "",
                                    showSuccessBanner: true
                                })
                            })
                    } catch (err) {
                        console.log('error ', err)
                    }
                })
        } catch (err) {
            console.log('error ', err)
        }
       
    }

    handleChange(event) {
        this.setState(
            {
                buttonEnable: true,
                playbookName: event.target.value
            });
    }

    render() {
        return (
            <FlexLayout style={{ height: '300px' }} alignItems="center" justifyContent="center">
                {this.state.showSuccessBanner ? this.successAlert : null}
                <StackingLayout style={{ width: '280px' }} itemSpacing="30px">
                    <Title>Create Playbook</Title>
                    <StackingLayout>
                        <InputPlusLabel id="playbookname"
                            value={this.state.playbookName}
                            onChange={this.handleChange}
                            label="Playbook Name"
                            placeholder="Playbook Name" />
                    </StackingLayout>
                    <Button fullWidth
                        disabled={!this.state.buttonEnable}
                        onClick={this.createPlaybook}
                    >
                        Create Playbook
                    </Button>

                </StackingLayout>
            </FlexLayout>
        );
    }

}

export default CreatePlaybookPage;