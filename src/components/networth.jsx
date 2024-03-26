import { useSelector } from "react-redux";

const NetWorth = () => {
  const state = useSelector((state) => state);

  return <div>{state.networth}</div>;
};

export default NetWorth;
