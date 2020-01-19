const path = require("path");

const pythonScriptPath = path.join(
    __dirname,
    "linear-trainer-cmd/linear-trainer.py"
);
const pythonTrainerBaseCommand = `python3 ${pythonScriptPath}`;
const {exec} = require("shelljs");
const signale = require("signale");

module.exports.predict = (inputData, modelPath, integerResults = false) => {
    const dataToPass = `{
        "input_data": ${JSON.stringify(inputData)}
    }`;
    const command = `${pythonTrainerBaseCommand} --predict '${dataToPass}' --model ${modelPath}`;
    signale.debug(`calling '${command}'`);
    const res = exec(command, {silent: true});
    const {code} = res;
    const {stdout} = res;
    if (code === 0) {
        signale.debug(stdout);
        const outputArray = stdout.slice(1, stdout.length - 2).split(",");
        for (
            let strNumIndex = 0;
            strNumIndex < outputArray.length;
            strNumIndex++
        ) {
            outputArray[strNumIndex] = parseFloat(outputArray[strNumIndex]);
            if (integerResults)
                outputArray[strNumIndex] = parseFloat(
                    outputArray[strNumIndex].toFixed()
                );
        }

        return outputArray;
    }

    signale.error(res.stderr);
    return false;
};

module.exports.train = (
    inputData,
    outputData,
    modelPath,
    returnCrossValidationMetrics = false,
    gradientBoostingRegression = false,
    trainSize = null
) => {
    const dataToPass = `{
        "input_data": ${JSON.stringify(inputData)},
        "output_data": ${JSON.stringify(outputData)}
    }`;
    const command = `${pythonTrainerBaseCommand} --train '${dataToPass}' --model ${modelPath} ${
        returnCrossValidationMetrics ? "--cross-validation" : ""
    } ${gradientBoostingRegression ? "--gradient-boosting-regression" : ""} ${
        trainSize === null ? "" : "--train-size " + trainSize
    }
    `;
    signale.debug(`calling '${command}'`);
    const res = exec(command, {silent: true});
    const {code} = res;
    const {stdout} = res;
    signale.debug("predict status code", code);
    if (code === 0) {
        signale.debug("successful output:", stdout);
        return JSON.parse(stdout);
    }

    signale.error(res.stderr);
    return false;
};
