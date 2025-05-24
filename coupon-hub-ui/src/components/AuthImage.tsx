import coupon from "../assets/coupon_login2.svg";
import "../styles/Auth.css";

export const AuthImage = () => {
  return (
    <div className="auth-image">
      <img src={coupon} alt="Coupons" />
    </div>
  );
};
