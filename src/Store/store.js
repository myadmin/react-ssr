import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import indexReducer from './index';
import getUserReducer from './user';

const reducer = combineReducers({
    index: indexReducer,
    user: getUserReducer
});

const serverAxios = axios.create({
    baseURL: 'http://localhost:9093/'
});

const clientAxios = axios.create({
    baseURL: '/'
});

//create store
// const store = createStore(reducer, applyMiddleware(thunk));

// export default store;

// 服务端数据
export const getServerStore = () => {
    return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios)));
};

// 客户端数据 
export const getClientStore = () => {
    const defaultState = window.__context ? window.__context : {};
    return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)));
}