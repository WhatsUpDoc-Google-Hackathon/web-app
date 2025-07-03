import { LuTimer } from "react-icons/lu";

const CallTimer = ({ elapsed }: { elapsed: number }) => {
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  return (
    <span className="bg-accent/80 backdrop-blur-sm text-primary font-mono px-3 py-1 rounded-full shadow flex items-center gap-1 text-sm text-center">
      <LuTimer className="text-primary text-lg" /> {formatTime(elapsed)}
    </span>
  );
};

export default CallTimer;
