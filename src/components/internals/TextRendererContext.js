import React from "react";

/**
 * The context that is consumed by the `TextRenderer`. Empty callbacks
 * are passed down so that all `TextRenderer`s would have something to
 * call during their life-cycles.
 */
const contextShape = {
    // Gets called when the `TextRenderer` is mounted. This can also be
    // used to check for the existence of a `TextRenderer` down the
    // component tree.
    rendererDidMount: () => null,

    // Gets called when animation is complete.
    animationDidEnd: () => null
};

// The Provider is a main export so that the `TextRenderer` context API
// can be used.
const { Provider, Consumer } = React.createContext(contextShape);

/**
 * Applies the consumer of the `TextRenderer` context to a component.
 * Should only be used for the `TextRenderer` and nothing else!
 *
 * @param {function} Component a React Component.
 */
const withTextRendererContext = Component => props => (
    <Consumer>
        {
            value => (
                <Component
                    { ...props }
                    _SECRET_textRendererContext={ value } />
            )
        }
    </Consumer>
);

export {
    Provider,
    Consumer,
    withTextRendererContext,
    contextShape
};
