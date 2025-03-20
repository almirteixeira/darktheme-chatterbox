
export interface MessageType {
  id: string;
  content: string;
  timestamp: number;
  themeId: string;
  isTask: boolean;
  completed?: boolean;
}

export interface ThemeType {
  id: string;
  name: string;
  unread: number;
}
