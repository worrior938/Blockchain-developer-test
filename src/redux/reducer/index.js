import handleCart from './handleCart'
import walletReducer from './walletSlice'
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    wallet: walletReducer,
})
export default rootReducers