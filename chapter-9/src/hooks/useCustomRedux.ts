import type { RootState } from "../store/store";
import { useDispatch as useDefaultDispatch, useSelector as useDefaultSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch } from "../store/store";

export const useDispatch: () => AppDispatch = useDefaultDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector;