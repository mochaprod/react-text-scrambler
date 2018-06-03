import React from "react";
import PropTypes from "prop-types";

import {
    withTextRendererContext,
    contextShape
} from "./TextRendererContext";

/**
 * The component that interfaces animation definitions and rendering.
 *
 * Animation frames are defined by a callback passed through the `preprocessor`
 * prop.
 *
 * The `TextRenderer` is exported using the `withTextRendererContext` higher-order
 * component to gain access to the secret context that allows components like the
 * `Cycler` up the component tree to manipulate the `TextRenderer` API.
 */
class TextRenderer extends React.Component {
    static propTypes = {
        // Resulting text of the animation.
        text: PropTypes.string,

        // Initial text of the animation; this text "becomes" the new text.
        initText: PropTypes.string,

        // The order in which characters are processed during the preprocessing step.
        order: PropTypes.string,

        // A callback that returns an object containing the parameters of each
        // character's animation.
        preprocessor: PropTypes.func.isRequired,

        // A callback function that is called on each frame update to determine
        // what character should be rendered.
        onCharacterTransition: PropTypes.func,

        // Just render the new text.
        static: PropTypes.bool,

        wrapBefore: PropTypes.func,
        wrapWhile: PropTypes.func,
        wrapAfter: PropTypes.func,

        // A function that is called when animation is complete.
        animationDidEnd: PropTypes.func,

        // Used internally. Don't mess with this!
        _SECRET_textRendererContext: PropTypes.object
    };

    static defaultProps = {
        text: "",
        initText: "",
        order: "normal",
        onCharacterTransition: null,
        static: false,
        wrapBefore: null,
        wrapWhile: null,
        wrapAfter: null,

        animationDidEnd: () => null,

        _SECRET_textRendererContext: contextShape
    };

    state = {
        components: null
    };

    defaultCharacterTransitionerThing = (
        frames,
        {
            transitionStart,
            transitionEnd,
            prevChar,
            nextChar,
            transitionChar
        }
    ) => {
        if (frames < transitionStart) {
            return prevChar;
        } else if (frames >= transitionStart && frames <= transitionEnd) {
            return transitionChar;
        } else {
            return nextChar;
        }
    };

    __getInternalContext = () =>
        this.props._SECRET_textRendererContext;

    _bootstrap = callback => {
        // callback: fn(nextChar, prevChar, nextFrame, prevFrame, index)
        const { text, initText, order } = this.props;
        const maxLength = Math.max(text.length, initText.length);
        const op = order === "normal" ? "push" : "unshift";

        // The parameters for the previous iteration/character is passed into the current
        // iteration so that frames and other parameters can be determined relatively.
        let prevData = null;

        this._renderQueue = [];
        this._frames = 0;
        this._active = true;

        if (typeof text === "string") {
            for (let i = 0; i < maxLength; i++) {
                let j = order === "normal" ? i : maxLength - i - 1;
                let init = initText[j] || "";
                let after = text[j] || "";

                prevData = {
                    transitionStart: 0,
                    transitionEnd: 0,
                    transitionChar: init,
                    prevChar: init,
                    nextChar: after,
                    ...callback(
                        after,
                        init,
                        prevData,
                        i
                    )
                };

                // All the work will be done via the preprocessor.
                // Pushes when in normal order and unshifts otherwise.
                this._renderQueue[op](prevData);
            }

            // Consider it mounted when the render queue is finished
            // being prepared.
            this.__getInternalContext().rendererDidMount(this.props);
            this._updateFrame()();
        } else {
            // We abort animation; just switch to `static` mode
        }
    };

    _getTransitionState = (start, end, current) => {
        if (current >= start && current <= end) {
            return 1;
        } else if (current >= start && current >= end) {
            return 2;
        } else {
            return 0;
        }
    };

    _getWrappingComponent = transitionState => {
        switch (transitionState) {
            case 0:
                return this.props.wrapBefore;
            case 1:
                return this.props.wrapWhile;
            case 2:
                return this.props.wrapAfter;
            default:
                return null;
        }
    };

    _updateTextChunk = (
        currentTransitionState,
        previousTransitionState,
        stringGroup = "",
        renderComponents,
        nextChar,
        index,
        force = false
    ) => {
        if (index <= 0) {
            return nextChar;
        }

        if (currentTransitionState !== previousTransitionState || force === true) {
            if (force === true) {
                stringGroup += nextChar;
            }

            if (stringGroup.length > 0) {
                let External = this._getWrappingComponent(currentTransitionState);

                if (External !== null) {
                    renderComponents.push(
                        <External key={ index }>{ stringGroup }</External>
                    );
                } else {
                    renderComponents.push(stringGroup);
                }
            }

            return nextChar;
        } else {
            return stringGroup + nextChar;
        }
    };

    _updateFrame = (charactersProcessed = 0) => () => {
        const queueLength = this._renderQueue.length;

        // The amount of characters done processing is notified
        // by the previous frame.
        if (charactersProcessed >= queueLength) {
            if (this._animationID) {
                cancelAnimationFrame(this._animationID);
            }

            // Animation complete; call subscription.
            this.props.animationDidEnd();
            this.__getInternalContext().animationDidEnd(this.props);

            this._active = false;

            return;
        }

        const { onCharacterTransition } = this.props;
        const renderComponents = [];
        let stringGroup;

        // 0: before, 1: while, 2: after
        let transitionState = 0;
        let nextTransitionState;
        let nextCharacter;
        let totalProcessed = 0;

        this._renderQueue.forEach((iteration, index) => {
            const { transitionStart, transitionEnd } = iteration;
            let call;

            call = typeof onCharacterTransition === "function" ?
                onCharacterTransition :
                this.defaultCharacterTransitionerThing;

            nextCharacter = call(this._frames, iteration, index);

            if (this._frames > transitionStart && this._frames > transitionEnd) {
                totalProcessed++;
            }

            // Determine if stringGroup should be appended
            // to the render components.
            nextTransitionState = this._getTransitionState(transitionStart, transitionEnd, this._frames);
            stringGroup = this._updateTextChunk(
                transitionState,
                nextTransitionState,
                stringGroup,
                renderComponents,
                nextCharacter,
                index,
                index === queueLength - 1
            );

            transitionState = nextTransitionState;
        });

        // If component was unmounted the state will not be updated.
        if (this._active === true) {
            this.setState({ components: renderComponents });
            this._frames++;
            this._animationID = requestAnimationFrame(this._updateFrame(totalProcessed));
        }
    };

    componentDidMount() {
        if (!this.props.static) {
            this._bootstrap(this.props.preprocessor);
        }
    }

    componentWillUnmount() {
        this._active = false;
    }

    render() {
        return this.props.static ?
            this.props.text :
            this.state.components;
    }
}

export default withTextRendererContext(TextRenderer);
