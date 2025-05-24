import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";
import "../styles/Home.css";
import Brands from "../components/Brands";

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <main>
        <Brands />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
