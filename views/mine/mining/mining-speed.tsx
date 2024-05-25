/* eslint react/prop-types: [off] */
import { nomobi } from '../../../source/functions';
import { Miner } from '../../../source/miner';
import { Button, Div } from '../../../source/react';

import React from 'react';
import { DashCircle, PlusCircle } from '../../../public/images/tsx';

type Props = {
    disabled: boolean; speed: number;
    onSpeed?: (by: number) => void;
}
export class UiMiningSpeed extends React.Component<
    Props
> {
    render() {
        const { disabled, speed } = this.props;
        return <Div
            className='btn-group tweak-mining' role='group'
        >
            {this.$decreaser(speed, disabled)}
            {this.$progressor(speed)}
            {this.$increaser(speed, disabled)}
        </Div>;
    }
    $increaser(
        speed: number, disabled: boolean
    ) {
        return <Div
            className='btn-group increaser' role='group'
        >
            <Button id='increase'
                className='btn btn-outline-warning'
                disabled={!this.increasable(speed, disabled)}
                onClick={this.increase.bind(this, speed, disabled)}
                title={nomobi('Increase mining speed')}
            >
                <PlusCircle fill={true} />
            </Button>
        </Div>;
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
        return <Div
            className='btn-group decreaser' role='group'
        >
            <Button id='decrease'
                className='btn btn-outline-warning'
                disabled={!this.decreasable(speed, disabled)}
                onClick={this.decrease.bind(this, speed, disabled)}
                title={nomobi('Decrease mining speed')}
            >
                <DashCircle fill={true} />
            </Button>
        </Div>;
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
        return <Div
            className='btn-group progressor' role='group'
            title={`Mining speed: ${(100 * speed).toFixed(3)}%`}
        >
            <Div className='progress'>
                <Div id='speed'
                    role='progressbar' aria-label='mining speed controller'
                    className={`progress-bar ${this.indicator(speed)}`}
                    style={{ width: `${100 * speed}%` }}
                />
            </Div>
        </Div>;
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
        const $progressor = document.querySelector<HTMLElement>(
            '.progressor'
        );
        $progressor?.addEventListener('wheel', this.onWheel.bind(this), {
            passive: false
        });
    }
}
export default UiMiningSpeed;
