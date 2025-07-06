import { FaGithub } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";

const Footer = () => (
  <footer className="w-full bg-[var(--color-bg-secondary)] border-t border-gray-200 py-4 px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 relative z-50">
    <div className="flex items-center gap-2 mb-2 md:mb-0">
      <span className="font-bold text-accent text-base">WhatsUpDoc</span>
      <span className="hidden md:inline">|</span>
      <span className="hidden md:inline">Empowering Healthcare with AI</span>
    </div>
    <div className="flex items-center gap-4">
      <a
        href="https://github.com/WhatsUpDoc-Google-Hackathon"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-accent transition-colors flex items-center gap-1"
        title="GitHub Repository"
      >
        <FaGithub className="w-4 h-4" />
        <span className="hidden sm:inline">GitHub</span>
      </a>
      <a
        href="https://huggingface.co/acours/medgemma-4b-it-sft-lora-cardiovascular-disease"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-accent transition-colors flex items-center gap-1"
        title="Hugging Face Model"
      >
        <SiHuggingface className="w-4 h-4" />
        <span className="hidden sm:inline">Hugging Face</span>
      </a>
    </div>
    <div className="mt-2 md:mt-0">
      &copy; {new Date().getFullYear()} WhatsUpDoc. All rights reserved.
    </div>
  </footer>
);

export default Footer;
