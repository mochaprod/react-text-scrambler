# react-text-scrambler
![Version](https://img.shields.io/github/package-json/v/benjhu/react-text-scrambler.svg)
![License](https://img.shields.io/github/license/benjhu/react-text-scrambler.svg)

**React** components for text animation.

## Usage

Import the components:

```javascript
import { Scrambler, Cycler } from "react-text-scrambler";
```

### Scrambler

The `Scrambler` receives the text to be scrambled as a prop. It scrambles text only **once**.

```html
<Scrambler text="This text will be scrambled!" />
```

#### Props

| Prop | Default Value | |
|------------|---------------|-------------------------------------------------------------------------------------------|
| `children` | `""` | (**Deprecated**) A string of text to scramble. |
| text | `""` | Specify text to scramble. If no text is provided in this prop, any string in the `children` prop is used as the fallback text. |
| characters | `"+/\\_-"` | Characters to be randomly included in each scramble (only if `humanLike` is `false`). |
| humanLike | `false` | If `true`, instead of scrambling characters, text appears like typing. |
| renderIn | `3000` | The `Scrambler` will complete scrambling in the provided time in milliseconds. |
| changeFrom | `""` | The Scrambler will scramble text provided in this prop to the string provided in `children`. |
| wrap | `undefined` | Scrambled characters are wrapped in a provided `Wrap` component. This allows characters to be styled or displayed differently. |

### Cycler

The `Cycler` renders `Scrambler`s in a specified interval. It automatically passes the `changeFrom` prop to the `Scrambler` for the next string in queue to create seamless transitions between scrambles.

If `humanLike` is `true`, empty strings, `""` are inserted in between each string in `strings` to simulate backspacing and typing.

| Prop | Default Value | |
|-----------|---------------|--------------------------------------------|
| humanLike | `false` | Passed to `Scrambler`s `humanLike` prop. |
| duration | `3000` | The duration of each `Scrambler`. |
| strings | `[]` | An array of strings to scramble. |
| characters | `undefined` | A string of characters to scramble with. If `undefined`, `Scrambler` will use its default `characters` value. |

## Examples

### Typing animation

Just set the `humanLike` prop to `true`.

```javascript
const MyComponent = props => {
    ...

    return (
        <Scrambler text="This text will be typed out!" humanLike />
    );
};
```

### Characters provided

In this case, only the character `*` has the chance to replace characters during a scramble.

```javascript
const MyComponent = props => {
    ...

    const characters = "*";

    return (
        <Scrambler
            text="This text will be typed out!"
            characters={ characters } />
    );
};
```

### Cycle between text

A new string will be displayed every `4` seconds in the following `Cycler`.

```javascript
const MyComponent = props => {
    ...

    const strings = ["These", "Strings", "Are", "Cycled!"];

    return (
        <Cycler
            duration={ 4000 }
            strings={ strings } />
    );
};
```

## TODOs

* **More Props**: More props for the user to configure the `Scrambler`.
  * Minimum duration (in frames) to display each scrambled character.
  * Control over the probability that a character is scrambled.
