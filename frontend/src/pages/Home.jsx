
import Navbar from "../components/Navbar";

function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero will go here */}
      <section className="min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold text-slate-900">
            DentiFlow
          </h1>
        </div>
      </section>
    </main>
  );
}

export default Home;
