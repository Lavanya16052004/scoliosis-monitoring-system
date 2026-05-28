
export enum ScoliosisSeverity {
  NORMAL = 'Normal',
  MILD = 'Mild',
  MODERATE = 'Moderate',
  SEVERE = 'Severe'
}

export type AnalysisSource = 'XRAY' | 'LIVE';

export interface LineCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Landmark {
  x: number;
  y: number;
  label: string;
}

export interface PostureAnalysis {
  landmarks: Landmark[];
  alignmentScore: number;
  feedback: string;
  isDeviating: boolean;
  estimatedCobbAngle?: number;
  severity?: ScoliosisSeverity;
  recommendations?: string[];
}

export interface AnalysisResult {
  cobbAngle: number;
  severity: ScoliosisSeverity;
  recommendations: string[];
  visualObservations: string;
  timestamp: string;
  id: string;
  imageUrl?: string;
  source?: AnalysisSource;
  markers?: {
    topLine: LineCoords;
    bottomLine: LineCoords;
  };
}

export interface PatientRecord extends AnalysisResult {
  patientName: string;
}

export interface User {
  name: string;
  designation: string;
  department: string;
}

export type AppView = 'DASHBOARD' | 'ANALYSIS' | 'HISTORY' | 'POSTURE_LIVE' | 'DOCUMENTATION';
