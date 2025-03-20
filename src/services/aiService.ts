
import { SettingsType } from '@/hooks/useSettings';

export type AiResponse = {
  content: string;
  error?: string;
};

export const getAiResponse = async (
  message: string,
  settings: SettingsType
): Promise<AiResponse> => {
  try {
    if (!settings.aiApiKey) {
      return {
        error: 'API key não configurada. Por favor, configure nas configurações.',
        content: '',
      };
    }

    const response = await fetch(`${settings.aiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.aiApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erro ao comunicar com a API');
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'Sem resposta da IA',
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      content: '',
    };
  }
};
