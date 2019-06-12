import React from "react";
import axios from "axios";
import { API_BASE_URL, getCookie } from "../utils.js";
import { Redirect } from "react-router-dom";

class MakePost extends React.Component {
    constructor() {
        super();
        this.state = {title: "", body: "", reply_to: "", parent_title: "", redirect: false, id: ""};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleBodyChange = this.handleBodyChange.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.postId) {
            this.setState({reply_to: this.props.match.params.postId});
        }

        if (this.state.reply_to) {
            this.getParentName();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.match.params.postId) {
            this.setState({reply_to: this.props.match.params.postId});
        }

        if (this.state.reply_to) {
            this.getParentName();
        }
    }

    async getParentName() {
        let parent = await axios.get(API_BASE_URL + "/posts/" + this.state.reply_to);
        this.setState({parent_title: parent.data.title});
    }

    handleSubmit(event) {
        if (this.state.title === "" || this.state.body === "") {
            alert("You need a title and post body.");
            return 1;
        }
        let thing = this;

        let apiURL = API_BASE_URL + "/posts";
        if (this.state.reply_to) {
            apiURL +="/" + this.state.reply_to;
        }

        axios.post(apiURL, {
            title: this.state.title,
            text: this.state.body
        }, {
            headers: {
                "x-auth-token": "Bearer " + getCookie("jwt")
            }
        })
        .then(function (res) {
            thing.setState({redirect: true, id: res.data.id});
        })
        .catch(function (err) {
            alert("Sorry, we experienced an error! Please try again later.");
            console.log(err);
        })
        event.preventDefault();
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value.toString()});
    }

    handleBodyChange(event) {
        this.setState({body: event.target.value.toString()});
    }

    renderRedirect() {
        if (this.state.redirect) {
            let post = "/post/" + this.state.id;
            return <Redirect to={post} />
        }
    }

    render() {
        let viewString = this.state.reply_to ?
            "Reply to \"" + this.state.parent_title + '"':
            "New post";

        return (
        <div className="container">
            <form onSubmit={this.handleSubmit}>
                <h1>{viewString}</h1>
                <input type="text" placeholder="Title" name="title" onChange={this.handleTitleChange} />
                <br />
                <input type="text" placeholder="Text" name="body" onChange={this.handleBodyChange} />
                <br/>
                <input type="submit" value="Submit" />
                {this.renderRedirect()}
            </form>
        </div>
        );
    }
}

export default MakePost;