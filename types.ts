export interface TimelineEvent {
  year: number;
  category: string;
  originalBelief: string;
  modernReality: string;
  status: 'Changed' | 'Debunked' | 'Confirmed' | 'Evolved';
  context: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface TimelineResponse {
  events: TimelineEvent[];
  groundingChunks?: GroundingChunk[];
}

export interface ImageEditState {
  originalImage: string | null;
  generatedImage: string | null;
  prompt: string;
  isGenerating: boolean;
  error: string | null;
}