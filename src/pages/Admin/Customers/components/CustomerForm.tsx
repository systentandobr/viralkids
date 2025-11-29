import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCustomer } from "@/services/queries/customers";
import { useCreateLead } from "@/services/queries/leads";
import { LeadSource } from "@/services/leads/leadService";
import { Loader2 } from "lucide-react";

const customerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  status: z.enum(["vip", "ativo", "novo"]).optional(),
  totalPurchases: z.number().min(0).optional(),
  totalSpent: z.number().min(0).optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Partial<CustomerFormData>;
  createAsLead?: boolean; // Se true, cria como lead primeiro
}

export const CustomerForm = ({
  open,
  onOpenChange,
  onSuccess,
  initialData,
  createAsLead = false,
}: CustomerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCustomer = useCreateCustomer();
  const createLead = useCreateLead();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      status: "novo",
      totalPurchases: 0,
      totalSpent: 0,
    },
  });

  const status = watch("status");

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      if (createAsLead) {
        // Criar como lead primeiro
        await createLead.mutateAsync({
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: LeadSource.FORM,
          metadata: {
            totalPurchases: data.totalPurchases || 0,
            totalSpent: data.totalSpent || 0,
            status: data.status,
          },
        });
      } else {
        // Criar cliente diretamente
        await createCustomer.mutateAsync({
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          totalPurchases: data.totalPurchases,
          totalSpent: data.totalSpent,
        });
      }

      reset();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao criar cliente/lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {createAsLead ? "Novo Lead" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {createAsLead
              ? "Cadastre um novo lead que será adicionado ao funil de atendimento"
              : "Cadastre um novo cliente no sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Nome completo"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-base text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="email@exemplo.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-base text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="(00) 00000-0000"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-base text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!createAsLead && (
            <>
              <div className="space-y-2">
                <Label htmlFor="totalPurchases">Total de Compras</Label>
                <Input
                  id="totalPurchases"
                  type="number"
                  {...register("totalPurchases", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpent">Total Gasto (R$)</Label>
                <Input
                  id="totalSpent"
                  type="number"
                  step="0.01"
                  {...register("totalSpent", { valueAsNumber: true })}
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

