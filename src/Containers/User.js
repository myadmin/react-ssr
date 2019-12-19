import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { getUserInfo } from '../Store/user';

function User(props) {
    useEffect(() => {
        // console.log('props.userinfo', props.userinfo);
        if (!props.userinfo.name) {
            props.getUserInfo();
        }
    }, []);

    return <Redirect to="/about" />

    return (
        <>
            <h1>Hello {props.userinfo.name}! 你们最棒的人是{props.userinfo.best}</h1>
        </>
    )
}

User.loadData = (store) => {
    return store.dispatch(getUserInfo())
};

export default connect(
    state => ({ userinfo: state.user.userinfo }),
    { getUserInfo }
)(User);