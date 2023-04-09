const suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
]);
const rules = new Intl.PluralRules('en-US', {
    type: 'ordinal'
});
export function ordinal(n: number | string) {
    return `${n}${suffixes.get(rules.select(Number(n)))}`;
}
export default ordinal;
