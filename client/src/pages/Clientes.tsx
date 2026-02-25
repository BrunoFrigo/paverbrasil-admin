import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function Clientes() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as const,
  });

  const { data: clients = [], refetch } = trpc.clients.list.useQuery();
  const createMutation = trpc.clients.create.useMutation();
  const deleteMutation = trpc.clients.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Nome do cliente é obrigatório');
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success('Cliente criado com sucesso!');
      setFormData({ name: '', email: '', phone: '', status: 'active' });
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Cliente deletado com sucesso!');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao deletar cliente');
      }
    }
  };

  const filteredClients = clients.filter(
    (client: any) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm)
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground">Gerenciar clientes da empresa</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Plus className="w-4 h-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Novo Cliente</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Adicione um novo cliente à sua base de dados
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome *</label>
                  <Input
                    placeholder="Nome do cliente"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Cliente'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card border-border text-foreground"
        />

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground">Nome</TableHead>
                    <TableHead className="text-foreground">Email</TableHead>
                    <TableHead className="text-foreground">Telefone</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum cliente encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client: any) => (
                      <TableRow key={client.id} className="border-border hover:bg-muted/50">
                        <TableCell className="text-foreground font-medium">{client.name}</TableCell>
                        <TableCell className="text-foreground">{client.email || '-'}</TableCell>
                        <TableCell className="text-foreground">{client.phone || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(client.status)}`}>
                            {client.status === 'active' ? 'Ativo' : client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
