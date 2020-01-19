# linear-trainer-node

> Train Python-style linear regressions from Node.js.

![NPM Version][npm-image]
![https://img.shields.io/npm/l/linear-trainer.svg][npm-license]

A stateless API for interacting with Python's `sklearn` linear regression methods from Node. It comes with two basic functions: `train` and `predict`.

-   `train` writes over the given file path with a linear regression model fitted to the provided input and output data arrays.
-   `predict` returns the output of the given model's equation with the provided input data.

## Installation

### npm

```sh
npm install linear-trainer --save
```

### GitHub

```sh
npm install git+https://github.com/sgvictorino/linear-trainer-node.git --save
```

## Development setup

To lint, format, and run unit tests:

    npm install
    npm run test

## License

Distributed under the MIT license. See `LICENSE` for more information.

<!-- badge sources -->

[npm-image]: https://img.shields.io/npm/v/linear-trainer.svg

[npm-license]: https://img.shields.io/npm/l/linear-trainer.svg