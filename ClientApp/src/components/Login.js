import React, { Component } from 'react';
import { login } from './auth-utils/auth-config'

export class Login extends Component {
    componentDidMount() {
        window.history.replaceState(null, "Login", "/")
    }
    
    async loginClickHandler() {
        let user = await login(this.props.msalConfig);
        console.log(user);
        if (user != null) {
            this.props.updateAuthState(user.name);
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center login-container">
                    <div className="col-md-6 text-center">
                        <button type="button" className="btn btn-outline-secondary" onClick={() => this.loginClickHandler()}>
                            <i className="fab fa-microsoft fa-2x align-middle"></i>
                            <span className="align-middle ml-2">Microsoft employee sign in</span>
                        </button>
                    </div>

                </div>
                <div className="row justify-content-center login-container">
                        <p>There's a known issue with new users getting an "admin approval" required message. If you're seeing this error, please reach out to the dev team directly at twitterapp@microsoft.com for a temporary workaround while MSIT resolves the issue.</p>
                    </div>
            </div>
        );
    }
}
