"use client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function ClientList({
  clients,
  onEdit,
  onDelete,
  editingId,
}: {
  clients: any[];
  onEdit: (client: any) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
}) {
  return (
    <div className="space-y-2">
      {clients.map((client) => (
        <div
          key={client.id}
          className={`rounded-lg border p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 ${
            editingId === client.id ? "bg-muted/30" : ""
          }`}
        >
          <div>
            <div className="font-medium">{client.name}</div>
            <div className="text-sm text-muted-foreground">{client.email}</div>
            <div className="text-xs text-muted-foreground">
              Telefone: {client.phone}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onEdit(client)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(client.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
