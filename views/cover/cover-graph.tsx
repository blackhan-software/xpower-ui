import './cover-graph.scss';

import React, { useContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { AccountContext } from '../../source/react';

import { NftLevel, Page, Rates, RebalancerStatus, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MAX_YEAR } from '../../source/years';
import { UiCoverGraphChartBar } from './cover-graph-chart-bar';
import { UiCoverGraphChartLine } from './cover-graph-chart-line';
import { UiCoverGraphControlIssue } from './cover-graph-control-issue';
import { UiCoverGraphControlLevel } from './cover-graph-control-level';
import { UiCoverGraphInterlace } from './cover-graph-interlace';
import { UiCoverGraphSpinner } from './cover-graph-spinner';

type Props = {
    controls: {
        rebalancer: {
            onRebalance?: (token: Token, all_levels: boolean) => void;
            status: RebalancerStatus | null;
        };
    };
    data: {
        rates: Rates;
    };
    page: Page; token: Token;
}
export function UiCoverGraph(
    { controls, data: { rates }, page, token }: Props
) {
    const [account] = useContext(AccountContext);
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
                token={xtoken} controls={{
                    ...controls, issues: { issue, setIssue: set_issue }
                }}
            />
            <UiCoverGraphSpinner
                show={Boolean(account) && empty(rates, xtoken, level)}
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
                token={xtoken} controls={{
                    ...controls, levels: { level, setLevel: set_level }
                }}
            />
            <UiCoverGraphSpinner
                show={Boolean(account) && empty(rates, xtoken, level)}
            />
        </>;
    }
    return null;

}
function empty(
    rates: Rates, token: Token, level: NftLevel
) {
    return rates.items[token]?.[level]?.apr === undefined;
}
export default UiCoverGraph;
