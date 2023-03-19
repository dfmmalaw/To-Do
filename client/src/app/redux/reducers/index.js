import { combineReducers } from 'redux';
import taskReducer from './task.reducer';
import msgReducer from './message.reducer';
import loadingReducer from './loading.reducer';

const rootReducer = combineReducers({
	task: taskReducer,
	message: msgReducer,
	loading: loadingReducer,
});

export default rootReducer;