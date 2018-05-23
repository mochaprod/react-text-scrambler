import React from "react";

/**
 * The context that is consumed by the `TextRenderer`.
 */
const contextShape = {
    onTextRendererMount: () => {},
    onAnimationEnd: () => {}
};

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
    withTextRendererContext
};
