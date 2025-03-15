
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Purchase } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const PurchasesPage = () => {
  const { purchases, deletePurchase } = useAppStore();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const handleDelete = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPurchase) {
      deletePurchase(selectedPurchase.id);
      toast({
        title: "Purchase deleted",
        description: `Purchase #${selectedPurchase.id.substring(0, 8)} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const columns: ColumnDef<Purchase>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.original.id.substring(0, 8)}</span>,
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return <span>{new Date(row.original.date).toLocaleDateString()}</span>;
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return <span>{row.original.total.toLocaleString()} €</span>;
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        return <span>{row.original.items.length} items</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const purchase = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/purchases/${purchase.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(purchase)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
          <Button asChild>
            <Link to="/purchases/new">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Link>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={purchases}
          searchColumn="supplierName"
          searchPlaceholder="Search purchases..."
        />

        {selectedPurchase && (
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this purchase and its data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={confirmDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </Layout>
  );
};

export default PurchasesPage;
