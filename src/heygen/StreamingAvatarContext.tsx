import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  VoiceEmotion,
  TaskType,
  TaskMode,
  STTProvider,
  VoiceChatTransport,
} from "@heygen/streaming-avatar";
import { get_access_token } from "../api/heygen-token/getAccessToken";

export enum AvatarStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  READY = "ready",
  SPEAKING = "speaking",
  ERROR = "error",
}

interface AvatarContextValue {
  /** the raw SDK instance */
  avatar?: StreamingAvatar;
  /** the current WebRTC MediaStream for video rendering */
  mediaStream?: MediaStream;
  /** current avatar status */
  status: AvatarStatus;
  /** whether avatar session is active and ready */
  isReady: boolean;
  startSession: (opts: {
    avatarName: string;
    knowledgeId?: string;
    voiceId?: string;
    language?: string;
  }) => Promise<void>;
  speakText: (text: string, repeat?: boolean) => Promise<void>;
  stopSession: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export const StreamingAvatarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      get_access_token().then((token) => setToken(token));
    }
  }, []);

  const avatarRef = useRef<StreamingAvatar>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<AvatarStatus>(AvatarStatus.DISCONNECTED);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;
    console.log("Found token, initializing avatar...");
    avatarRef.current = new StreamingAvatar({ token });
    const av = avatarRef.current;

    av.on(StreamingEvents.STREAM_READY, (evt: any) => {
      if (evt.detail) {
        console.log("STREAM_READY", evt.detail);
        setMediaStream(evt.detail);
        setStatus(AvatarStatus.READY);
      } else {
        console.warn("STREAM_READY payload:", evt);
      }
    });

    // Track when avatar starts/stops talking
    av.on(StreamingEvents.AVATAR_START_TALKING, () => {
      console.log("Avatar started talking");
      setStatus(AvatarStatus.SPEAKING);
    });

    av.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
      console.log("Avatar stopped talking");
      setStatus(AvatarStatus.READY);
    });

    // Track stream disconnection
    av.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      setMediaStream(null);
      setStatus(AvatarStatus.DISCONNECTED);
    });

    startSession({ avatarName: "Ann_Doctor_Sitting_public" });

    return () => {
      if (av && sessionIdRef.current) {
        console.log("Stopping avatar session on cleanup...");
        av.stopAvatar();
      }
      av.off(StreamingEvents.STREAM_READY, () => {});
      av.off(StreamingEvents.AVATAR_START_TALKING, () => {});
      av.off(StreamingEvents.AVATAR_STOP_TALKING, () => {});
      av.off(StreamingEvents.STREAM_DISCONNECTED, () => {});
    };
  }, [token]);

  const startSession = async ({
    avatarName,
    knowledgeId,
    voiceId,
    language,
  }: {
    avatarName: string;
    knowledgeId?: string;
    voiceId?: string;
    language?: string;
  }) => {
    if (!avatarRef.current) {
      console.error("Avatar reference not found");
      return;
    }

    setStatus(AvatarStatus.CONNECTING);

    const startReq = {
      quality: AvatarQuality.High,
      avatarName,
      knowledgeId,
      voice: {
        voiceId,
        rate: 1.0,
        emotion: VoiceEmotion.BROADCASTER,
        elevenlabsSettings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.5,
        },
      },
      sttSettings: {
        provider: STTProvider.DEEPGRAM,
        confidence: 0.55,
      },
      language,
      voiceChatTransport: VoiceChatTransport.WEBSOCKET,
    };

    try {
      const resp = await avatarRef.current.createStartAvatar(startReq);
      sessionIdRef.current = resp.session_id;
    } catch (error) {
      console.error("Failed to start avatar session:", error);
      setStatus(AvatarStatus.ERROR);
      throw error;
    }
  };

  const speakText = async (text: string, repeat = false) => {
    if (!avatarRef.current) {
      console.error("Avatar reference not found");
      return;
    }
    await avatarRef.current.speak({
      text,
      task_type: repeat ? TaskType.REPEAT : TaskType.TALK,
      taskMode: TaskMode.SYNC,
    });
  };

  const stopSession = async () => {
    console.log("Stopping avatar session...");
    if (!avatarRef.current) return;
    await avatarRef.current.stopAvatar();
    setMediaStream(null);
    setStatus(AvatarStatus.DISCONNECTED);
  };

  // Computed value for isReady
  const isReady =
    status === AvatarStatus.READY || status === AvatarStatus.SPEAKING;

  return (
    <AvatarContext.Provider
      value={{
        avatar: avatarRef.current || undefined,
        mediaStream: mediaStream || undefined,
        status,
        isReady,
        startSession,
        speakText,
        stopSession,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useStreamingAvatar = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error(
      "useStreamingAvatar must be used within a StreamingAvatarProvider"
    );
  }
  return ctx;
};
