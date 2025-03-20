
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { settings, saveSettings } = useSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = React.useState({
    aiApiKey: settings.aiApiKey || '',
    aiBaseUrl: settings.aiBaseUrl || 'https://api.deepseek.com/v1',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveSettings(formData);
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações foram salvas com sucesso!',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Configure as integrações de IA e outras preferências do aplicativo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="aiBaseUrl">URL da API de IA</Label>
            <Input
              id="aiBaseUrl"
              name="aiBaseUrl"
              value={formData.aiBaseUrl}
              onChange={handleChange}
              placeholder="https://api.deepseek.com/v1"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="aiApiKey">Chave de API de IA</Label>
            <Input
              id="aiApiKey"
              name="aiApiKey"
              type="password"
              value={formData.aiApiKey}
              onChange={handleChange}
              placeholder="sk-xxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              A chave é armazenada apenas no seu navegador e nunca é enviada para nossos servidores.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
