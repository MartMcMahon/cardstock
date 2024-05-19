import { useSelect } from "./hooks/useSelect";

const Networth = () => {
  const { networth } = useSelect((store) => store);

  return <div>{networth}</div>;
};

export default Networth;
