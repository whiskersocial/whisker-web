import React from "react";
import axios from "axios";
import { API_BASE_URL, NUM_POSTS_PER_PAGE, postDateFormat } from "../utils.js";
import { Link } from "react-router-dom";
import "./Post.css";

class Post extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            author: "",
            id: "",
            date: new Date(),
            edit: new Date(),
            replies: [],
            tReplies: 0,
            curPage: 0,
            tPages: 0
        }
    }

    componentDidMount() {
        this.getData(this.props.match.params.postId, this);
        
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.getData(this.props.match.params.postId, this);
        }
    }
    
    getData(postId, thing) {
        thing.setState({id: postId});
        axios.get(API_BASE_URL + "/posts/" + postId)
        .then(function (res) {
            thing.setState({
                title: res.data.title,
                body: res.data.text,
                id: res.data._id,
                author:res.data.user,
                date: new Date(res.data.created_at),
                edit: new Date(res.data.updated_at)
            });
            thing.getReplies();
        })
        .catch(function (err) {
            alert("Sorry, we experienced an error fetching post data! Please try again later.");
            console.log(err);
        })
    }

    async getReplies() {
        try {
            const res = await axios.get(API_BASE_URL + "/posts/" + this.state.id + "/replies/" + this.state.curPage);
            let posts = [];
            res.data.posts.forEach(post => {
                posts.push({
                    _id: post._id,
                    title: post.title,
                    user: post.user,
                    date: new Date(post.created_at),
                    edit: new Date(post.updated_at)
                });
            })
            let tReplies = res.data.length;
            let tPages = res.data.pages;
            this.setState({replies: posts, tReplies: tReplies, tPages: tPages});
            this.forceUpdate();
        } catch (err) {
            alert("Something did something bad!");
            console.log(err);
        }
    }

    renderReplies() {
        if (!this.state.replies.length) {
            return (
                <h4>There are no replies to this post.</h4>
            )
        }

        let sPost = this.state.curPage * NUM_POSTS_PER_PAGE + 1;
        let ePost = (this.state.curPage + 1) * NUM_POSTS_PER_PAGE > this.state.tReplies ?
            this.state.tReplies :
            (this.state.curPage + 1) * NUM_POSTS_PER_PAGE;
        let viewString = this.state.tPages === 1 ?
            "Viewing all replies":
            "Viewing repl" + (sPost === ePost ?
                "y " + sPost :
                "ies " + sPost + "→" + ePost);

        return (
            <div className="replies" >
                <h5>{viewString}</h5>
                <h4 style={{display: "flex"}}>{this.renderReplyPages()}</h4>
                <h6 className="canClick" onClick={() => this.getReplies()}>Refresh replies</h6>
                {this.renderRepliesList()}
            </div>
        )
    }

    renderRepliesList() {
        return (
            this.state.replies.map((reply) => 
                <div className="reply" key={reply._id}>
                    <h4><Link to={"/post/" + reply._id} onClick={this.forceUpdate}>{reply.title}&nbsp;</Link></h4>
                    <h5>By: {reply.user} on {postDateFormat(reply.date, reply.edit)}</h5>
                </div>
            )
        )
    }

    renderReplyPages() {
        if (this.state.tPages === 1) {
            return (<div id="Empty div"></div>);
        }

        let numbers = Array.from(Array(this.state.tPages).keys());
        return(
            numbers.map((page) => {
                if (page === this.state.curPage) {
                    return (<div key={page}>{page + 1}&nbsp;</div>)
                }

                return (
                    <div className="canClick" key={page}
                        onClick={() => {
                            console.log(this.state);
                            // eslint-disable-next-line
                            this.state.curPage = page;
                            // I tried this.setState() but it didn't work, so...
                            console.log(this.state);
                            console.log(page+1)
                            this.getReplies();
                        }} >
                        {page + 1}&nbsp;
                    </div>
                )
            })
        )
    }

    render() {
        return (
            <div className="postContainer">
                <div className="post">
                    <h1>{this.state.title}</h1>
                    <p>{this.state.body}</p>
                    <hr />
                    <h3>By: {this.state.author} on {postDateFormat(this.state.date, this.state.edit)}</h3>
                </div>
                <hr />
                {this.renderReplies()}
            </div>
            
        );
    }
}

export default Post;