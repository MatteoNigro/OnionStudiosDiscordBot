const fs = require('fs');

function GetWrittenReviewDates() {
    let actualDates = [];
    try {
        const stringDates = fs.readFileSync('./reviews.json');
        if (!isEmpty(stringDates))
            actualDates = JSON.parse(stringDates);
    } catch (error) {
        console.log(error);
        return;
    }
    return actualDates;
}

function WriteOneDateReviewToFile(reviewDate) {
    if (!reviewDate)
        return console.log('C\'è un problema con il reperimento della data dal front end');

    let allDates = [];
    allDates = GetWrittenReviewDates();
    allDates.push(reviewDate);

    try {
        const data = JSON.stringify(allDates, null);
        fs.writeFileSync('./reviews.json', data);
    } catch (error) {
        console.log(error);
        return;
    }
}

function WriteAllDateReviewsToFile(dateArray) {
    if (!dateArray) {
        return console.log('C\'è un problema la lettura dei dati di partenza');
    }

    try {
        const data = JSON.stringify(dateArray, null);
        fs.writeFileSync('./reviews.json', data);
    } catch (error) {
        console.log(error);
        return;
    }
}

function isEmpty(obj) {
    return !Object.keys(obj).length;
}

module.exports = {
    GetWrittenReviewDates,
    WriteOneDateReviewToFile,
    WriteAllDateReviewsToFile
}