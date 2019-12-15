import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getClientStore } from '../src/Store/store';
import routes from '../src/App';
import Header from '../src/Components/Header';

const store = getClientStore();
const Page = (
    <Provider store={store}>
        <BrowserRouter>
            <Header />
            {routes.map(route => (
                <Route {...route} />
            ))}
        </BrowserRouter>
    </Provider>
);

ReactDOM.hydrate(
    Page,
    document.getElementById('root')
);