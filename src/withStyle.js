import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function withStyle(WrappedComponent, styles) {
    // return function (props) {
    //     if (props.staticContext) {
    //         props.staticContext.css.push(styles._getCss());
    //     }
    //     return <WrappedComponent {...props}/>
    // }
    class Enhance extends React.Component {
        render () {
            if (this.props.staticContext) {
                this.props.staticContext.css.push(styles._getCss());
            }
            return <WrappedComponent {...this.props}/>
        }
    }

    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
}

export default withStyle;