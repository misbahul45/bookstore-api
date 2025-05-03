import bcrypt from 'bcrypt';
export function hashText(text) {
    const saltRounds = 10;
    const hashedText = bcrypt.hashSync(text, saltRounds);
    return hashedText;
}

export function compareHashed(text, hashedText) {
    const isMatch = bcrypt.compareSync(text, hashedText);
    return isMatch;
}