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

    startScrambling(end, start, renderIn = 3000) {
        this.queue = [];

        // This would be provided by a parent component "Cycler"
        const lastScrambled = start || "";
        const longer = lastScrambled.length > end.length ? lastScrambled.length : end.length;
        const maxFrames = 60 * (renderIn / 1000);

        for (let i = 0, lastStartFrame = 0, dec = maxFrames; i < longer; i++) {
            const frames = maxFrames / longer;
            const humanLikeTime = lastScrambled.length < end.length ?
                lastStartFrame + Math.floor(Math.random() * frames * 0.9) :
                dec - Math.floor(Math.random() * frames * 0.9);

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

        this.queue = this.queue.map((process, i) => {
            const { oldCharacter, newCharacter, startTransformation, endTransformation, scrambleChar } = process;
            const { humanLike } = this.props;

            let append = oldCharacter;
            let returnThis = process;
            let modifyMode = false;

            if (humanLike && this.frame > startTransformation) {
                append = newCharacter;
            } else if (this.frame < startTransformation) {
                append = oldCharacter;
            } else if (this.frame > endTransformation) {
                append = newCharacter;
                charactersProcessed++;
            } else if (scrambleChar) {
                append = scrambleChar;
                modifyMode = true;
            } else if (!humanLike && Math.random() < 0.05) {
                character = this.randomCharacter();
                append = character;
                modifyMode = true;

                returnThis = Object.assign({}, process, { scrambleChar: character });
            } else {
                append = oldCharacter;
            }

            // If modes are equal, just append to the builder.
            // Otherwise, push the built string onto the render queue and flip the mode.
            if (modifyMode === mode || !this.props.wrap) {
                stringBuilder += append;
            } else {
                const Wrap = this.props.wrap;
                let push = Wrap && mode ? (<Wrap>{ stringBuilder }</Wrap>) : stringBuilder;

                renderComponents.push(push);
                stringBuilder = "" + append;
                mode = !mode;
            }

            nextDisplay += append;

            return returnThis;
        });

        if (stringBuilder !== "") {
            renderComponents.push(stringBuilder);
        }

        this.setState({ display: nextDisplay, components: renderComponents });

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
        this.startScrambling(nextProps.children, nextProps.changeFrom, nextProps.renderIn);
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
        this.startScrambling(scramble, "", renderIn);
    }

    render() {
        return this.props.dev ? this.state.components : this.state.display;
    }
}

export default Scrambler;
