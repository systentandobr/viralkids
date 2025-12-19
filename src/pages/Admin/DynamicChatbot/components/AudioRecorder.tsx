import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onAudioRecorded: (audioBlob: Blob, base64: string) => void;
  disabled?: boolean;
  maxDuration?: number; // em segundos
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  disabled = false,
  maxDuration = 300, // 5 minutos
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);

        // Converter para base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          onAudioRecorded(audioBlob, base64);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Timer
      intervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            toast.warning('Tempo máximo de gravação atingido');
          }
          return newDuration;
        });
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao iniciar gravação:', error);
      toast.error('Erro ao acessar microfone. Verifique as permissões.');
    }
  }, [maxDuration, onAudioRecorded]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  }, [isRecording]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioUrl, isPlaying]);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (audioBlob && audioUrl) {
    return (
      <div className="flex items-center gap-2">
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={togglePlayback}
          disabled={disabled}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {formatDuration(Math.floor(audioBlob.size / 1000))}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setAudioBlob(null);
            setAudioUrl(null);
            setIsPlaying(false);
          }}
          disabled={disabled}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={stopRecording}
          disabled={disabled}
          className="h-8 w-8 p-0 animate-pulse"
        >
          <Square className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground">
          {formatDuration(duration)}
        </span>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={startRecording}
      disabled={disabled}
      className="h-8 w-8 p-0"
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
};
