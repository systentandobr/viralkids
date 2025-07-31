import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Franchise from "@/components/Franchise";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <Franchise />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;