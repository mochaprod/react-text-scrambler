import React from "react";

class Cycler extends React.Component {
    constructor(props) {
        super(props);

        this.cycle = this.cycle.bind(this);
        this.updateHistory = this.updateHistory.bind(this);

        this.state = {
            cycling: true,
            renderText: ""
        };
    }

    changeRenderText(text) {
        this.setState({ renderText: text });
    }

    cycle(time = 3000) {
        this.history = [];
        const { humanLike, strings, callback } = this.props;
        let cycleThis = strings;

        if (humanLike) {
            cycleThis = this.insertChar(strings);
        }

        const iterate = (iteration = 0) => {
            if (typeof callback === "function") {
                callback(cycleThis[iteration], iteration);
            }

            return setTimeout(() => {
                this.updateHistory(cycleThis[iteration]);
                this.changeRenderText(cycleThis[iteration]);

                if (this.state.cycling) {
                    iterate((iteration + 1) % cycleThis.length);
                }
            }, time);
        };

        this.updateHistory(cycleThis[0]);
        this.changeRenderText(cycleThis[0]);
        this.timeout = iterate(1);
    }

    stop() {
        this.setState({ cycling: false });
        clearTimeout(this.timeout);
    }

    insertChar(array, char = "") {
        return array.reduce((accumulator, currentValue) => [...accumulator, currentValue, ""], []);
    }

    updateHistory(text) {
        if (!this.history) {
            this.history = [];
        }

        this.history.push(text);
    }

    componentDidMount() {
        this.cycle(this.props.duration);
    }

    render() {
        const lastScrambled = this.history ? this.history.pop() : "";

        return (
            <Scramble
                changeFrom={ lastScrambled }
                humanLike={ this.props.humanLike }
                renderIn={ this.props.duration }>{ this.state.renderText }</Scramble>
        );
    }
}
