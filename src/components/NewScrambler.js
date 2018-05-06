import React from "react";
import PropTypes from "prop-types";
import TextRenderer from "./TextRenderer";

/**
 * The 'NewScrambler' will replace the current 'Scrambler' component.
 * The internals of the current Scrambler was split since it simply did
 * too much on its own and did not allow for a more wide range of animations.
 *
 * With the newly introduced "preprocessing" function for the TextRenderer,
 * responsibility can be clearly separated between components. This also allows
 * for more maintainable and cleaner code.
 */
class NewScrambler extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string,
        prevText: PropTypes.string
    };

    static defaultProps = {
        text: "",
        prevText: ""
    };

    _range = (upper = 100) =>
        Math.floor(Math.random() * upper);

    scramblerPreprocessor = (nextChar, prevChar, prevData, index) => {
        // Every transition occurs at least 60 frames after the animation begins.
        // Each transition lasts exactly 60 frames.
        const randomFrame = this._range(200);

        return {
            transitionStart: 60 + randomFrame,
            transitionEnd: 120 + randomFrame,
            nextChar,
            prevChar,
            transitionChar: "+"
        };
    };

    render() {
        const { text, prevText } = this.props;

        return (
            <TextRenderer
                text={ text }
                initText={ prevText }
                preprocessor={ this.scramblerPreprocessor } />
        );
    }
}

export default NewScrambler;
