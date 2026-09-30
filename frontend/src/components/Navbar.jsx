const Navbar = () => {
  return (
    <nav className="w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <a href="/" className="flex items-center">
          <img
            src="/logo/dentiflow-logo.png"
            alt="DentiFlow"
            className="h-10 w-auto"
          />
        </a>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600"
          >
            Home
          </a>

          <a
            href="/services"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600"
          >
            Services
          </a>

          <a
            href="/dentists"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600"
          >
            Dentists
          </a>

          <a
            href="/about"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600"
          >
            About
          </a>

          <a
            href="/contact"
            className="text-sm font-medium text-slate-700 transition-colors hover:text-teal-600"
          >
            Contact
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-teal-600 sm:block">
            Login
          </button>

          <button className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
            Book Appointment
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
