const test = require("ava");
const tmp = require("temp");
const linearTrainer = require(".");

let modelFilePath = tmp.path({suffix: ".pickle"});
modelFilePath = modelFilePath.slice(modelFilePath.lastIndexOf("/") + 1);

test.serial("train-does-not-crash", t => {
    t.not(
        linearTrainer.train(
            [[1], [2], [10], [20]],
            [27, 11, 75, 155],
            modelFilePath
        ),
        false,
        "Did the training code not fail with a non-zero exit code?"
    );
});

test("predict-fits-to-correct-equation-result", t => {
    const predictResult = linearTrainer.predict([[6]], modelFilePath, true);
    t.not(
        predictResult,
        false,
        "Did the predict code not fail with a non-zero exit code?"
    );
    t.is(
        JSON.stringify(predictResult),
        JSON.stringify([51]),
        "Was the prediction accurate given the training data?"
    );
});
