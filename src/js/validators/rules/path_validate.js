export default ({ value, compare, validationType }) => {
    if (typeof value === 'undefined') return true
    return (value.match(/^([mM]{1}\/84'\/0'\/)[0-9]{1}'\/(0|1)\/([0-9]{1}|[1-9][0-9]{1,5})$/i)) ? true : false
}