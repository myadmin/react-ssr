import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/Store/store';
import App from '../src/App';


const Page = (
    <Provider store={store}>
        <BrowserRouter>
            {App}
        </BrowserRouter>
    </Provider>
);

ReactDOM.hydrate(
    Page,
    document.getElementById('root')
);