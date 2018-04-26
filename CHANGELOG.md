# Changelog

## 1.2.0 (Upcoming)

New component `Typewriter`!

* `Typewriter` is a component on top of the `Cycler` that, by default, uses the typing animation feature of the `Scrambler`.
  * `Typewriter` introduces the `cursor` prop allowing users to provide a React element to render at the end as a "cursor". However, please use something like CSS animations to animate the cursor.
* Replacing `humanLike` prop to `typewriter`. Complete removal of `humanLike` in `v2.0.0`.
* Replacing `renderIn` prop of `Scrambler` to `duration` to remain consistent for every component. Complete removal of `renderIn` in `v2.0.0`.
* New props
  * `startDelay` tells the `Cycler` or `Scrambler` how long to wait before animating.
* New prop for `Cycler`!
  * `iterations` tells the `Cycler` how many individual animations it should perform.
* Memory optimizations
  * Reduced array usage when a `wrap` prop isn't provided.

## 1.1.3

* Changelog added to repository!
* The new `duration` prop will replace the `renderIn` prop in `Scrambler`.
* `latest.js` as file for UMD build in every release.

## 1.1.2

* Calls to `setState` after `Scrambler` or `Cycler` unmounting are blocked.

## 1.1.1

* The `Cycler` uses the `Scrambler`'s `text` prop to provide text instead of `children` (use of `children` deprecated).

## 1.1.0

More customizability for scrambled characters!

* (**Deprecation**) `Scrambler`'s `children` prop.
  * Use the `text` prop instead.
  * `children` prop will be removed in version `2.0.0`.
* New props!
  * New `wrap` prop to "wrap" scrambled characters in.
  * New `delay` prop for `Cycler` to delay transition to the next string.
* Cleaner scrambling durations.

## 1.0.0

The initial release!
