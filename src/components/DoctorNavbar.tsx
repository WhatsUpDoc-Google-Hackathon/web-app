import { MdSupportAgent } from "react-icons/md";

const professorAvatar =
  "https://ui-avatars.com/api/?name=Prof+John+Smith&background=0D8ABC&color=fff&rounded=true";

const DoctorNavbar = () => (
  <div className="rounded-2xl bg-[var(--color-bg-secondary)] px-8 py-4 flex items-center justify-between shadow-lg mb-8 border border-gray-200">
    <div className="flex items-center gap-3">
      <img
        src={professorAvatar}
        alt="Professor Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-accent bg-gray-200"
      />
      <span className="font-semibold text-lg text-[var(--color-text)]">
        Prof. John Smith
      </span>
    </div>
    <div className="flex items-center">
      <button
        className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] hover:bg-primary transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-accent px-5 py-2 text-white font-semibold text-base cursor-pointer"
        title="Support"
      >
        <MdSupportAgent className="text-white text-2xl" />
        <span>Support</span>
      </button>
    </div>
  </div>
);

export default DoctorNavbar;
