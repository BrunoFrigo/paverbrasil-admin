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
import { Plus, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function Pedidos() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    clientId: '',
    description: '',
    area: '',
    totalValue: '',
    deliveryValue: '',
    status: 'pending' as const,
  });

  const { data: quotations = [], refetch } = trpc.quotations.list.useQuery();
  const { data: clients = [] } = trpc.clients.list.useQuery();
  const createMutation = trpc.quotations.create.useMutation();
  const updateMutation = trpc.quotations.update.useMutation();
  const deleteMutation = trpc.quotations.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.clientId || !formData.totalValue) {
      toast.error('Cliente e Valor Total são obrigatórios');
      return;
    }

    try {
      await createMutation.mutateAsync({
        clientId: parseInt(formData.clientId),
        description: formData.description,
        area: formData.area ? parseFloat(formData.area) : undefined,
        totalValue: parseFloat(formData.totalValue),
        deliveryValue: formData.deliveryValue ? parseFloat(formData.deliveryValue) : 0,
        status: formData.status,
      });
      toast.success('Pedido criado com sucesso!');
      setFormData({
        clientId: '',
        description: '',
        area: '',
        totalValue: '',
        deliveryValue: '',
        status: 'pending',
      });
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar pedido');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        status: newStatus as any,
      });
      refetch();
      toast.success('Status atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Pedido deletado com sucesso!');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao deletar pedido');
      }
    }
  };

  const filteredQuotations = quotations.filter(
    (q: any) =>
      q.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clients.find((c: any) => c.id === q.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'pending':
        return 'Pendente';
      case 'rejected':
        return 'Rejeitado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getClientName = (clientId: number) => {
    return clients.find((c: any) => c.id === clientId)?.name || 'Cliente não encontrado';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground">Gerenciar orçamentos e pedidos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 text-foreground border-border">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Novo Pedido</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Crie um novo orçamento ou pedido
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Cliente *</label>
                    <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {clients.map((client: any) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Descrição</label>
                    <Input
                      placeholder="Descrição do pedido"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 bg-background border-border text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Área (m²)</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        className="mt-1 bg-background border-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Valor Total *</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.totalValue}
                        onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                        className="mt-1 bg-background border-border text-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Valor Entrega</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.deliveryValue}
                      onChange={(e) => setFormData({ ...formData, deliveryValue: e.target.value })}
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
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {createMutation.isPending ? 'Criando...' : 'Criar Pedido'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por cliente ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card border-border text-foreground"
        />

        {/* Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Lista de Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-foreground">ID</TableHead>
                    <TableHead className="text-foreground">Cliente</TableHead>
                    <TableHead className="text-foreground">Descrição</TableHead>
                    <TableHead className="text-foreground">Área (m²)</TableHead>
                    <TableHead className="text-foreground">Valor Total</TableHead>
                    <TableHead className="text-foreground">Valor Entrega</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhum pedido encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuotations.map((quotation: any) => (
                      <TableRow key={quotation.id} className="border-border hover:bg-muted/50">
                        <TableCell className="text-foreground font-medium">#{quotation.id}</TableCell>
                        <TableCell className="text-foreground">{getClientName(quotation.clientId)}</TableCell>
                        <TableCell className="text-foreground">{quotation.description || '-'}</TableCell>
                        <TableCell className="text-foreground">{quotation.area || '-'}</TableCell>
                        <TableCell className="text-foreground">R$ {parseFloat(quotation.totalValue).toFixed(2)}</TableCell>
                        <TableCell className="text-foreground">R$ {parseFloat(quotation.deliveryValue).toFixed(2)}</TableCell>
                        <TableCell>
                          <Select
                            value={quotation.status}
                            onValueChange={(value) => handleStatusChange(quotation.id, value)}
                          >
                            <SelectTrigger className={`w-32 border-0 ${getStatusColor(quotation.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="approved">Aprovado</SelectItem>
                              <SelectItem value="rejected">Rejeitado</SelectItem>
                              <SelectItem value="completed">Concluído</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(quotation.id)}
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
