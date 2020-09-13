import * as bip39 from 'bip39';

export default ({ value, compare, validationType }) => {
    let pass = false;
    return bip39.validateMnemonic(value)
}

const validateDate = (value, compare, validationType) => {
    let pass = false;

    if (validationType === 'earlier') {
        pass = isEarlier(value, compare);
    }

    if (validationType === 'beyond') {
        pass = isBeyond(value, compare);
    }

    return pass;
}
const isEarlier = (value, compare) => {
    return (value < compare) ? false : true;
}

const isBeyond = (value, compare) => {
    return (value > compare) ? false : true;
}