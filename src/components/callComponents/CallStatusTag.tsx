import { AvatarStatus } from "../../heygen/StreamingAvatarContext";

const CallStatusTag = ({ status }: { status: AvatarStatus }) => (
  <span className="bg-accent/80 backdrop-blur-sm text-primary text-xs font-semibold px-4 py-1 rounded-full shadow">
    {status === AvatarStatus.READY
      ? "Call in Progress with an AI Assistant"
      : `Call Disconnected: ${status.toUpperCase()}`}
  </span>
);

export default CallStatusTag;
