const dataOra = () => {
    // Offset in milliseconds
    let dataOffset = (new Date()).getTimezoneOffset() * 60000;
    // Subtract the timezone, stringfy and crop the last chars
    return (new Date(Date.now() - dataOffset)).toISOString().replace(/\..+/, '');
}

module.exports = { dataOra }
