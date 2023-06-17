import './cover-graph.scss';

import React, { useContext } from 'react';
import { useSessionStorage } from 'usehooks-ts';
import { AccountContext } from '../../source/react';

import { NftLevel, Page, Rates, RefresherStatus, Token } from '../../source/redux/types';
import { Tokenizer } from '../../source/token';
import { MAX_YEAR } from '../../source/years';
import { UiCoverGraphChartBar, Scale } from './cover-graph-chart-bar';
import { UiCoverGraphChartLine } from './cover-graph-chart-line';
import { UiCoverGraphControlIssue } from './cover-graph-control-issue';
import { UiCoverGraphControlLevel } from './cover-graph-control-level';
import { UiCoverGraphInterlace } from './cover-graph-interlace';
import { UiCoverGraphSpinner } from './cover-graph-spinner';

type Props = {
    controls: {
        refresher: {
            onRefresh?: (token: Token, all_levels: boolean) => void;
            status: RefresherStatus | null;
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
    const [scale_bar, set_scale_bar] = useSessionStorage<Scale>(
        'ui-cover-graph-scale-bar', Scale.logarithmic
    );
    const [scale_tmp, set_scale_tmp] = useSessionStorage<Scale>(
        'ui-cover-graph-scale-tmp', Scale.linear
    );
    const xtoken = Tokenizer.xify(token);
    if (page === Page.Nfts) {
        return <>
            <UiCoverGraphInterlace />
            <UiCoverGraphChartBar
                issue={issue}
                rates={rates}
                scale={scale_bar}
                token={xtoken}
            />
            <UiCoverGraphControlIssue
                token={xtoken} controls={{
                    issues: { issue, setIssue: set_issue },
                    toggle: { scale: scale_bar, setScale: set_scale_bar },
                    ...controls,
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
                level={level}
                issue={issue}
                rates={rates}
                scale={scale_tmp}
                token={xtoken}
            />
            <UiCoverGraphControlLevel
                token={xtoken} controls={{
                    levels: { level, setLevel: set_level },
                    toggle: { scale: scale_tmp, setScale: set_scale_tmp },
                    ...controls,
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
    const apr = rates.items[token]?.[level]?.apr;
    return Object.keys(apr ?? {}).length === 0;
}
export default UiCoverGraph;
