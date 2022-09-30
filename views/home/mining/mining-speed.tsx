import { App } from '../../../source/app';
import { Miner } from '../../../source/miner';

import React from 'react';
import { DashCircle } from '../../../public/images/tsx';
import { PlusCircle } from '../../../public/images/tsx';

type Props = {
    disabled: boolean; speed: number;
    onSpeed?: (by: number) => void;
}
export class UiMiningSpeed extends React.Component<
    Props
> {
    render() {
        const { disabled, speed } = this.props;
        return <div
            className='btn-group tweak-mining' role='group'
        >
            {this.$decreaser(speed, disabled)}
            {this.$progressor(speed)}
            {this.$increaser(speed, disabled)}
        </div>;
    }
    $increaser(
        speed: number, disabled: boolean
    ) {
        return <div
            className='btn-group increaser' role='group'
        >
            <button type='button' id='increase'
                className='btn btn-outline-warning'
                data-bs-placement='top' data-bs-toggle='tooltip'
                disabled={!this.increasable(speed, disabled)}
                onClick={this.increase.bind(this, speed, disabled)}
            >
                <PlusCircle fill={true} />
            </button>
        </div>;
    }
    increasable(
        speed: number, disabled: boolean
    ) {
        return !disabled && speed <= 0.999;
    }
    increase(
        speed: number, disabled: boolean
    ) {
        if (!this.increasable(speed, disabled)) {
            return;
        }
        if (this.props.onSpeed) {
            this.props.onSpeed(+1 / Miner.WORKERS_MAX);
        }
    }
    $decreaser(
        speed: number, disabled: boolean
    ) {
        return <div
            className='btn-group decreaser' role='group'
        >
            <button type='button' id='decrease'
                className='btn btn-outline-warning'
                data-bs-toggle='tooltip' data-bs-placement='top'
                disabled={!this.decreasable(speed, disabled)}
                onClick={this.decrease.bind(this, speed, disabled)}
            >
                <DashCircle fill={true} />
            </button>
        </div>;
    }
    decreasable(
        speed: number, disabled: boolean
    ) {
        return !disabled && speed >= 0.001;
    }
    decrease(
        speed: number, disabled: boolean
    ) {
        if (!this.decreasable(speed, disabled)) {
            return;
        }
        if (this.props.onSpeed) {
            this.props.onSpeed(-1 / Miner.WORKERS_MAX);
        }
    }
    $progressor(
        speed: number
    ) {
        return <div
            className='btn-group progressor' role='group'
            data-bs-toggle='tooltip' data-bs-placement='top'
            title={`Mining speed: ${(100 * speed).toFixed(3)}%`}
        >
            <div className='progress'>
                <div id='speed'
                    role='progressbar' aria-label='mining speed controller'
                    className={`progress-bar ${this.indicator(speed)}`}
                    style={{ width: `${100 * speed}%` }}
                />
            </div>
        </div>;
    }
    indicator(
        speed: number
    ) {
        return speed < 1 ? 'with-indicator' : '';
    }
    onWheel(
        e: WheelEvent
    ) {
        e.preventDefault();
        e.stopPropagation();
        if (e.deltaY < 0) {
            const { speed, disabled } = this.props;
            this.increase(speed, disabled);
        }
        if (e.deltaY > 0) {
            const { speed, disabled } = this.props;
            this.decrease(speed, disabled);
        }
        return false;
    }
    componentDidMount = () => {
        if (document.body.clientWidth > 576) {
            const $inc = document.querySelector('#increase');
            $inc?.setAttribute('title', 'Increase mining speed');
            const $dec = document.querySelector('#decrease');
            $dec?.setAttribute('title', 'Decrease mining speed');
        }
        const $progressor = document.querySelector<HTMLElement>(
            '.progressor'
        );
        $progressor?.addEventListener('wheel', this.onWheel.bind(this), {
            passive: false
        });
    }
    componentDidUpdate() {
        App.event.emit('refresh-tips');
    }
}
export default UiMiningSpeed;
