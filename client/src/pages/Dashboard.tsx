import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { toast } from 'sonner';

const chartData = [
  { month: 'Jan', vendas: 4000 },
  { month: 'Fev', vendas: 3000 },
  { month: 'Mar', vendas: 2000 },
  { month: 'Abr', vendas: 2780 },
  { month: 'Mai', vendas: 1890 },
  { month: 'Jun', vendas: 2390 },
];

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(15000);
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);
  const [revenueInput, setRevenueInput] = useState(totalRevenue.toString());

  const handleSaveRevenue = () => {
    const value = parseFloat(revenueInput);
    if (!isNaN(value) && value >= 0) {
      setTotalRevenue(value);
      setIsEditingRevenue(false);
      toast.success('Receita atualizada com sucesso!');
    } else {
      toast.error('Valor inválido');
    }
  };

  const kpis = [
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-accent',
      editable: true,
    },
    {
      title: 'Total de Pedidos',
      value: '24',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Clientes Ativos',
      value: '12',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Produtos',
      value: '8',
      icon: Package,
      color: 'bg-purple-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{kpi.title}</CardTitle>
                <div className={`${kpi.color} p-2 rounded-lg`}>
                  <kpi.icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                {kpi.editable && isEditingRevenue ? (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={revenueInput}
                      onChange={(e) => setRevenueInput(e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveRevenue}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingRevenue(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => kpi.editable && setIsEditingRevenue(true)}
                    className={kpi.editable ? 'cursor-pointer hover:opacity-80' : ''}
                  >
                    <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                    {kpi.editable && (
                      <p className="text-xs text-muted-foreground mt-1">Clique para editar</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sales Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Fluxo de Vendas</CardTitle>
            <CardDescription className="text-muted-foreground">Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--foreground)" />
                <YAxis stroke="var(--foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
                <Legend />
                <Bar dataKey="vendas" fill="var(--accent)" name="Vendas (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Quotations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Orçamentos Recentes</CardTitle>
            <CardDescription className="text-muted-foreground">Últimos pedidos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Nenhum orçamento registrado ainda
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deliveries */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Próximas Entregas</CardTitle>
            <CardDescription className="text-muted-foreground">Entregas programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma entrega programada
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
