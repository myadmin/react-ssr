import React from 'react';
import { Route, Link } from 'react-router-dom';
import Index from './Containers/Index';
import About from './Containers/About';
import User from './Containers/User';
import NotFound from './Containers/NotFound';
import './App.css';

// export default (
//     <>
//         <div>
//             <Link to="/">Index</Link>
//             &nbsp;
//             <Link to="/about">About</Link>
//         </div>
//         <Route path="/" exact component={Index} />
//         <Route path="/about" exact component={About} />
//     </>
// )

export default [
    {
        path: '/',
        component: Index,
        // loadData: Index.loadData,
        exact: true,
        key: 'index'
    },
    {
        path: '/about',
        component: About,
        exact: true,
        key: 'about'
    },
    {
        path: '/user',
        component: User,
        exact: true,
        key: 'user'
    },
    {
        component: NotFound,
        key: '404'
    }
]