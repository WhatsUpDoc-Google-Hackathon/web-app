import { MdSupportAgent } from "react-icons/md";

const professorAvatar =
  "https://ui-avatars.com/api/?name=Prof+John+Smith&background=0D8ABC&color=fff&rounded=true";

const DoctorNavbar = () => (
  <div className="rounded-xl md:rounded-2xl bg-[var(--color-bg-secondary)] px-3 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between shadow-lg mb-4 md:mb-6 lg:mb-8 border border-gray-200">
    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
      <img
        src={professorAvatar}
        alt="Professor Avatar"
        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-accent bg-gray-200 flex-shrink-0"
      />
      <span className="font-semibold text-sm md:text-base lg:text-lg text-[var(--color-text)] truncate">
        <span className="hidden sm:inline">Prof. John Smith</span>
        <span className="sm:hidden">Prof. Smith</span>
      </span>
    </div>
    <div className="flex items-center flex-shrink-0">
      <button
        className="flex items-center gap-1 md:gap-2 rounded-lg bg-[var(--color-accent)] hover:bg-primary transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-accent px-3 md:px-4 lg:px-5 py-2 text-white font-semibold text-xs md:text-sm lg:text-base cursor-pointer"
        title="Support"
      >
        <MdSupportAgent className="text-white text-lg md:text-xl lg:text-2xl" />
        <span className="hidden sm:inline">Support</span>
      </button>
    </div>
  </div>
);

export default DoctorNavbar;
