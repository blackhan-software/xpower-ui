import { Alert, Alerts } from '../../source/functions';
import { versionBy } from '../../source/redux/selectors';
import { History, Token } from '../../source/redux/types';
import { Version } from '../../source/types';

import React from 'react';

export function $notify(
    history: History, token: Token
) {
    const versions = versionBy({ history }, token);
    if (versions.length) {
        const $alert = Alerts.show(
            $message(versions[0], token), Alert.primary, {
                html: true, id: versions[0]
            }
        );
        return <NotificationBoundary>{$alert}</NotificationBoundary>;
    } else {
        return <NotificationBoundary>{null}</NotificationBoundary>;
    }
}
function $message(
    version: Version, token: Token
) {
    const href = `/migrate?token=${token}&version-source=${version}`;
    const $Migrate = <a href={href} style={{color:'inherit'}}>Migrate</a>;
    const $migrate = <a href={href} style={{color:'inherit'}}>migrate</a>;
    const $version = <strong>{version}</strong>;
    const $text_xl = <span className='d-none d-xl-block'>
        Old XPower {$version} tokens have been detected; {$migrate} them to the latest version!
    </span>;
    const $text_sm = <span className='d-none d-sm-block d-xl-none'>
        Old {$version} tokens have been detected; {$migrate} them to latest version!
    </span>;
    const $text_xs = <span className='d-block d-sm-none'>
        {$Migrate} from {$version} to latest!
    </span>;
    return [<span key={String.random()}>{$text_xl}{$text_sm}{$text_xs}</span>];
}
class NotificationBoundary extends React.Component<
    React.PropsWithChildren, { hasError: boolean; }
> {
    constructor(props: React.PropsWithChildren) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }
    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }
        return null;
    }
}
export default $notify;
