import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
  TaskMode,
  VoiceEmotion,
  type StartAvatarResponse,
} from "@heygen/streaming-avatar";
import { useAvatarStore } from "./avatarStore";

export interface AvatarStreamProps {
  token: string;
  avatarName: string;
  voiceId?: string;
  knowledgeId?: string;
  language?: string;
  quality?: keyof typeof AvatarQuality;
  onStatus?: (status: string) => void;
}

export interface AvatarStreamHandle {
  speak: (text: string, taskType?: TaskType, taskMode?: TaskMode) => void;
  stop: () => void;
  interrupt: () => void;
}

const AvatarStream = forwardRef<AvatarStreamHandle, AvatarStreamProps>(
  (
    {
      token,
      avatarName,
      voiceId = "default",
      knowledgeId,
      language = "en",
      quality = "High",
      onStatus,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const avatarRef = useRef<any>(null);
    const [sessionActive, setSessionActive] = useState(false);
    const setAvatarReady = useAvatarStore((s) => s.setAvatarReady);

    useImperativeHandle(ref, () => ({
      speak: (
        text: string,
        taskType: TaskType = TaskType.TALK,
        taskMode: TaskMode = TaskMode.SYNC
      ) => {
        if (avatarRef.current && useAvatarStore.getState().avatarReady) {
          console.log("Speaking with HeyGen AvatarStream:", text);
          avatarRef.current.speak({ text, task_type: taskType, taskMode });
        }
      },
      stop: () => {
        if (avatarRef.current && sessionActive) {
          avatarRef.current.stopAvatar();
          setSessionActive(false);
        }
      },
      interrupt: () => {
        if (avatarRef.current) avatarRef.current.interrupt();
      },
    }));

    useEffect(() => {
      let streamingAvatar: any;
      let destroyed = false;
      async function startSession() {
        console.log("Starting session AvatarStream");
        streamingAvatar = new StreamingAvatar({ token });
        avatarRef.current = streamingAvatar;
        if (onStatus) onStatus("Creating session...");
        streamingAvatar.on(StreamingEvents.STREAM_READY, (event: any) => {
          console.log(
            "Response from stream ready AvatarStream",
            event,
            videoRef.current
          );
          if (videoRef.current && event.detail && event.detail.stream) {
            console.log("Stream ready AvatarStream");
            videoRef.current.srcObject = event.detail.stream;
            setAvatarReady(true);
            if (onStatus) onStatus("Stream ready");
          }
        });
        streamingAvatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log("Stream disconnected AvatarStream");
          setAvatarReady(false);
          setSessionActive(false);
          if (onStatus) onStatus("Stream disconnected");
        });
        streamingAvatar.on(StreamingEvents.AVATAR_START_TALKING, () => {
          console.log("Avatar started talking AvatarStream");
          if (onStatus) onStatus("Avatar started talking");
        });
        streamingAvatar.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
          console.log("Avatar stopped talking AvatarStream");
          if (onStatus) onStatus("Avatar stopped talking");
        });
        try {
          console.log("Creating start avatar AvatarStream");
          const avatar: StartAvatarResponse =
            await streamingAvatar.createStartAvatar({
              quality: AvatarQuality[quality],
              avatarName,
              knowledgeId,
              voice: voiceId
                ? {
                    voiceId,
                    rate: 1.0,
                    emotion: VoiceEmotion.FRIENDLY,
                  }
                : undefined,
              language,
            });
          console.log("Avatar created: ", avatar);
          setSessionActive(true);
        } catch (e) {
          console.log("Error AvatarStream");
          if (onStatus) onStatus("Error: " + (e as Error).message);
        }
      }
      startSession();
      return () => {
        destroyed = true;
        if (avatarRef.current && sessionActive) {
          avatarRef.current.stopAvatar();
          setSessionActive(false);
        }
        setAvatarReady(false);
      };
    }, [
      token,
      avatarName,
      voiceId,
      knowledgeId,
      language,
      quality,
      onStatus,
      setAvatarReady,
    ]);

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`rounded-xl w-full h-full bg-black transition-opacity duration-300 ${
            useAvatarStore.getState().avatarReady
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        />
      </div>
    );
  }
);

export default AvatarStream;
