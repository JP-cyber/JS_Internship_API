export default class Validator {
    static validate(str) {
        const regex = /^[A-Za-z0-9.: ]+$/;
        const isValid = regex.test(str);

        return isValid;
    }
}