import { useSelector } from "react-redux";
import { RootState } from "../store";
export const useSelect = useSelector.withTypes<RootState>();
