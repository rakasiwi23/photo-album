import { useParams, useLocation } from "react-router-dom";

export function Albums() {
  const param = useParams();
  console.log(param);
  return <div>Album</div>;
}
