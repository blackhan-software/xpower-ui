import { isPending, isRejected } from '@reduxjs/toolkit';
import { Alert, alert, Alerts } from '../../functions';

import * as actions from '../actions';
import { AppMiddleware } from '../store';

export const AlertManager: AppMiddleware = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(dispatch, getState);
    }
    if (actions.switchPage.match(action) ||
        actions.switchToken.match(action) ||
        isPending(action)
    ) {
        Alerts.hide({ id: 'am-warning' });
    }
    if (isRejected(action)) {
        warning(action.error.message);
    }
    return next(action);
};
function warning(
    message: string | undefined
) {
    if (message === undefined) {
        return;
    }
    if (message.match(/rejected/i)) {
        return;
    }
    alert(message, Alert.warning, {
        after: document.querySelector<HTMLElement>('content'),
        style: { margin: '-0.5em 0 0.5em 0' }, id: 'am-warning'
    });
}
export default AlertManager;
