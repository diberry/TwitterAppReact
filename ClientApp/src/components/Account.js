import React, { Component } from 'react';
import { AccountPane } from './AccountPane';
import { getAuthHeadersSilent } from './auth-utils/auth-config';
import axios from 'axios';

export class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingHandles: true,
            handles: []
        }
    }

    async componentDidMount() {
        const baseUrl = "https://mstwitterbot.azurewebsites.net/";
        let authHeaders = await getAuthHeadersSilent(this.props.msalConfig);
        let res = await axios.get(baseUrl + "api/get-user-twitter-accounts", authHeaders);

        this.setState({
            isLoadingHandles: false,
            handles: res.data
        });
    }

    loadingQueueDiv() {
        return (
            <div className="d-flex p-3 align-items-center border border-common rounded">
                <strong>Loading twitter accounts...</strong>
                <div className="spinner-border text-success ml-auto" role="status" aria-hidden="true"></div>
            </div>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 mb-3">
                    <h2 className="mb-3">Add new account</h2>
                    <p className="mb-3">
                        Add a new Twitter account to allow other users to request to post to the account, pending your approval.
                        Nothing will be posted to this account without your consent, and you can remove the
                        account at any time either in this app or via your Twitter application permissions. If you are
                        currently logged into Twitter, that account will automatically be authenticated.
                        Log out of Twitter or sign into a different account to add a different handle.
                    </p>

                    <button className="btn btn-dark">
                        <i className="fab fa-twitter fa-md twitter"></i> Sign in with Twitter
                    </button>
                </div>

                <div className="col-md-6 mb-3">
                    <h2 className="mb-3">Your Twitter accounts</h2>
                    <p className="mb-3">
                        These are your current Twitter accounts registered within this application. Click <b>Settings</b> next to
                        each handle to edit account settings. Configurable settings include enabling private account status, and account deletion.
                        If you designate an account as private, it only appears in your list of handles when composing a tweet.
                    </p>
                    {this.state.isLoadingHandles && this.loadingQueueDiv()}
                    <div className="list-group">
                        {
                            this.state.handles.map((handle, idx) => <AccountPane handle={handle} idx={idx} />)
                        }
                    </div>
                </div>
            </div>
        );
    }
}