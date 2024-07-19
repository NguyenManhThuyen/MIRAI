import fs from 'fs';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
    return Math.random() < 0.5;
}

function createRandomObject() {
    const fixedKeys = ["1721122131", "1721122220", "1721122359", "1721122471", "1721122532", "1721122603"];
    
    return {
        id: generateUUID(),
        question_id: fixedKeys[getRandomInt(0, fixedKeys.length - 1)],
        question_status: getRandomBoolean()
    };
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function createArrayOfObjects(length) {
    const array = [];
    for (let i = 0; i < length; i++) {
        array.push(createRandomObject());
    }
    return array;
}

const arrayOfObjects = createArrayOfObjects(1000);
const jsonData = JSON.stringify(arrayOfObjects, null, 2);

fs.writeFile('output.json', jsonData, (err) => {
    if (err) {
        console.error('Error writing file', err);
    } else {
        console.log('Successfully wrote file');
    }
});
