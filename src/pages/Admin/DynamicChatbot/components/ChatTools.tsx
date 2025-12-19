import React from 'react';
import { EmojiPicker } from './EmojiPicker';
import { AudioRecorder } from './AudioRecorder';
import { ImageUploader } from './ImageUploader';

interface ChatToolsProps {
  onEmojiSelect: (emoji: string) => void;
  onImageSelect: (file: File, base64: string) => void;
  onAudioRecorded: (audioBlob: Blob, base64: string) => void;
  disabled?: boolean;
}

export const ChatTools: React.FC<ChatToolsProps> = ({
  onEmojiSelect,
  onImageSelect,
  onAudioRecorded,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      <EmojiPicker onEmojiSelect={onEmojiSelect} disabled={disabled} />
      <ImageUploader onImageSelect={onImageSelect} disabled={disabled} />
      <AudioRecorder onAudioRecorded={onAudioRecorded} disabled={disabled} />
    </div>
  );
};
