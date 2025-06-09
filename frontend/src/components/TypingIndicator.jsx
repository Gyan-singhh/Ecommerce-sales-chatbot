export const TypingIndicator = () => (
  <div className="flex gap-1 items-center" aria-label="typing indicator">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
    <style>{`
      .typing-dot {
        height: 8px;
        width: 8px;
        background-color: #6b7280;
        border-radius: 50%;
        display: inline-block;
        animation: typing 1s infinite ease-in-out;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
    `}</style>
  </div>
);
