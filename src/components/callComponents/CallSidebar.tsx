import CallFileDrop from "./CallFileDrop";

const CallSidebar = () => (
  <aside className="w-full flex flex-col gap-3 md:gap-4">
    {/* Meeting Overview */}
    <div className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 shadow-xl mb-2 border border-gray-200">
      <h2 className="text-base md:text-lg font-bold text-accent mb-2">
        Meeting overview
      </h2>
      <p className="text-xs md:text-sm text-[var(--color-text)] opacity-80 mb-2 leading-relaxed">
        Our weekly design meeting serves as a collaborative space for
        cross-functional teams to discuss ongoing projects, review new designs,
        and address any blockers. We encourage open communication and creative
        problem-solving to ensure consistently high-quality solutions for our
        clients.
      </p>
    </div>
    <CallFileDrop />
  </aside>
);

export default CallSidebar;
