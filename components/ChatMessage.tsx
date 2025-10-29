
import React from 'react';
import { ChatMessage, MessageRole } from '../types';
import SpeakerIcon from './icons/SpeakerIcon';

interface ChatMessageProps {
  message: ChatMessage;
  speak: (text: string) => void;
}

const UserAvatar: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    U
  </div>
);

const BotAvatar: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    AI
  </div>
);

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, speak }) => {
  const isUser = message.role === MessageRole.USER;
  const isModel = message.role === MessageRole.MODEL;
  const isError = message.role === MessageRole.ERROR;

  const wrapperClasses = `flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`;
  const messageClasses = `p-4 rounded-2xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words shadow-md ${
    isUser
      ? 'bg-blue-500 text-white rounded-br-none'
      : isModel
      ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
      : 'bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-bl-none'
  }`;

  return (
    <div className={wrapperClasses}>
      {!isUser && <BotAvatar />}
      <div className={messageClasses}>
        <div className="prose prose-sm dark:prose-invert max-w-none" style={{ whiteSpace: 'pre-wrap' }}>
          {message.text}
        </div>
      </div>
      {isModel && (
        <button
          onClick={() => speak(message.text)}
          className="p-2 rounded-full self-start text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 flex-shrink-0"
          aria-label="Read message aloud"
        >
          <SpeakerIcon className="w-5 h-5" />
        </button>
      )}
      {isUser && <UserAvatar />}
    </div>
  );
};

export default ChatMessageComponent;