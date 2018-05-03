import React from "react";
import PropTypes from "prop-types";
import { request } from "https";

class TextRenderer extends React.Component {
    static propTypes = {
        text: PropTypes.string,
        initText: PropTypes.string,
        order: PropTypes.string,
        preprocessor: PropTypes.func.isRequired,
        onCharacterTransition: PropTypes.func,
        static: PropTypes.bool,
        wrapBefore: PropTypes.func,
        wrapWhile: PropTypes.func,
        wrapAfter: PropTypes.func
    };

    static defaultProps = {
        text: "",
        initText: "",
        order: "normal",
        onCharacterTransition: null,
        static: false,
        wrapBefore: null,
        wrapWhile: null,
        wrapAfter: null
    };

    state = {
        components: null
    };

    defaultPreprocessor = () => {};

    _bootstrap = callback => {
        // callback: fn(nextChar, prevChar, nextFrame, prevFrame, index)
        const { text, initText } = this.props;
        const maxLength = Math.max(text.length, initText.length);

        let framesUsed = 0;
        let prevData = null;

        this._renderQueue = [];
        this._frames = 0;

        if (typeof text === "string") {
            for (let i = 0; i < maxLength; i++) {
                let j = i;
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
                this._renderQueue.push(prevData);
            }
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

    _updateTextChunk = (
        currentTransitionState,
        previousTransitionState,
        stringGroup,
        renderComponents,
        nextChar,
        index,
        force = 0
    ) => {
        if (index <= 0) {
            return nextChar;
        }

        if (currentTransitionState !== previousTransitionState || force === 1) {
            if (stringGroup.length > 0) {
                renderComponents.push(stringGroup);
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

            if (typeof onCharacterTransition === "function") {
                // The transition information is passed to the function that should
                // return the next character.
                nextCharacter = onCharacterTransition(iteration);
            } else {
                const { prevChar, nextChar, transitionChar } = iteration;

                if (this._frames < transitionStart) {
                    nextCharacter = prevChar;
                } else if (this._frames >= transitionStart && this._frames <= transitionEnd) {
                    nextCharacter = transitionChar;
                } else {
                    // Character completed transition
                    nextCharacter = nextChar;
                    totalProcessed++;
                }
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
                index === queueLength - 1 ? 1 : 0
            );

            transitionState = nextTransitionState;
        });

        this.setState({ components: renderComponents });
        this._frames++;
        this._animationID = requestAnimationFrame(this._updateFrame(totalProcessed));
    };

    componentDidMount() {
        const { preprocessor } = this.props;
    }

    render() {
        return this.state.components;
    }
}

export default TextRenderer;
