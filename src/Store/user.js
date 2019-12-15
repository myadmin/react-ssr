import axios from 'axios';

const GET_INFO = 'USER/USER_INFO';

const defaultState = {
    userinfo: {}
};

const changeUserInfo = userinfo => ({
    type: GET_INFO,
    userinfo
});

export const getUserInfo = server => {
    return async (dispatch, getState, axiosInstance) => {
        const res = await axios.get('http://localhost:9527/api/user/info');
        const { userinfo } = res.data;
        // console.log('userinfo', userinfo);
        return dispatch(changeUserInfo(userinfo));
    }
}

export default (state = defaultState, action) => {
    switch(action.type) {
        case GET_INFO:
            const newState = {
                ...state,
                userinfo: action.userinfo
            };
            return newState;
        default:
            return state;
    }
}