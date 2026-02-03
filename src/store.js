import {configureStore} from '@reduxjs/toolkit';
import { useReducer } from './redux/user/reducers.js';

export const store = configureStore({
    reducer: {
        userDetails: useReducer
    }
});