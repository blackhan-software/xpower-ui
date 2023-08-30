import { APB, APR } from '../../../source/contract';
import { range as arange, zip } from '../../../source/functions';
import { NftIssue, NftLevel, Rates } from '../../../source/redux/types';
import { SVA, SVAIntegrator } from './sva-integrator';

export const RateEvaluator = (
    rates: Rates,
    level: NftLevel,
    issue: NftIssue,
    delta = 0n,
    range = 1n,
): {
    targets: Array<[SVA['value'], SVA['value']]>;
    actuals: Array<[SVA['value'], SVA['value']]>;
    stamps: Date[];
} => {
    const aprs = Object.values(
        rates.items[level]?.apr ?? {}
    );
    const apbs = Object.values(
        rates.items[level]?.bonus ?? {}
    );
    return evaluate(aprs, apbs, issue, delta, range);
};
function evaluate(
    aprs: APR[],
    apbs: APB[],
    issue: NftIssue,
    delta: bigint,
    range: bigint,
) {
    const apr_svas = aprs.map(svaify);
    const apb_svas = apbs.map(svaify);
    const apr_integrator = new SVAIntegrator(
        apr_svas.length > 1 ? apr_svas.slice(0, -1) : apr_svas
    );
    const apb_integrator = new SVAIntegrator(
        apb_svas.length > 1 ? apb_svas.slice(0, -1) : apb_svas
    );
    if (apr_svas.length > 0 &&
        apb_svas.length > 0
    ) {
        const now = new Date();
        const lhs = Number(delta - range / 2n);
        const rhs = Number(delta + range / 2n + range % 2n);
        const stamps = Array.from(arange(lhs, rhs))
            .map((d) => addDays(now, d));
        const apr_targets = stamps
            .map<Point>((s) => [s, queryBy(apr_svas, s).value]);
        const apb_targets = stamps
            .map<Point>((s) => [s, queryBy(apb_svas, s).value]);
        const apr_actuals = apr_targets
            .map<Point>(([s, t]) => [s, apr_integrator.meanOf(s, t)]);
        const apb_actuals = apb_targets
            .map<Point>(([s, t]) => [s, apb_integrator.meanOf(s, t)]);
        return {
            targets: zip(
                apr_targets.map(([_, t]) => t),
                apb_targets.map(rescaleBy(issue))),
            actuals: zip(
                apr_actuals.map(([_, a]) => a),
                apb_actuals.map(rescaleBy(issue))),
            stamps,
        };
    }
    return { targets: [], actuals: [], stamps: [] };
}
function svaify(
    { stamp, value, area }: APR
): SVA {
    return { stamp: new Date(Number(stamp) * 1000), value, area };
}
function addDays(
    date: Date, days: number
) {
    return new Date(date.getTime() + 864e5 * days);
}
function queryBy(
    svas: SVA[], stamp: SVA['stamp']
) {
    const sva = svas.filter((s) => s.stamp >= stamp)[0];
    console.assert(svas.length > 0, 'empty query-by');
    return sva ?? svas[svas.length - 1];
}
const rescaleBy = (issue: NftIssue) => (
    [stamp, value]: Point
) => {
    const nft_years = BigInt(issue);
    const off_years = BigInt(stamp.getFullYear());
    const now_years = BigInt(new Date().getFullYear());
    if (off_years > nft_years && now_years > 2021n) {
        return value * (off_years - nft_years) / (now_years - 2021n);
    }
    return 0n;
};
type Point = [
    stamp: Date, value: SVA['value']
]
export default RateEvaluator;
