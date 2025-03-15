
import React, { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Package, ShoppingBag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { clients, products, sales, purchases } = useAppStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate key metrics
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalPurchases = purchases.reduce((acc, purchase) => acc + purchase.total, 0);
  const lowStockProducts = products.filter(product => product.stock <= product.alertThreshold);

  // Prepare data for charts
  const salesData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthStr = month.toLocaleString('default', { month: 'short' });
    
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === month.getMonth() && 
             saleDate.getFullYear() === month.getFullYear();
    });
    
    return {
      name: monthStr,
      sales: monthSales.reduce((acc, sale) => acc + sale.total, 0),
    };
  }).reverse();

  // Calculate category distribution for products
  const categoryData = products.reduce((acc, product) => {
    const categoryId = product.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = { count: 0, totalValue: 0 };
    }
    acc[categoryId].count += 1;
    acc[categoryId].totalValue += product.price * product.stock;
    return acc;
  }, {} as Record<string, { count: number; totalValue: number }>);

  const pieData = Object.entries(categoryData).map(([categoryId, data]) => {
    const category = useAppStore.getState().categories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : 'Unknown',
      value: data.totalValue,
    };
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C'];

  const StatCard = ({ title, value, icon, className }: { title: string; value: string | number; icon: React.ReactNode; className?: string }) => (
    <Card className={`hover-lift ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/sales/new">New Sale</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/purchases/new">New Purchase</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clients"
            value={clients.length}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            className="animate-fade-in [animation-delay:100ms]"
          />
          <StatCard
            title="Total Products"
            value={products.length}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
            className="animate-fade-in [animation-delay:200ms]"
          />
          <StatCard
            title="Total Sales"
            value={`${totalSales.toLocaleString()} €`}
            icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
            className="animate-fade-in [animation-delay:300ms]"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts.length}
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            className="animate-fade-in [animation-delay:400ms]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in [animation-delay:500ms]">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isClient && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} €`, 'Sales']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                        border: '1px solid rgba(0, 0, 0, 0.05)' 
                      }}
                    />
                    <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:600ms]">
            <CardHeader>
              <CardTitle>Inventory Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isClient && pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} €`, 'Value']}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
                        border: '1px solid rgba(0, 0, 0, 0.05)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="animate-fade-in [animation-delay:700ms]">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {sales.length > 0 ? (
                <div className="space-y-2">
                  {sales.slice(0, 5).map((sale) => {
                    const client = clients.find((c) => c.id === sale.clientId);
                    return (
                      <div key={sale.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{client?.name || "Unknown Client"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(sale.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-medium">{sale.total.toLocaleString()} €</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No recent sales</p>
              )}
              {sales.length > 0 && (
                <Button variant="ghost" className="mt-4 w-full" asChild>
                  <Link to="/sales">View all sales</Link>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in [animation-delay:800ms]">
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} / Threshold: {product.alertThreshold}
                        </p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        product.stock === 0 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.stock === 0 ? 'Out of stock' : 'Low stock'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No products with low stock</p>
              )}
              {lowStockProducts.length > 0 && (
                <Button variant="ghost" className="mt-4 w-full" asChild>
                  <Link to="/inventory">View inventory</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
