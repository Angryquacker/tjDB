const checkType = (validType, data) => {
    //Check if the data is of the correct type
    if (typeof data == validType && (validType != "array" || validType != "object")) {
        return true;
    }

    //Add logic for distinguishing arrays from objects
    if (validType == "array" && Array.isArray(data)) {
        return true;
    }

    if (validType == "object" && data.toString() == "[object Object]") {
        return true;
    }

    //Return false if all other tests fail
    return false;
};

module.exports = checkType;