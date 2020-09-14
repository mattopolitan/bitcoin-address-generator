import * as bip39 from 'bip39';

export default ({ value, compare, validationType }) => {
    return bip39.validateMnemonic(value)
}
