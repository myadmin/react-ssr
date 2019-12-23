import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getIndexList } from '../Store/index';
import withStyle from '../withStyle';
import styles from './Index.css';

function Index(props) {
    const [count, setCount] = useState(1);

    useEffect(() => {
        if (!props.list.length) {
            props.getIndexList()
        }
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hello {props.title}! {count}</h1>
            <button onClick={() => setCount(count + 1)}>累加</button>
            <hr />
            <ul>
                {
                    props.list.map(v => {
                        return <li key={v.id}>{v.name}</li>
                    })
                }
            </ul>
        </div>
    )
}

Index.loadData = (store) => {
    return store.dispatch(getIndexList())
};

export default connect(
    state => ({ list: state.index.list }),
    { getIndexList }
)(withStyle(Index, styles));