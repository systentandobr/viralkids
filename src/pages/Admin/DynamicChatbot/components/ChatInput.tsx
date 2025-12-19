import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatTools } from './ChatTools';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (file: File, base64: string, caption?: string) => void;
  onSendAudio: (audioBlob: Blob, base64: string, transcription?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendImage,
  onSendAudio,
  disabled = false,
  placeholder = 'Digite sua mensagem...',
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ file: File; base64: string } | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob; base64: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    // Se tem imagem, enviar imagem
    if (selectedImage) {
      onSendImage(selectedImage.file, selectedImage.base64, message.trim() || undefined);
      setSelectedImage(null);
      setMessage('');
      return;
    }

    // Se tem áudio, enviar áudio
    if (recordedAudio) {
      onSendAudio(recordedAudio.blob, recordedAudio.base64, message.trim() || undefined);
      setRecordedAudio(null);
      setMessage('');
      return;
    }

    // Enviar mensagem de texto
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleImageSelect = (file: File, base64: string) => {
    setSelectedImage({ file, base64 });
    setRecordedAudio(null); // Limpar áudio se houver
  };

  const handleAudioRecorded = (audioBlob: Blob, base64: string) => {
    setRecordedAudio({ blob: audioBlob, base64 });
    setSelectedImage(null); // Limpar imagem se houver
  };

  const canSend = message.trim().length > 0 || selectedImage || recordedAudio;

  return (
    <div className="border-t bg-background p-4">
      {/* Preview de imagem ou áudio */}
      {(selectedImage || recordedAudio) && (
        <div className="mb-2 flex items-center gap-2">
          {selectedImage && (
            <div className="relative">
              <img
                src={URL.createObjectURL(selectedImage.file)}
                alt="Preview"
                className="h-16 w-16 rounded object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}
          {recordedAudio && (
            <div className="flex items-center gap-2">
              <audio
                src={URL.createObjectURL(recordedAudio.blob)}
                controls
                className="h-8"
              />
              <button
                onClick={() => setRecordedAudio(null)}
                className="text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Tools */}
        <div className="flex items-end">
          <ChatTools
            onEmojiSelect={handleEmojiSelect}
            onImageSelect={handleImageSelect}
            onAudioRecorded={handleAudioRecorded}
            disabled={disabled}
          />
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none pr-12"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || !canSend}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
