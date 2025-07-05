import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { AIResponse } from "../../api/websocket/WebSocketService";
import CallFileDrop from "./CallFileDrop";

const CallSidebar = ({
  lastAIResponse,
}: {
  lastAIResponse: AIResponse | undefined;
}) => {
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastAIResponse && lastAIResponse.content) {
      // Check if this response is already in the array (to avoid duplicates)
      setResponses((prev) => {
        const isDuplicate = prev.some(
          (response) =>
            response.content === lastAIResponse.content &&
            response.meta.timestamp === lastAIResponse.meta.timestamp
        );

        if (!isDuplicate) {
          return [...prev, lastAIResponse];
        }
        return prev;
      });
    }
  }, [lastAIResponse]);

  // Auto-scroll to bottom when new responses are added
  useEffect(() => {
    if (scrollContainerRef.current && responses.length > 0) {
      // Small delay to ensure the new element is rendered
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [responses.length]);

  return (
    <aside className="w-full flex flex-col gap-3 md:gap-4">
      {/* Meeting Overview */}
      <div className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 shadow-xl mb-2 border border-gray-200">
        <h2 className="text-base md:text-lg font-bold text-accent mb-4">
          Meeting overview
        </h2>
        <div
          ref={scrollContainerRef}
          className="space-y-3 max-h-96 overflow-y-auto scroll-smooth"
        >
          {responses.length === 0 ? (
            <p className="text-xs md:text-sm text-[var(--color-text)] opacity-50 italic">
              Waiting for AI responses...
            </p>
          ) : (
            responses.map((response, index) => (
              <div
                key={`${response.meta.timestamp}-${index}`}
                className="border-l-4 border-blue-200 pl-3 py-2 bg-gray-50 rounded-r-lg transition-all duration-500 hover:bg-gray-100 animate-in slide-in-from-left-5 fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationDuration: "0.5s",
                  animationFillMode: "both",
                }}
              >
                <div className="text-xs md:text-sm text-[var(--color-text)] opacity-80 leading-relaxed markdown-content">
                  <ReactMarkdown
                    components={{
                      // Override default header styles to maintain small text size
                      h1: ({ children }) => (
                        <h1 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h4>
                      ),
                      h5: ({ children }) => (
                        <h5 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h5>
                      ),
                      h6: ({ children }) => (
                        <h6 className="text-xs md:text-sm font-bold mb-1">
                          {children}
                        </h6>
                      ),
                      // Override paragraph styles to maintain consistent sizing
                      p: ({ children }) => (
                        <p className="text-xs md:text-sm mb-2 last:mb-0">
                          {children}
                        </p>
                      ),
                      // Override list styles
                      ul: ({ children }) => (
                        <ul className="text-xs md:text-sm list-disc list-inside mb-2">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="text-xs md:text-sm list-decimal list-inside mb-2">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-xs md:text-sm mb-1">{children}</li>
                      ),
                      // Override code styles
                      code: ({ children }) => (
                        <code className="text-xs md:text-sm bg-gray-200 px-1 py-0.5 rounded">
                          {children}
                        </code>
                      ),
                      // Override blockquote styles
                      blockquote: ({ children }) => (
                        <blockquote className="text-xs md:text-sm border-l-2 border-gray-300 pl-2 italic">
                          {children}
                        </blockquote>
                      ),
                      // Override link styles
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-xs md:text-sm text-blue-600 hover:underline"
                        >
                          {children}
                        </a>
                      ),
                      // Override strong/bold styles
                      strong: ({ children }) => (
                        <strong className="text-xs md:text-sm font-bold">
                          {children}
                        </strong>
                      ),
                      // Override emphasis/italic styles
                      em: ({ children }) => (
                        <em className="text-xs md:text-sm italic">
                          {children}
                        </em>
                      ),
                    }}
                  >
                    {response.content}
                  </ReactMarkdown>
                </div>
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                  <span>{response.meta.source}</span>
                  <span>
                    {new Date(response.meta.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <CallFileDrop />
    </aside>
  );
};

export default CallSidebar;
