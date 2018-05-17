import React from "react";
import PropTypes from "prop-types";

import TextRenderer from "./internals/TextRenderer";

class SimpleScrambler extends React.Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        initialCharacter: PropTypes.string,
        durationRange: PropTypes.number,
        preserveSpaces: PropTypes.bool
    };

    static defaultProps = {
        initialCharacter: "-",
        durationRange: 60,
        preserveSpaces: true
    };

    _computePrevText = text => {
        const newString = [];
        const len = text.length;
        let i = 0;

        while (i++ < len) {
            newString.push(this.props.initialCharacter);
        }

        return newString.join("");
    };

    _range = (limit = 100) =>
        Math.floor(Math.random() * limit);

    _animator = (nextChar, prevChar, prevData, index) => {
        const { preserveSpaces: spaces, durationRange } = this.props;

        const duration = this._range(durationRange);
        const theRealPrevChar = prevChar === " " || nextChar === " " ?
            " " : prevChar;

        return {
            transitionStart: 60 + duration,
            transitionEnd: 60 + duration,
            transitionChar: spaces ? theRealPrevChar : prevChar,
            prevChar: spaces ? theRealPrevChar : prevChar,
            nextChar
        };
    };

    render() {
        const {
            text
        } = this.props;
        const prevText = this._computePrevText(text);

        return (
            <TextRenderer
                text={ text }
                initText={ prevText }
                preprocessor={ this._animator } />
        );
    }
}

export default SimpleScrambler;
