import React, { Component } from 'react';
import { getFile } from 'blockstack';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import InfiniteScroll from './InfiniteScroll';
import { mergeSort } from '../utils/reverseMergeSort.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Post from '../model/post';

class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allPosts: {},
            isLoading: false,
            order: [],
            noPosts: false,
            counter: 0,
            doneLoading: false,
            followInfo: []
        }
    }

    fetchRadiksPostsFromFriends = async () => {
        let postTimes = this.state.order;
        let postIDAndName = this.state.allPosts;
        let counter = this.state.counter;
        let friends = this.state.followInfo
        if (counter < friends.length) {
            let postsMadeByUser = await Post.fetchList({ username: friends[counter], }, { decrypt: true })
            if (postsMadeByUser.length > 0) {
                const time = Date.now() - (1000 * 60 * 60 * 24 * 7);
                for (let i = 0; i < postsMadeByUser.length; i++) {
                    //the if statement makes sure to only fetch post that are not older than one week
                    if (postsMadeByUser[i].attrs.createdAt > time) {
                        postIDAndName[`${postsMadeByUser[i].attrs.createdAt}`] = [friends[counter], postsMadeByUser[i]._id];
                        postTimes.push(postsMadeByUser[i].attrs.createdAt)
                    } else {
                        this.setState({
                            counter: this.state.counter + 1,
                            order: postTimes,
                            allPosts: postIDAndName
                        })
                        this.fetchRadiksPostsFromFriends()
                    }
                }
                this.setState({
                    counter: this.state.counter + 1
                })
                this.fetchRadiksPostsFromFriends()
            } else {
                this.setState({
                    counter: this.state.counter + 1
                })
                this.fetchRadiksPostsFromFriends()
            }

        } else {
            this.props.addToCurrentUserFeed(mergeSort(this.state.order), this.state.allPosts);
            this.setState({ order: mergeSort(this.state.order), isLoading: false, noPosts: postTimes.length === 0 ? true : false, doneLoading: true });
        }
    }

    async componentDidMount() {
        //1000 * 60 * 5 equals 5 minutes, so if the usercomes back to the feed component after 5 minutes we fetch the latest posts again
        // const friendsInfo = await FollowInfo.fetchOwnList({});
        // const friends = _.head(friendsInfo).attrs.following
        // friends.push(this.props.curUserInfo.username)
        // this.setState({ followInfo: friends })
        // if (!this.props.curUserFeed.loaded || this.props.curUserFeed.lastFetch + 1000 * 60 * 5 < Date.now() || this.props.curUserFeed.lastFetch < this.props.curUserOwnPosts.lastFetch) {
        //     this.setState({ isLoading: true })
        //     // this.fetchPostsFromFriends()
        //     this.fetchRadiksPostsFromFriends()
        // }
    }


    render() {

        return (
            <div className='comments-container'>
                <hr/>
                <Row>
                    <Col md={1} xl={2}></Col>
                    <Col sm={12} md={10} xl={8}>
                        {/* {this.state.isLoading && <div><div className='feed-loader'><div className='hollowLoader'>
                            <div className='largeBox'></div>
                            <div className='smallBox'></div>
                        </div></div><ProgressBar className='prog-bar' striped variant="success" now={now} /><p>Loaded {this.state.counter} of {this.props.curUserInfo.friends.length} friends.</p></div>}
                        {this.state.noPosts && !this.state.isLoading && <h1>Oepsie, you have no posts in your timeline yet</h1>}
                        {!this.state.noPosts && !this.state.isLoading &&
                            <InfiniteScroll order={this.props.curUserFeed.postIDs} postIdAndName={this.props.curUserFeed.postIDAndName} doneLoading={this.props.curUserFeed.loaded} />
                        } */}
                        <p>just testing</p>
                    </Col>
                    <Col md={1} xl={2}></Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    
}, dispatch);

const mapStateToProps = (state) => {
    return ({
        curUserInfo: state.curuserInfo
    })
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Comments));