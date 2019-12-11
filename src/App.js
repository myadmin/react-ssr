import React from 'react';
import { Route, Link } from 'react-router-dom';
import Index from './Containers/Index';
import About from './Containers/About';

export default (
    <>
        <div>
            <Link to="/">Index</Link>
            &nbsp;
            <Link to="/about">About</Link>
        </div>
        <Route path="/" exact component={Index} />
        <Route path="/about" exact component={About} />
    </>
)