# react-text-scrambler

Components for text animation in **React**.

## Usage

Import the components:
```javascript
import { Scrambler, Cycler } from "react-text-scrambler";
```

### Scrambler

```html
<Scrambler>This text will be scrambled!</Scrambler>
```

#### Props

| Prop | Default Value | Description |
|------------|---------------|-------------------------------------------------------------------------------------------|
| `children` | `""` | A string of text to scramble. |
| characters | `"+/\\_-"` | Characters to be randomly included in each scramble (only if `humanLike` is `false`). |
| humanLike | `false` | If true, instead of scrambling characters, text will display like typing. |
| renderIn | `undefined` | The Scrambler will complete scrambling in the provided time in milliseconds. |
| changeFrom | `""` | The Scrambler will scramble text provided in this prop to the string provided in `children`. |
| text | `""` | If `children` is undefined, text from this prop is scrambled instead. If both are set, `children` is prioritized. |

### Cycler

The `Cycler` renders `Scrambler`s in a specified interval. It automatically passes the `changeFrom` prop to the next `Scrambler` to create a seamless transition between text.

If `humanLike` is `true`, empty strings, `""` are inserted in between each string in `strings` to simulate backspacing and typing.

| Prop | Default Value | Description |
|-----------|---------------|--------------------------------------------|
| humanLike | `false` | Passed to `Scrambler`s `humanLike` prop. |
| duration | `3000` | The duration of each `Scrambler`. |
| strings | `[]` | An array of strings to scramble. |

## Examples

### Typing animation

Just set the `humanLike` prop to `true`.

```javascript
const MyComponent = props => {
    ...

    return (
        <Scrambler humanLike>This text will be typed out.</Scrambler>
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
            characters={ characters }>This text will be typed out.</Scrambler>
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
