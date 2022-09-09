import './selector.scss';

import { App } from '../../source/app';
import { Tokenizer } from '../../source/token';
import { Token } from '../../source/redux/types';
import { Tooltip } from '../tooltips';

import React, { MouseEvent } from 'react';
import { Unsubscribe } from 'redux';

type Props = {
    token: Token;
}
type State = {
    switching: boolean;
}
function state() {
    return { switching: false };
}
export class Selector extends React.Component<
    Props, State
> {
    constructor(props: {
        token: Token
    }) {
        super(props);
        this.state = state();
    }
    componentDidMount() {
        this.unTokenSwitch = App.onTokenSwitch(() => {
            this.setState({ switching: true });
        });
        this.unTokenSwitched = App.onTokenSwitched(() => {
            this.setState({ switching: false });
        });
    }
    componentWillUnmount() {
        if (this.unTokenSwitch) {
            this.unTokenSwitch();
        }
    }
    render() {
        return <div
            className='btn-group selectors' role='group'
        >
            {this.$anchor(Token.THOR)}
            {this.$anchor(Token.LOKI)}
            {this.$anchor(Token.ODIN)}
        </div>;
    }
    $anchor(
        token: Token
    ) {
        const selector = `selector-${Tokenizer.lower(token)}`;
        const active = this.props.token === token ? 'active' : '';
        const disabled = this.state.switching ? 'pseudo-disabled' : '';
        const classes = [
            'btn btn-outline-warning', selector, active, disabled
        ];
        return <a type='button'
            className={classes.join(' ')}
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-fixed='true'
            href={`?token=${token}`}
            onClick={(e) => this.switch(e, token)}
            onMouseLeave={on_leave}
        >
            {this.$spinner(token)}
            {this.$image(token)}
            {this.$label(token)}
        </a>;
        function on_leave(
            e: MouseEvent<HTMLAnchorElement>
        ) {
            Tooltip.getInstance(e.currentTarget)?.enable();
        }
    }
    switch(
        e: MouseEvent<HTMLAnchorElement>, token: Token
    ) {
        if (e.ctrlKey === false) {
            e.preventDefault();
            App.switchToken(token);
        }
    }
    $spinner(
        token: Token
    ) {
        return Spinner({ show: this.show(token) });
    }
    $image(
        token: Token
    ) {
        const token_lc = Tokenizer.lower(this.props.token);
        const fixed_lc = Tokenizer.lower(token);
        const classes = [
            'float-sm-start', this.hide(token) ? 'd-none' : '', token_lc
        ];
        return <img
            height={24} width={24}
            className={classes.join(' ')}
            src={`/images/svg/${fixed_lc}-black.svg`}
        />;
    }
    $label(
        token: Token
    ) {
        return <span className='d-none d-sm-inline'>{token}</span>;
    }
    show(
        token: Token
    ) {
        const eq = this.props.token === token;
        return eq && this.state.switching;
    }
    hide(
        token: Token
    ) {
        const eq = this.props.token === token;
        return eq && this.state.switching;
    }
    unTokenSwitch?: Unsubscribe;
    unTokenSwitched?: Unsubscribe;
}
function Spinner(
    state: { show: boolean }
) {
    const classes = [
        'spinner spinner-border spinner-border-sm',
        'float-sm-start', !state.show ? 'd-none' : ''
    ];
    return <span
        className={classes.join(' ')} role='status'
    />;
}
export default Selector;
