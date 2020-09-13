
export default ({ value, compare, validationType }) => {
    if (typeof value === 'undefined') return true
    if (value.length > 15) return false
    for(let i = 0; i < value.length; i++){
        if(!value[i].match(/[a-f0-9]{66}$/i))
            return false
    }
    return true
}