import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAProductQuery } from "@/features/api/productSlice";
import { parseProductData } from "@/utils/parseProductData";
import { useLocation, useNavigate } from "react-router-dom";

const ProductDetailsPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");
  const { data: products } = useGetAProductQuery(id || "") as any;

  const product = parseProductData(products?.data);



  const handleBackClick = () => {
    navigate(-1);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 font-sans">
      <Button onClick={handleBackClick} className="mb-6">
        Back
      </Button>

      <Card className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
        </div>

        <CardContent className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <ul className="space-y-2">
            <li>
              <strong>Unit Price:</strong> ${product.unitPrice.toFixed(2)}
            </li>
            <li>
              <strong>Rating:</strong> {product.rating}
            </li>
            <li>
              <strong>Categories:</strong> {product.categories.join(", ")}
            </li>
            <li>
              <strong>Subcategories:</strong> {product.subCategories.join(", ")}
            </li>
            <li>
              <strong>Dryness:</strong> {product.dryness}
            </li>
            <li>
              <strong>Size Types:</strong> {product.sizeTypes.join(", ")}
            </li>
            <li>
              <strong>Collectables:</strong> {product.collectables.join(", ")}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;
