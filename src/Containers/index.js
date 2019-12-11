import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getIndexList } from '../Store/index';

function Index(props) {
    const [count, setCount] = useState(1);

    useEffect(() => {
        props.getIndexList()
    }, []);

    return (
        <>
            <h1>Hello {props.title}! {count}</h1>
            <button onClick={() => setCount(count + 1)}>累加</button>
            <hr />
            <ul>
                {
                    props.list.map(v => {
                        return <li key={v.id}>{v.name}</li>
                    })
                }
            </ul>
        </>
    )
}

export default connect(
    state => ({ list: state.index.list }),
    { getIndexList }
)(Index);