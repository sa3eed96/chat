const stringValidation = (value)=>{
    const regex = '/[~`!@#$%^&*()\[\]><:;\"\'\+\=]/g';
    return regex.match(value) ? false: true;
};

module.exports = stringValidation;