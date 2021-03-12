import React, { Component } from 'react';
import 'react-slidedown/lib/slidedown.css';
import { TemplateModal } from './template-components/TemplateModal'
import { TemplateListItem } from './template-components/TemplateListItem'
import { getTemplatesByHandleByUser, saveTemplate, updateTemplate, deleteTemplate, getTemplatesAll } from './utils/database-utils'
import { DISPLAY_TYPE_ENUM, TEMPLATE_SEARCH_TYPE } from './utils/enums'
import { Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as QueryString from "query-string"


/**
 * Templates only work by TwitterHandle
 */
export class Templates extends Component {
    constructor(props) {
        super(props);

        this.setList = this.setList.bind(this);
        this.saveTemplate = this.saveTemplate.bind(this);
        this.deleteTemplate = this.deleteTemplate.bind(this);
        this.toggleModal = this.toggleModal.bind(this);

        let twitterHandle = "",
            error = "";

        const params = QueryString.parse(props.location.search);

        // Get twitterHandle from AccountPane Link state
        if (props &&
            props.location &&
            props.location.state &&
            props.location.state.twitterHandle) {
            twitterHandle = props.location.state.twitterHandle;

        } else if (params.all) {
            twitterHandle = "*"
        } else {
            error = "twitterHandle isn't found. ";
        }

        // Default values for new template with defaults
        // Some of these values aren't currently used
        const newTemplate = {
            Id: null,
            TwitterHandle: twitterHandle, // posted with tweet handle 
            TweetUser: "", // tweet creator
            HandleUser: "", // tweet approver
            Title: "Your new title",
            ChangedThresholdPercentage: 100,
            Channel: "twitter",
            CodeChanges: 0,
            External: 0,
            NewFiles: 1,
            IgnoreMetadataOnly: 1,
            SearchType: TEMPLATE_SEARCH_TYPE.GLOB_PATH,
            SearchBy: "/articles/azure-functions",
            ForceNotifyTag: "#Notify",
            QueryString: `WT.mc_id=${twitterHandle}-`,
            Rss: "",
            TemplateText: "New updates for {ms.service} [{title}]({filename})"
        };


        this.state = {
            name: "template",
            msalConfig: props.msalConfig,
            twitterHandle: twitterHandle,
            isLoading: true,
            list: [],
            newTemplate: newTemplate,
            modalIsOpen: false,
            displayType: DISPLAY_TYPE_ENUM.READ_ONLY,
            currentTemplate: newTemplate,
            error: error
        }

    }
    async componentDidMount() {
        if (!this.state.error) {
            this.loadTemplates(this.state.msalConfig, this.state.twitterHandle)
        }
    }
    // call database
    async loadTemplates(msalConfig, twitterHandle) {

        // get twitterHandle templates
        if (twitterHandle != "*") {
            const list = await getTemplatesByHandleByUser(msalConfig, twitterHandle);
            this.setList(list);
        } else {
            
            // get all templates
            const list = await getTemplatesAll(msalConfig);
            this.setList(list);
        }
    }
    async setList(list) {
        console.log("template.js::setList");
        this.setState({
            list: list,
            isLoading: false
        });
    }


    // new and update
    async saveTemplate(template) {

        let newList = [];

        if (template.Id != null) {
            newList = await updateTemplate(this.props.msalConfig, template);
        } else {
            newList = await saveTemplate(this.props.msalConfig, template);
        }
        this.setList(newList);

        this.setState({
            modalIsOpen: false,
            currentTemplate: null
        })
    }

    // delete
    async deleteTemplate(id, twitterHandle) {
        const updatedList = await deleteTemplate(this.props.msalConfig, id, twitterHandle);
        this.setList(updatedList);
        this.setState({
            modalIsOpen: false,
            currentTemplate: null
        })
    }
    // open or close modal for new and update 
    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
    }
    renderModalExistingTemplate(template) {
        this.setState({
            currentTemplate: template,
            modalIsOpen: true,
            displayType: DISPLAY_TYPE_ENUM.EDIT
        });
    }
    renderModalNewTemplate() {
        this.setState({
            currentTemplate: this.state.newTemplate,
            modalIsOpen: true,
            displayType: DISPLAY_TYPE_ENUM.NEW
        });
    }

    renderLoading() {
        return (
            <div className="d-flex p-3 align-items-left border border-common rounded">
                <strong>Loading templates...</strong>
                <div className="spinner-border text-success ml-auto" role="status" aria-hidden="true"></div>
            </div>
        );
    }
    renderTemplates() {

        if (this.state.list && this.state.list.length > 0) {
            return (
                <div className="templates-list">
                    {this.state.list.map((template, index) =>
                        <TemplateListItem
                            displayType={DISPLAY_TYPE_ENUM.EDIT}
                            renderModal={(index) => this.renderModalExistingTemplate(index)}
                            msalConfig={this.props.msalConfig}
                            template={template}
                            idx={index}
                            key={index}
                            modalTitle={`${this.state.twitterHandle} template ${this.state.twitterHandle.Id}`}
                            deleteTemplate={this.deleteTemplate}
                            saveTemplate={this.saveTemplate}
                        />
                    )}
                </div>
            )
        }
    }

    render() {

        const tableName = `Templates for ${this.state.twitterHandle}`

        if (this.state.error) {
            return (<div>{this.state.error}</div>)
        } else {
            
            if (this.state.twitterHandle = "*") {
                return (
                    <div>{JSON.stringify(this.state.list)}</div>
                )
            } else {
                return (

                    < div >
                        <Row >
                            <div className="col-md-12 mb-3">
                                <Col className="text-left"><button className="btn btn-success my-auto" onClick={() => this.renderModalNewTemplate()}>Create new template for {this.state.twitterHandle}</button></Col>
                            </div>
                        </Row>
                        <Row>
                            <div className="col-md-12 mb-3">
                                {this.state.isLoading
                                    ? this.renderLoading()
                                    : this.renderTemplates()}
                            </div>
                        </Row>
                        <TemplateModal
                            displayType={this.state.displayType}
                            template={this.state.currentTemplate}
                            key={`templateModal`}
                            deleteTemplate={this.deleteTemplate}
                            saveTemplate={this.saveTemplate}
                            toggleModal={this.toggleModal}
                            modalIsOpen={this.state.modalIsOpen}
                        />

                    </div >

                )
            }
        }


    }
}