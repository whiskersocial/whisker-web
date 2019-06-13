import React from "react";
import axios from "axios";
import API_BASE_URL, { getCookie, getUserId } from "../utils.js";
import { setJWT } from "../utils";

class EditUser extends React.Component {
    constructor() {
        super();
        this.state = {user: "", pass: "", gotData: false};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    componentDidMount() {
        this.getUserData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.getUserData();
        }

        if (!this.state.gotData) {
            this.getUserData();
        }
    }

    getUserData() {
        let thing = this;
        axios.get(API_BASE_URL + "/userid/" + getUserId())
        .then(function (res) {
            thing.setState({
                user: res.data.user,
                gotData: true
            })
        })
        .catch(function (err) {
            console.log(err);
            if (err.response) {
                alert(err.response.data.error);
            } else if (err.request) {
                alert("Couldn't connect to server.");
            } else {
                alert("Generic error, check console for details.");
            }
        });
    }

    handleSubmit(event) {
        let thing = this;
        let params = {}
        if (this.state.user !== "") {
            params.user = this.state.user;
        }

        if (this.state.pass !== "") {
            params.pass = this.state.pass;
        }

        axios.patch(API_BASE_URL + "/users" + getUserId(), params, {
            headers: {
                "Authorization":" Bearer " + getCookie("jwt")
            }
        })
        .then(function (res) {
            setJWT(res.data.token);
            alert("Success!");
            thing.props.history.push("/user/" + res.data._id);
        })
        .catch(function (err) {
            console.log(err);
            if (err.response) {
                switch (err.response.data.error) {
                    case "Invalid authorization header.":
                    case "Token not provided":
                    case "Invalid token.":
                        alert("Invalid local credentials, please sign in again.");
                        thing.props.history.push("/login");
                        break;
                    default:
                        alert(err.response.data.error);
                }
            } else if (err.request) {
                alert("Couldn't connect to server.");
            } else {
                alert("Generic error, check console for details.");
            }
        });
        event.preventDefault();
    }

    handleUsernameChange(event) {                                    
        this.setState({user:event.target.value.toString()})
    }

    handlePasswordChange(event) {
        this.setState({pass:event.target.value.toString()})
    }
    
    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <h1>Edit user details</h1>
                    <input type="text"
                        placeholder="Username"
                        name="user"
                        onChange={this.handleUsernameChange}
                        value={this.state.user} />
                    <br />
                    <input type="password" placeholder="Password" name="pass" onChange={this.handlePasswordChange} />
                    <br/>
                    <input type="submit" value="Submit" />
                    <input type="button" value="Cancel" className="bDanger" onClick={this.props.history.goBack} />
                </form>
            </div>
        );
     
    }
}

export default EditUser;