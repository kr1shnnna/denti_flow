
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";
import FeaturedDentists from "../components/FeaturedDentists";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <WhyChoose />

      <FeaturedDentists />

      <HowItWorks />

      <Footer />
    </main>
  );
}

export default Home;
