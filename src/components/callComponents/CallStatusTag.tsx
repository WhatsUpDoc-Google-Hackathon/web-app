import { AvatarStatus } from "../../heygen/StreamingAvatarContext";

const AnimatedDots = () => (
  <span className="inline-flex">
    <span className="animate-pulse delay-0">.</span>
    <span className="animate-pulse delay-75">.</span>
    <span className="animate-pulse delay-150">.</span>
  </span>
);

const CallStatusTag = ({ status }: { status: AvatarStatus }) => (
  <span className="bg-accent/80 backdrop-blur-sm text-primary text-xs font-semibold px-4 py-1 rounded-full shadow">
    {status === AvatarStatus.READY ? (
      "Call in Progress with an AI Assistant"
    ) : status === AvatarStatus.SPEAKING ? (
      <>
        The AI Assistant is speaking
        <AnimatedDots />
      </>
    ) : (
      `Call Disconnected: ${status.toUpperCase()}`
    )}
  </span>
);

export default CallStatusTag;
