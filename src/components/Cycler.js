import React from "react";
import PropTypes from "prop-types";
import Scrambler from "./Scrambler";

class Cycler extends React.Component {
    constructor(props) {
        super(props);

        this.cycle = this.cycle.bind(this);

        this.state = {
            cycling: true,
            renderText: "",
            previousText: ""
        };
    }

    changeRenderText(text, previous) {
        this.setState({ renderText: text, previousText: previous });
    }

    cycle(time = 3000) {
        const { humanLike, strings, callback } = this.props;
        let cycleThis = strings;

        if (humanLike) {
            cycleThis = this.insertChar(strings);
        }

        const iterate = (iteration = 0, previous) => {
            if (typeof callback === "function") {
                callback(cycleThis[iteration], iteration);
            }

            return setTimeout(() => {
                this.changeRenderText(cycleThis[iteration], previous);

                if (this.state.cycling) {
                    this.timeout = iterate((iteration + 1) % cycleThis.length, cycleThis[iteration]);
                }
            }, time);
        };

        this.changeRenderText(cycleThis[0]);
        this.timeout = iterate(1, cycleThis[0]);
    }

    stop() {
        this.setState({ cycling: false });
        clearTimeout(this.timeout);
    }

    insertChar(array, char = "") {
        return array.reduce((accumulator, currentValue) =>
            [...accumulator, currentValue, char], []);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const filter = nextProps.strings.filter(str =>
            !this.props.strings.includes(str));

        // Update if the scrambled text changes.
        if (nextState.renderText !== this.state.renderText) {
            return true;
        }

        // If there are no new strings, then don't update
        if (filter.length === 0) {
            return false;
        }

        return true;
    }

    componentDidMount() {
        const { duration, delay } = this.props;

        this.cycle(duration + delay);
    }

    render() {
        return (
            <Scrambler
                wrap={ this.props.wrap }
                changeFrom={ this.state.previousText }
                humanLike={ this.props.humanLike }
                renderIn={ this.props.duration }
                text={ this.state.renderText } />
        );
    }
}

Cycler.defaultProps = {
    strings: ["The Scrambler needs some strings!"],
    characters: "+/\\_-",
    humanLike: false,
    duration: 3000,
    delay: 1000
};

Cycler.proptypes = {
    strings: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    characters: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    humanLike: PropTypes.bool,
    duration: PropTypes.number,
    delay: PropTypes.number
};

export default Cycler;
