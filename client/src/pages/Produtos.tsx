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
import { Plus, Trash2, Minus, Plus as PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function Produtos() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'paver' as const,
    unit: 'm2' as const,
    description: '',
    stock: 0,
  });

  const { data: products = [], refetch } = trpc.products.list.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();

  const handleCreate = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Nome e preço são obrigatórios');
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        price: parseFloat(formData.price),
      });
      toast.success('Produto criado com sucesso!');
      setFormData({
        name: '',
        price: '',
        category: 'paver',
        unit: 'm2',
        description: '',
        stock: 0,
      });
      setIsOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar produto');
    }
  };

  const handleUpdateStock = async (id: number, newStock: number) => {
    try {
      await updateMutation.mutateAsync({ id, stock: newStock });
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar estoque');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Produto deletado com sucesso!');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Erro ao deletar produto');
      }
    }
  };

  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'm2':
        return 'm²';
      case 'un':
        return 'un';
      case 'm_linear':
        return 'm linear';
      default:
        return unit;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground">Gerenciar produtos e estoque</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Plus className="w-4 h-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Novo Produto</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Adicione um novo produto ao catálogo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Nome *</label>
                  <Input
                    placeholder="Nome do produto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Preço *</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Categoria</label>
                    <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="paver">Paver</SelectItem>
                        <SelectItem value="bloco">Bloco</SelectItem>
                        <SelectItem value="guia">Guia</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Unidade</label>
                    <Select value={formData.unit} onValueChange={(value: any) => setFormData({ ...formData, unit: value })}>
                      <SelectTrigger className="mt-1 bg-background border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="m2">m²</SelectItem>
                        <SelectItem value="un">Unidade</SelectItem>
                        <SelectItem value="m_linear">m linear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Descrição</label>
                  <Input
                    placeholder="Descrição do produto"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 bg-background border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {createMutation.isPending ? 'Criando...' : 'Salvar Produto'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Input
          placeholder="Buscar por nome ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card border-border text-foreground"
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhum produto encontrado
            </div>
          ) : (
            filteredProducts.map((product: any) => (
              <Card key={product.id} className="bg-card border-border overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-accent">
                      R$ {parseFloat(product.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">/{getUnitLabel(product.unit)}</p>
                  </div>

                  {product.description && (
                    <p className="text-sm text-foreground">{product.description}</p>
                  )}

                  <div className="border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground mb-2">Estoque</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">{product.stock}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                          className="text-foreground border-border"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                          className="text-foreground border-border"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
