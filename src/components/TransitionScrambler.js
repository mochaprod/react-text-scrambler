import React from "react";
import PropTypes from "prop-types";

import TextRenderer from "./internals/TextRenderer";

/**
 * A scrambler that changes transition characters every 10 (or props) frames.
 */
class TransitionScrambler extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        prevText: PropTypes.string,
        characters: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.string
        ]),
        transitionStart: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.func
        ]),
        transitionDuration: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.func
        ]),
        characterLifetime: PropTypes.number,
        onCharacterLifetimeEnd: PropTypes.func
    };

    static defaultProps = {
        prevText: "",
        characters: "!@#$%^&*()-=_+",
        transitionStart: 60,
        transitionDuration: 120,
        characterLifetime: 10,
        onCharacterLifetimeEnd: null
    };

    _range = (upper = 100) =>
        Math.floor(Math.random() * upper);

    _defaultOnCharacterLifetimeEnd = (frames, characters) =>
        characters[this._range(characters.length)];

    _animator = (nextChar, prevChar, prevData, index) => {
        const { transitionStart, transitionDuration } = this.props;

        let start = typeof transitionStart === "function" ?
            transitionStart(index) :
            transitionStart;

        let duration = typeof transitionDuration === "function" ?
            transitionDuration(index) :
            transitionDuration;

        return {
            transitionStart: start,
            transitionEnd: start + duration,
            transitionChar: "*",
            nextChar,
            prevChar
        };
    };

    _onCharacterTransition = (frames, iteration, index) => {
        const {
            transitionStart,
            transitionEnd,
            prevChar,
            nextChar
        } = iteration;

        if (frames < transitionStart) {
            return prevChar;
        } else if (frames >= transitionStart && frames <= transitionEnd) {
            if (!(index in this._framesPerIndex) ||
                this._framesPerIndex[index] >= this.props.characterLifetime) {
                // Get the next character that will replace the current character.
                let fn = typeof this.props.onCharacterLifetimeEnd === "function" ?
                    this.props.onCharacterLifetimeEnd :
                    this._defaultOnCharacterLifetimeEnd;

                this._framesPerIndex[index] = 0;
                this._indexTransitionChar[index] = fn(frames, this.props.characters, index);
            } else {
                this._framesPerIndex[index]++;
            }

            return this._indexTransitionChar[index];
        } else {
            return nextChar;
        }
    };

    componentDidMount() {
        // Current frames of each character.
        this._framesPerIndex = {};

        // Saves all the characters for the duration of the interval.
        this._indexTransitionChar = {};
    }

    render() {
        return (
            <TextRenderer
                initText={ this.props.prevText }
                text={ this.props.text }
                preprocessor={ this._animator }
                onCharacterTransition={ this._onCharacterTransition } />
        );
    }
}

export default TransitionScrambler;
