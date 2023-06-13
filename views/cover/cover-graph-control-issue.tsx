import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle, YinYangCircle } from '../../public/images/tsx';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { NftIssue, RebalancerStatus, Token } from '../../source/redux/types';
import { MAX_YEAR, MIN_YEAR } from '../../source/years';

type Props = {
    controls: {
        rebalancer: {
            onRebalance?: (token: Token, all_levels: boolean) => void;
            status: RebalancerStatus | null;
        };
        issues: {
            setIssue: Dispatch<SetStateAction<NftIssue>>;
            issue: NftIssue;
        };
    };
    token: Token;
}
export function UiCoverGraphControlIssue(
    { controls: { rebalancer, issues: { issue, setIssue } }, token }: Props
) {
    useEffect(() => {
        setTimeout(() => Bus.emit('refresh-tips'), mobile() ? 600 : 0);
    }, [
        issue
    ]);
    return <div className='control-issue cover-layer'>
        <div className='btn-group-vertical' role='group'>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={maximal(issue)}
                className='btn btn-outline-warning upper'
                onClick={() => increase({ issue, setIssue })}
                type='button' title={`${next(issue)} issue`}
            >
                <ArrowUpCircle fill={true} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={disabled(rebalancer)}
                className='btn btn-outline-warning middle'
                onClick={(ev) => rebalancer.onRebalance?.(token, ev.ctrlKey)}
                type='button' title='Rebalance Reward Rates'
            >
                <YinYangCircle classes={rotate(rebalancer)} />
            </button>
            <button
                data-bs-toggle='tooltip' data-bs-placement='left'
                data-disable='true' disabled={minimal(issue)}
                className='btn btn-outline-warning lower'
                onClick={() => decrease({ issue, setIssue })}
                type='button' title={`${previous(issue)} issue`}
            >
                <ArrowDownCircle fill={true} />
            </button>
        </div>
    </div>;
}
function disabled(
    rebalancer: Props['controls']['rebalancer']
) {
    return rebalancer.status === RebalancerStatus.rebalancing;
}
function rotate(
    rebalancer: Props['controls']['rebalancer']
) {
    return rebalancer.status === RebalancerStatus.rebalancing ? 'rotate' : null;
}
function next(
    issue: NftIssue
) {
    if (!maximal(issue)) {
        return issue + 1;
    }
    return 'next';
}
function previous(
    issue: NftIssue
) {
    if (!minimal(issue)) {
        return issue - 1;
    }
    return 'previous';
}
function increase(
    { issue, setIssue }: Props['controls']['issues']
) {
    if (!maximal(issue)) {
        setIssue(issue + 1);
    }
}
function decrease(
    { issue, setIssue }: Props['controls']['issues']
) {
    if (!minimal(issue)) {
        setIssue(issue - 1);
    }
}
function maximal(issue: NftIssue) {
    return issue === MAX_YEAR();
}
function minimal(issue: NftIssue) {
    return issue === MIN_YEAR();
}
export default UiCoverGraphControlIssue;
