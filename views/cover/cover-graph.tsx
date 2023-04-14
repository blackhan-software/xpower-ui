import './cover-graph.scss';

import React from 'react';
import { useSessionStorage } from 'usehooks-ts';

import { NftLevel, Page, Rates, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MAX_YEAR } from '../../source/years';
import { UiCoverGraphChartBar } from './cover-graph-chart-bar';
import { UiCoverGraphChartLine } from './cover-graph-chart-line';
import { UiCoverGraphControlIssue } from './cover-graph-control-issue';
import { UiCoverGraphControlLevel } from './cover-graph-control-level';
import { UiCoverGraphInterlace } from './cover-graph-interlace';
import { UiCoverGraphSpinner } from './cover-graph-spinner';

type Props = {
    page: Page;
    token: Token;
    rates: Rates;
}
export function UiCoverGraph(
    { page, token, rates }: Props
) {
    const [level, set_level] = useSessionStorage(
        'ui-cover-graph-level', NftLevel.KILO
    );
    const [issue, set_issue] = useSessionStorage(
        'ui-cover-graph-issue', MAX_YEAR()
    );
    const xtoken = Tokenizer.xify(token);
    if (page === Page.Nfts) {
        return <>
            <UiCoverGraphInterlace />
            <UiCoverGraphChartBar
                issue={issue} rates={rates} token={xtoken}
            />
            <UiCoverGraphControlIssue
                issue={issue} setIssue={set_issue}
            />
            <UiCoverGraphSpinner
                show={empty(rates, xtoken)}
            />
        </>;
    }
    if (page === Page.Ppts) {
        return <>
            <UiCoverGraphInterlace />
            <UiCoverGraphChartLine
                level={level} issue={issue}
                rates={rates} token={xtoken}
            />
            <UiCoverGraphControlLevel
                level={level} setLevel={set_level}
            />
            <UiCoverGraphSpinner
                show={empty(rates, xtoken)}
            />
        </>;
    }
    return null;

}
function empty(
    rates: Rates, token: Token
) {
    return rates.items[token]?.apr === undefined;
}
export default UiCoverGraph;
