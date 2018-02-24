import React from "react";

class Scrambler extends React.Component {
    constructor(props) {
        super(props);

        this.updateFrame = this.updateFrame.bind(this);

        this.state = {
            display: "",
            components: []
        };
    }

    startScrambling(renderIn, end, start) {
        this.queue = [];

        // This would be provided by a parent component "Cycler"
        const lastScrambled = start || "";
        const longer = lastScrambled.length > end.length ? lastScrambled.length : end.length;
        const maxFrames = 60 * (renderIn / 1000);

        for (let i = 0, lastStartFrame = 0, dec = maxFrames; i < longer; i++) {
            const frames = maxFrames / longer;
            const humanLikeTime = lastScrambled.length < end.length ? lastStartFrame + Math.floor(Math.random() * frames * 0.9) : dec - Math.floor(Math.random() * frames * 0.9);

            const oldCharacter = lastScrambled[i] || "";
            const newCharacter = end[i] || "";
            const startTransformation = this.props.humanLike ? humanLikeTime : Math.floor(Math.random() * 60);
            const endTransformation = Math.floor(Math.random() * 90) + startTransformation;

            dec = startTransformation;
            lastStartFrame = startTransformation;
            this.queue.push({ oldCharacter, newCharacter, startTransformation, endTransformation });
        }

        cancelAnimationFrame(this.renderFrame);
        this.updateFrame();
    }

    updateFrame() {
        let charactersProcessed = 0;
        let nextDisplay = "";
        let character;

        const renderComponents = [];
        let stringBuilder = "";
        let mode = false;

        this.queue = this.queue.map(process => {
            const { oldCharacter, newCharacter, startTransformation, endTransformation, scrambleChar } = process;
            const { humanLike } = this.props;

            let append = oldCharacter;
            let returnThis = process;

            if (humanLike && this.frame > startTransformation) {
                if (newCharacter === "") {
                    return process;
                }

                append = newCharacter;
            } else if (this.frame < startTransformation) {
                if (oldCharacter === "") {
                    return process;
                }

                append = oldCharacter;
            } else if (this.frame > endTransformation) {
                append = newCharacter;
                charactersProcessed++;
            } else if (scrambleChar) {
                append = scrambleChar;
            } else if (!humanLike && Math.random() < 0.05) {
                character = this.randomCharacter();
                append = character;

                returnThis = Object.assign({}, process, { scrambleChar: character });
            } else {
                append = oldCharacter;
            }

            nextDisplay += append;

            return returnThis;
        });

        this.setState({ display: nextDisplay });

        if (charactersProcessed < this.queue.length) {
            this.renderFrame = requestAnimationFrame(this.updateFrame);
            this.frame++;
        } else {
            // this.doneScrambling();
        }
    }

    doneScrambling() {
        const { onScrambleDone } = this.props;

        if (typeof onScrambleDone === "function") {
            onScrambleDone(this.state.display);
        }
    }

    randomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    componentWillReceiveProps(nextProps) {
        // If new text is passed (possibly from a setState in the parent component), restart scrambling.
        this.frame = 0;
        this.startScrambling(nextProps.renderIn, nextProps.children, nextProps.changeFrom);
    }

    componentDidMount() {
        const { renderIn, characters, children, text } = this.props;
        let scramble;

        if (typeof text === "string" && text !== "") {
            scramble = text;
        } else {
            scramble = typeof children === "string" ? children :
                "Component Scramble only takes a single string as a child!";
        }

        this.characters = characters || "+/\\_-";

        this.frame = 0;
        this.startScrambling(renderIn, scramble, "");
    }

    render() {
        return this.props.dev ? this.state.components : this.state.display;
    }
}

export default Scrambler;
