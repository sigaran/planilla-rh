// Definición de tipos para el nodo de conversación
export interface Transition {
  id: string;
  condition: string;
  targetNode?: string;
}

export interface ConversationNodeData {
  label: string;
  prompt: string;
  staticSentence: string;
  transitions: Transition[];
}

// Definición de tipos para el nodo de Agente de IA
export interface IAAgentNodeData {
  id?: string;
  label: string;
  type?: string;
  prompt?: string;
  voice: {
    voiceId?: string;
    voiceName?: string;
    modelId?: string;
    tone?: string;
    speed?: string;
    accent?: string;
    language?: string;
    stability?: number;
    similarityBoost?: number;
    style?: number;
    useSpeakerBoost?: boolean;
  };
  advanced?: {
    toolsConfig?: string;
    knowledgeContext: Array<{
      type: 'web' | 'pdf' | 'txt' | 'other';
      name: string;
      url?: string;
      content?: string;
    }>;
  };
}

export interface TransferCallNodeData {
  label?: string;
  country?: string;
  dialCode?: string;
  phoneNumber?: string;
}

export interface GoogleSheetsNodeData {
  spreadsheetId: string;
  sheetName: string;
  operation: 'append' | 'update' | 'delete' | 'read';
  rowData?: string;
  searchCriteria?: string;
  range?: string;
} 