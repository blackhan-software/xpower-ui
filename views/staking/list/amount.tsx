import { Global } from '../../../source/types';
declare const global: Global;

import { Referable } from '../../../source/functions';
import { Amount, Nft, NftLevel } from '../../../source/redux/types';

import React, { MouseEvent, TouchEvent } from 'react';
import { DashCircle } from '../../../public/images/tsx';
import { PlusCircle } from '../../../public/images/tsx';

type Props = {
    amount: Amount, level: NftLevel,
    max: Amount, min: Amount
    onUpdate?: OnUpdate
};
type OnUpdate = (args: Omit<Props, 'onUpdate'> & {
    callback?: () => void
}) => void;
export class PptAmount extends Referable(
    React.Component<Props>
) {
    render() {
        const { amount, max, min, level } = this.props;
        return <React.Fragment>
            {this.$decrease(amount > min)}
            {this.$amount(amount, level)}
            {this.$increase(amount < max)}
        </React.Fragment>;
    }
    $decrease(
        decreasable: boolean
    ) {
        return <div
            className='btn-group' role='group'
        >
            <button type='button'
                className='btn btn-outline-warning decrease'
                onMouseDown={this.startDecrease.bind(this)}
                onMouseLeave={this.stopDecrease.bind(this)}
                onMouseUp={this.stopDecrease.bind(this)}
                onTouchStart={this.startDecrease.bind(this)}
                onTouchCancel={this.stopDecrease.bind(this)}
                onTouchEnd={this.stopDecrease.bind(this)}
                disabled={!decreasable}
            >
                <DashCircle fill={true} />
            </button>
        </div>;
    }
    startDecrease(
        e: MouseEvent | TouchEvent
    ) {
        if (global.PPT_TID_DECREASE) {
            clearTimeout(global.PPT_TID_DECREASE);
            delete global.PPT_TID_DECREASE;
        }
        global.PPT_TID_DECREASE = setTimeout(() => {
            if (global.PPT_IID_DECREASE) {
                clearTimeout(global.PPT_IID_DECREASE);
                delete global.PPT_IID_DECREASE;
            }
            global.PPT_IID_DECREASE = setInterval(() => {
                this.decrease(e);
            }, 10);
        }, 600);
        this.decrease(e);
    }
    stopDecrease() {
        if (global.PPT_TID_DECREASE) {
            clearTimeout(global.PPT_TID_DECREASE);
            delete global.PPT_TID_DECREASE;
        }
        if (global.PPT_IID_DECREASE) {
            clearTimeout(global.PPT_IID_DECREASE);
            delete global.PPT_IID_DECREASE;
        }
    }
    decrease(
        e: MouseEvent | TouchEvent | WheelEvent
    ) {
        const delta = e.ctrlKey ? 100n : e.shiftKey ? 10n : 1n;
        const { amount, min, onUpdate } = this.props;
        if (amount - delta >= min) {
            if (onUpdate) onUpdate({
                ...this.props, amount: amount - delta
            });
        } else {
            this.stopDecrease();
        }
        e.preventDefault();
    }
    decreaseByWheel(
        e: WheelEvent
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY > 0) {
            this.decrease(e);
        }
    }
    $amount(
        amount: Amount, nft_level: NftLevel
    ) {
        return <button type='button' ref={this.ref('amount')}
            className='btn btn-outline-warning amount'
            data-bs-toggle='tooltip' data-bs-placement='top'
            data-max={amount.toString()} data-min={0n.toString()}
            onClick={this.extremify.bind(this, amount, nft_level)}
            title={this.title(amount, nft_level)}
        >{amount.toString()}</button>;
    }
    title(
        amount: Amount, nft_level: NftLevel
    ) {
        if (amount > 0) {
            return `${Nft.nameOf(nft_level)} NFTs to stake`;
        } else if (amount < 0) {
            return `${Nft.nameOf(nft_level)} NFTs to unstake`;
        } else {
            return `${Nft.nameOf(nft_level)} NFTs to (un)stake`;
        }
    }
    extremify(
        amount: Amount, nft_level: NftLevel
    ) {
        const { max, min, onUpdate } = this.props;
        if (amount === max) {
            if (onUpdate) onUpdate({
                amount: min, max, min,
                level: nft_level
            });
        }
        if (amount === min || amount < max) {
            if (onUpdate) onUpdate({
                amount: max, max, min,
                level: nft_level
            });
        }
    }
    $increase(
        increasable: boolean
    ) {
        return <div
            className='btn-group' role='group'
        >
            <button type='button'
                className='btn btn-outline-warning increase'
                onMouseDown={this.startIncrease.bind(this)}
                onMouseLeave={this.stopIncrease.bind(this)}
                onMouseUp={this.stopIncrease.bind(this)}
                onTouchStart={this.startIncrease.bind(this)}
                onTouchCancel={this.stopIncrease.bind(this)}
                onTouchEnd={this.stopIncrease.bind(this)}
                disabled={!increasable}
            >
                <PlusCircle fill={true} />
            </button>
        </div>;
    }
    startIncrease(
        e: MouseEvent | TouchEvent
    ) {
        if (global.PPT_TID_INCREASE) {
            clearTimeout(global.PPT_TID_INCREASE);
            delete global.PPT_TID_INCREASE;
        }
        global.PPT_TID_INCREASE = setTimeout(() => {
            if (global.PPT_IID_INCREASE) {
                clearTimeout(global.PPT_IID_INCREASE);
                delete global.PPT_IID_INCREASE;
            }
            global.PPT_IID_INCREASE = setInterval(() => {
                this.increase(e);
            }, 10);
        }, 600);
        this.increase(e);
    }
    stopIncrease() {
        if (global.PPT_TID_INCREASE) {
            clearTimeout(global.PPT_TID_INCREASE);
            delete global.PPT_TID_INCREASE;
        }
        if (global.PPT_IID_INCREASE) {
            clearTimeout(global.PPT_IID_INCREASE);
            delete global.PPT_IID_INCREASE;
        }
    }
    increase(
        e: MouseEvent | TouchEvent | WheelEvent
    ) {
        const delta = e.ctrlKey ? 100n : e.shiftKey ? 10n : 1n;
        const { amount, max, onUpdate } = this.props;
        if (amount + delta <= max) {
            if (onUpdate) onUpdate({
                ...this.props, amount: amount + delta
            });
        } else {
            this.stopIncrease();
        }
        e.preventDefault();
    }
    increaseByWheel(
        e: WheelEvent
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY < 0) {
            this.increase(e);
        }
    }
    componentDidMount() {
        const $amount = this.ref<HTMLElement>('amount').current;
        $amount?.addEventListener(
            'wheel', this.decreaseByWheel.bind(this), {
                passive: false
            }
        );
        $amount?.addEventListener(
            'wheel', this.increaseByWheel.bind(this), {
                passive: false
            }
        );
    }
}
export default PptAmount;