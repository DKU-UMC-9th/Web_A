import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 타입이 지정된 useDispatch와 useSelector hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T,>(selector: (state: RootState) => T) => useSelector(selector);
