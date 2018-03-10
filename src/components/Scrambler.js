import React from "react";
import PropTypes from "prop-types";

class Scrambler extends React.Component {
    constructor(props) {
        super(props);

        this.updateFrame = this.updateFrame.bind(this);
        this.scrambling = true;

        this.state = {
            display: "",
            components: []
        };
    }

    getNextComponent(mode, str, key) {
        const Wrap = this.props.wrap && mode ? this.props.wrap : React.Fragment;

        return (
            <Wrap key={ key }>{ str }</Wrap>
        );
    }

    startScrambling(end, start, renderIn = 3000) {
        this.queue = [];
        end = end || "";

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

            const startTransformation = this.props.humanLike ?
                humanLikeTime :
                Math.floor(Math.random() * maxFrames * 0.4);
            const transformationDuration = Math.floor(Math.random() *
                (maxFrames - startTransformation));
            const endTransformation = transformationDuration + startTransformation;

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
            if (modifyMode !== mode) {
                renderComponents.push(this.getNextComponent(mode,
                    stringBuilder, renderComponents.length));

                stringBuilder = "" + append;
                mode = !mode;
            } else {
                stringBuilder += append;
            }

            nextDisplay += append;

            return returnThis;
        });

        if (stringBuilder !== "") {
            renderComponents.push(this.getNextComponent(mode,
                stringBuilder, renderComponents.length));
        }

        if (!this.scrambling) {
            // Prevent unsafe frame updates
            cancelAnimationFrame(this.renderFrame);
        } else {
            this.setState({ display: nextDisplay, components: renderComponents });

            if (charactersProcessed < this.queue.length) {
                this.renderFrame = requestAnimationFrame(this.updateFrame);
                this.frame++;
            } else {
                // this.doneScrambling();
            }
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

    getScrambleText(props) {
        const { text, children } = props;

        if (typeof text === "string") {
            return text;
        } else if (typeof children === "string") {
            return children;
        }

        return "No string was provided to the text prop!";
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.static) {
            return;
        }

        // If new text is passed (possibly from a setState in the parent component), restart scrambling.
        this.frame = 0;
        this.startScrambling(this.getScrambleText(nextProps),
            nextProps.changeFrom,
            nextProps.renderIn);
    }

    componentDidMount() {
        if (this.props.static) {
            return;
        }

        const { renderIn, characters } = this.props;
        const scramble = this.getScrambleText(this.props);

        this.characters = characters;
        this.scrambling = true;

        this.frame = 0;
        this.startScrambling(scramble, "", renderIn);
    }

    componentWillUnmount() {
        this.scrambling = false;
    }

    render() {
        if (this.props.static) {
            return this.props.text;
        }

        return this.props.deprecatedFeatures ?
            this.state.display : this.state.components;
    }
}

Scrambler.defaultProps = {
    renderIn: 3000,
    humanLike: false,
    characters: "+/\\_-"
};

Scrambler.proptypes = {
    renderIn: PropTypes.number,
    humanLike: PropTypes.bool,
    characters: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};

export default Scrambler;
