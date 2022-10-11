import { AnyAction, AsyncThunkPayloadCreator, createAsyncThunk, Dispatch } from '@reduxjs/toolkit';
import { AppState } from '.';

export function AppThunk<
    Returned, ThunkArg = void
>(
    prefix: string, creator: AsyncThunkPayloadCreator<Returned, ThunkArg, {
        dispatch: Dispatch<AnyAction>; state: AppState;
    }>
) {
    return createAsyncThunk<Returned, ThunkArg>(prefix, creator);
}
export default AppThunk;
