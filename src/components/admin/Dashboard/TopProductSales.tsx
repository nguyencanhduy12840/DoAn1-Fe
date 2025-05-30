import { InventoryDetail } from "../../../types/InventoryDetail";

interface Props {
  topSale: InventoryDetail[];
}

const baseURL = "http://localhost:8080";

const TopProductSales = ({ topSale }: Props) => {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200 rounded-xl h-[360px]">
      <div className="card-body">
        <h2 className="text-center font-semibold text-lg">Top Product Sales</h2>
        <ul className="mt-4 space-y-4 overflow-y-auto">
          {topSale.map((product, index) => (
            <li key={index} className="flex items-center gap-4">
              <img
                src={baseURL + product.product.productImage}
                alt="product"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{product.product.name}</p>
                <p className="text-sm text-gray-500">
                  {product.totalSold} sold - ${product.product.price}/item
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopProductSales;
