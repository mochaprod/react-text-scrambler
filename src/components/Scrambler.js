import React from "react";

class Scrambler extends React.Component {
    constructor(props) {
        super(props);

        this.updateFrame = this.updateFrame.bind(this);

        this.state = {
            display: ""
        };
    }

    startScrambling(renderIn) {
        this.queue = [];

        // This would be provided by a parent component "Cycler"
        const lastScrambled = this.props.changeFrom || "";
        const longer = lastScrambled.length > this.scramble.length ? lastScrambled.length : this.scramble.length;
        const maxFrames = (60 * (renderIn / 1000)) - 10;

        for (let i = 0, lastStartFrame = 0, dec = maxFrames; i < longer; i++) {
            const frames = maxFrames / longer;
            const humanLikeTime = lastScrambled.length < this.scramble.length ? lastStartFrame + Math.floor(Math.random() * frames * 0.9) : dec - Math.floor(Math.random() * frames * 0.9);

            const oldCharacter = lastScrambled[i] || "";
            const newCharacter = this.scramble[i] || "";
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

        this.queue = this.queue.map(process => {
            const { oldCharacter, newCharacter, startTransformation, endTransformation, scrambleChar } = process;
            const { humanLike } = this.props;

            if (humanLike && this.frame > startTransformation) {
                nextDisplay += newCharacter;
                return process;
            }

            if (this.frame < startTransformation) {
                nextDisplay += oldCharacter;

                return process;
            }

            if (this.frame > endTransformation) {
                nextDisplay += newCharacter;
                charactersProcessed++;

                return process;
            }

            if (scrambleChar) {
                nextDisplay += scrambleChar;

                return process;
            }

            if (!humanLike && Math.random() < 0.05) {
                character = this.randomCharacter();
                nextDisplay += character;

                return Object.assign({}, process, { scrambleChar: character });
            }

            nextDisplay += oldCharacter;

            return process;
        });

        this.setState({ display: nextDisplay });

        if (charactersProcessed < this.queue.length) {
            this.renderFrame = requestAnimationFrame(this.updateFrame);
            this.frame++;
        }
    }

    randomCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }

    componentWillReceiveProps(nextProps) {
        this.scramble = nextProps.children;

        // If new text is passed (possibly from a setState in the parent component), restart scrambling.
        this.frame = 0;
        this.startScrambling(nextProps.renderIn);
    }

    componentDidMount() {
        const { renderIn, characters, children } = this.props;

        this.scramble = typeof children === "string" ? children :
            "Component Scramble only takes a single string as a child!";
        this.characters = characters || "+/\\_-";

        this.frame = 0;
        this.startScrambling(renderIn);
    }

    render() {
        return this.state.display;
    }
}

export default Scrambler;
