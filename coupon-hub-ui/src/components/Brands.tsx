import { useNavigate } from "react-router-dom";
import amazon from "../assets/amazon-icon.svg";
import myntra from "../assets/Myntra-icon-logo.svg";
import flipkart from "../assets/flipkart-icon.svg";
import ajio from "../assets/ajio_logo.jpeg";
import "../styles/Brands.css";

const brands = [
  { name: "Amazon", image: amazon },
  { name: "Myntra", image: myntra },
  { name: "Flipkart", image: flipkart },
  { name: "Ajio", image: ajio },
];

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
