import { useLocation } from "react-router-dom";

const ProductDetailsPage = () => {
  
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");

  console.log(id);

  return <div>ProductDetailsPage</div>;
};

export default ProductDetailsPage;
