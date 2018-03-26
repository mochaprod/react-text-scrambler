import React from "react";
import PropTypes from "prop-types";
import Scrambler from "./Scrambler";

class Cycler extends React.Component {
    static propTypes = {
        strings: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        characters: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        humanLike: PropTypes.bool,
        duration: PropTypes.number,
        delay: PropTypes.number,
        startDelay: PropTypes.number,
        iterations: PropTypes.number,
        wrap: PropTypes.func,
        onIteration: PropTypes.func
    };

    static defaultProps = {
        strings: ["The Scrambler needs some strings!"],
        characters: "+/\\_-",
        humanLike: false,
        duration: 3000,
        delay: 1000,
        startDelay: 0,
        iterations: 0
    };

    state = {
        cycling: true,
        renderText: "",
        previousText: ""
    };

    constructor(props) {
        super(props);

        this.cycle = this.cycle.bind(this);
        this.cycling = true;
    }

    changeRenderText(text, previous) {
        this.setState({ renderText: text, previousText: previous });
    }

    cycle(time = 3000) {
        const { humanLike, strings, onIteration, iterations } = this.props;
        let cycleThis = strings;

        if (humanLike) {
            cycleThis = this.insertChar(strings);
        }

        const iterate = (total, iteration = 0, previous) => {
            if (typeof onIteration === "function") {
                onIteration(cycleThis[iteration], iteration);
            }

            if (iterations !== 0 && total >= iterations) {
                return;
            }

            return setTimeout(() => {
                if (this.state.cycling && this.cycling) {
                    this.changeRenderText(cycleThis[iteration], previous);
                    this.timeout = iterate(total + 1,
                        (iteration + 1) % cycleThis.length,
                        cycleThis[iteration]);
                }
            }, time);
        };

        this.changeRenderText(cycleThis[0]);
        this.timeout = iterate(0, 1, cycleThis[0]);
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

        this.cycling = true;
        this.cycle(duration + delay);
    }

    componentWillUnmount() {
        this.cycling = false;
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

export default Cycler;
