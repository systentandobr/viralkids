import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCategory } from "@/pages/Ecommerce/types/ecommerce.types";

interface CategoryCardProps {
  category: ProductCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  // Verificar se o ícone é válido, caso contrário usar um fallback
  const Icon = (category.icon && typeof category.icon === 'function') ? category.icon : Package;

  return (
    <Card className="group hover:shadow-bronze transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-card border-bronze/20">
      <CardContent className="p-6 text-center">
        <div className="space-y-4">
          {/* Icon */}
          <div className={cn(
            "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white shadow-bronze group-hover:scale-110 transition-transform",
            category.color
          )}>
            <Icon className="h-8 w-8" />
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-bronze transition-colors">
              {category.description}
            </h3>
            <p className="text-base text-muted-foreground">
              {category.productCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;