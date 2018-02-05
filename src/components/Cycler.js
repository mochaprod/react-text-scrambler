import React from "react";
import Scrambler from "./Scrambler";

class Cycler extends React.Component {
    constructor(props) {
        super(props);

        this.cycle = this.cycle.bind(this);
        this.updateHistory = this.updateHistory.bind(this);

        this.state = {
            cycling: true,
            renderText: "",
            previous: ""
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
                    iterate((iteration + 1) % cycleThis.length, cycleThis[iteration]);
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
        return array.reduce((accumulator, currentValue) => [...accumulator, currentValue, char], []);
    }

    componentDidMount() {
        this.cycle(this.props.duration);
    }

    render() {
        return (
            <Scrambler
                changeFrom={ this.state.previousText }
                humanLike={ this.props.humanLike }
                renderIn={ this.props.duration }>{ this.state.renderText }</Scrambler>
        );
    }
}

export default Cycler;
