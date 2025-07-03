import { AvatarStatus } from "../../heygen/StreamingAvatarContext";

const AnimatedDots = () => (
  <span className="inline-flex">
    <span className="animate-pulse delay-0">.</span>
    <span className="animate-pulse delay-75">.</span>
    <span className="animate-pulse delay-150">.</span>
  </span>
);

const CallStatusTag = ({ status }: { status: AvatarStatus }) => (
  <span className="bg-accent/80 backdrop-blur-sm text-primary text-xs font-semibold px-2 md:px-4 py-1 rounded-full shadow">
    {status === AvatarStatus.READY ? (
      <>
        <span className="hidden sm:inline">
          Call in Progress with an AI Assistant
        </span>
        <span className="sm:hidden">AI Call Active</span>
      </>
    ) : status === AvatarStatus.SPEAKING ? (
      <>
        <span className="hidden sm:inline">
          The AI Assistant is speaking
          <AnimatedDots />
        </span>
        <span className="sm:hidden">
          AI Speaking
          <AnimatedDots />
        </span>
      </>
    ) : (
      <>
        <span className="hidden sm:inline">{`Call Disconnected: ${status.toUpperCase()}`}</span>
        <span className="sm:hidden">Disconnected</span>
      </>
    )}
  </span>
);

export default CallStatusTag;
