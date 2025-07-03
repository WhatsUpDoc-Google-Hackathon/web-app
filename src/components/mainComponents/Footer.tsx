import { FaGithub } from "react-icons/fa";

const Footer = () => (
  <footer className="w-full bg-[var(--color-bg-secondary)] border-t border-gray-200 py-4 px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 relative z-50">
    <div className="flex items-center gap-2 mb-2 md:mb-0">
      <span className="font-bold text-accent text-base">MedAI</span>
      <span className="hidden md:inline">|</span>
      <span className="hidden md:inline">Empowering Healthcare</span>
    </div>
    <div className="flex items-center gap-4">
      <a
        href="#"
        className="hover:text-accent transition-colors flex items-center gap-1"
        title="GitHub"
      >
        <FaGithub className="w-4 h-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </div>
    <div className="mt-2 md:mt-0">
      &copy; {new Date().getFullYear()} MedAI. All rights reserved.
    </div>
  </footer>
);

export default Footer;
