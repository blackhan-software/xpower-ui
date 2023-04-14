import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ArrowDownCircle, ArrowUpCircle } from '../../public/images/tsx';
import { Bus } from '../../source/bus';
import { mobile } from '../../source/functions';
import { NftIssue } from '../../source/redux/types';
import { MAX_YEAR, MIN_YEAR } from '../../source/years';

type Props = {
    issue: NftIssue,
    setIssue: Dispatch<SetStateAction<NftIssue>>,
}
export function UiCoverGraphControlIssue(
    { issue, setIssue }: Props
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
    { issue, setIssue }: Props
) {
    if (!maximal(issue)) {
        setIssue(issue + 1);
    }
}
function decrease(
    { issue, setIssue }: Props
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
