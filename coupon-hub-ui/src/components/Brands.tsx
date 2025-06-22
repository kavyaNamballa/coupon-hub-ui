import { useNavigate } from "react-router-dom";
import "../styles/Brands.css";
import { brands } from "../enum/brands";

const Brands = () => {
  const navigate = useNavigate();

  const handleClick = (brandName: string) => {
    navigate(`/coupons?brand=${brandName}`);
  };

  return (
    <div className="brand-icons-container">
      <h2 className="brand-icons-title">Top Stores</h2>
      <div className="brand-grid">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="brand-card"
            onClick={() => handleClick(brand.name)}
          >
            <img src={brand.image} alt={brand.name} />
            <span>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
