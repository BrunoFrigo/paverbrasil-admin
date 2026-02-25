import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, Pin, PinOff, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

const colorMap = {
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-900' },
  green: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900' },
  pink: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-900' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
};

export default function Anotacoes() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    color: 'yellow' as const,
  });

  const { data: notes = [], refetch } = trpc.notes.list.useQuery();
  const createMutation = trpc.notes.create.useMutation();
  const updateMutation = trpc.notes.update.useMutation();
  const deleteMutation = trpc.notes.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.title) {
      toast.error('Título da anotação é obrigatório');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
        color: formData.color,
        isPinned: false,
      });
      toast.success('Anotação criada com sucesso!');
      setFormData({ title: '', content: '', color: 'yellow' });
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar anotação');
    }
  };

  const handleTogglePin = async (id: number, currentPin: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id,
        isPinned: !currentPin,
      });
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar anotação');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta anotação?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Anotação deletada com sucesso!');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao deletar anotação');
      }
    }
  };

  const pinnedNotes = notes.filter((n: any) => n.isPinned).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unpinnedNotes = notes.filter((n: any) => !n.isPinned).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const renderNotes = (notesArray: any[]) => {
    if (notesArray.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notesArray.map((note: any) => {
          const colors = colorMap[note.color as keyof typeof colorMap] || colorMap.yellow;
          return (
            <div
              key={note.id}
              className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold ${colors.text} flex-1`}>{note.title}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleTogglePin(note.id, note.isPinned)}
                  className={`${colors.text} hover:${colors.bg}`}
                >
                  {note.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                </Button>
              </div>

              {note.content && (
                <p className={`text-sm ${colors.text} break-words`}>{note.content}</p>
              )}

              <div className={`text-xs ${colors.text} opacity-75`}>
                {formatDate(note.createdAt)}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`${colors.text} hover:${colors.bg} flex-1`}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(note.id)}
                  disabled={deleteMutation.isPending}
                  className={`${colors.text} hover:${colors.bg} flex-1`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Anotações</h1>
            <p className="text-muted-foreground">Organize suas anotações com cores</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Plus className="w-4 h-4" />
                Nova Anotação
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Nova Anotação</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Crie uma nova anotação colorida
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Título *</label>
                  <Input
                    placeholder="Título da anotação"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Conteúdo</label>
                  <Textarea
                    placeholder="Conteúdo da anotação"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Cor</label>
                  <Select value={formData.color} onValueChange={(value: any) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="yellow">Amarelo</SelectItem>
                      <SelectItem value="blue">Azul</SelectItem>
                      <SelectItem value="green">Verde</SelectItem>
                      <SelectItem value="pink">Rosa</SelectItem>
                      <SelectItem value="purple">Roxo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Anotação'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Fixadas</h2>
            {renderNotes(pinnedNotes)}
          </div>
        )}

        {/* Unpinned Notes */}
        {unpinnedNotes.length > 0 && (
          <div className="space-y-3">
            {pinnedNotes.length > 0 && <h2 className="text-lg font-semibold text-foreground">Outras Anotações</h2>}
            {renderNotes(unpinnedNotes)}
          </div>
        )}

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma anotação criada ainda</p>
            <p className="text-sm mt-1">Clique em "Nova Anotação" para começar</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
