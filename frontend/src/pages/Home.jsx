
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyChoose from "../components/WhyChoose";
import FeaturedDentists from "../components/FeaturedDentists";

function Home() {
  return (
    <main>
      <Navbar />

      <Hero />

      <WhyChoose />

      <FeaturedDentists />
    </main>
  );
}

export default Home;
