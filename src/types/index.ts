export type CategoryId = 
  | 'pdf'
  | 'image'
  | 'text'
  | 'converter'
  | 'generator'
  | 'utility'
  | 'dev';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string; // Lucide icon identifier
  badge?: string;
  priority: 'MVP' | 'Phase 2' | 'Phase 3';
  isPopular?: boolean;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  colorName: string;
  primaryColor: string;
  lightColor: string;
  darkColor: string;
  borderColor: string;
  icon: string;
}
