import React from "react";
import PropTypes from "prop-types";

import TextRenderer from "./internals/TextRenderer";

class Typewriter extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        backspace: PropTypes.bool,
        startDelay: PropTypes.number,
        speed: PropTypes.number
    };

    static defaultProps = {
        backspace: false,
        startDelay: 60,
        speed: 10
    };

    _animator = (nextChar, prevChar, prevData, index) => {
        const { startDelay, speed } = this.props;

        let transitionDuration = 60;
        let delay = startDelay;
        let start;
        let end;

        if (index === 0 || prevData === null) {
            start = delay;
            end = start + transitionDuration;
        } else {
            // Randomness to be configured by user?
            start = Math.floor(Math.random() * speed) + 5 + prevData.transitionStart;
            end = start + transitionDuration;
        }

        return {
            transitionStart: start,
            transitionEnd: end,
            transitionChar: nextChar,
            prevChar,
            nextChar
        };
    };

    render() {
        const {
            text,
            backspace
        } = this.props;

        const endText = backspace ? "" : text;
        const initText = backspace ? text : "";
        const order = backspace ? "reversed" : "normal";

        // Flip empty string on backspace?

        return (
            <TextRenderer
                preprocessor={ this._animator }
                initText={ initText }
                text={ endText }
                order={ order } />
        );
    }
}

export default Typewriter;
