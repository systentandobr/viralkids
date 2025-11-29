// Componentes UI que precisam ser implementados ou adicionados ao shadcn/ui

import React from 'react';
import { cn } from '@/lib/utils';

// Progress Component (caso não exista no shadcn/ui)
interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max = 100, 
  className, 
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
};

// Textarea Component (caso não exista)
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

// Slider Component (caso não exista)
interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max: number;
  min: number;
  step: number;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  max,
  min,
  step,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={handleChange}
      className={cn(
        "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer",
        className
      )}
    />
  );
};

// Table Components (caso não existam)
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Table: React.FC<TableProps> = ({ className, ...props }) => (
  <table className={cn("w-full caption-bottom text-base", className)} {...props} />
);

export const TableHeader: React.FC<TableHeaderProps> = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

export const TableBody: React.FC<TableBodyProps> = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

export const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => (
  <tr className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />
);

export const TableHead: React.FC<TableHeadProps> = ({ className, ...props }) => (
  <th className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground", className)} {...props} />
);

export const TableCell: React.FC<TableCellProps> = ({ className, ...props }) => (
  <td className={cn("p-4 align-middle", className)} {...props} />
);

// Checkbox Component (caso não exista)
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
  onCheckedChange, 
  onChange,
  className, 
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <input
      type="checkbox"
      onChange={handleChange}
      className={cn(
        "h-4 w-4 rounded border border-primary text-primary focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
};

// Tabs Components (caso não existam)
interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : activeTab;
  
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div data-active-tab={currentValue}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { activeTab: currentValue, onValueChange: handleValueChange } as any)
          : child
      )}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

export const TabsTrigger: React.FC<TabsTriggerProps & { activeTab?: string; onValueChange?: (value: string) => void }> = ({ 
  value, 
  children, 
  className, 
  activeTab, 
  onValueChange 
}) => (
  <button
    onClick={() => onValueChange?.(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-base font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value && "bg-background text-foreground shadow-sm",
      className
    )}
  >
    {children}
  </button>
);

export const TabsContent: React.FC<TabsContentProps & { activeTab?: string }> = ({ 
  value, 
  children, 
  className, 
  activeTab 
}) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  );
};

// Dialog Components (caso não existam)
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => (
  <div className={cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
    className
  )}>
    {children}
  </div>
);

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left">
    {children}
  </div>
);

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <h3 className="text-lg font-semibold leading-none tracking-tight">
    {children}
  </h3>
);

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => (
  <p className="text-base text-muted-foreground">
    {children}
  </p>
);

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => (
  <>{children}</>
);
