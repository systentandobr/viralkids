import { Progress } from '@/components/ui/progress';
import { CheckCircle, LucideIcon } from 'lucide-react';

export interface WizardStep {
  id: number;
  title: string;
  icon: LucideIcon;
}

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className='space-y-2 pt-4'>
      <Progress value={progress} className='h-2' />
      <div className='flex justify-between text-sm text-muted-foreground'>
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center gap-1 ${
              currentStep >= step.id ? 'text-primary font-medium' : ''
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle className='w-4 h-4 text-neon-green' />
            ) : (
              <step.icon className='w-4 h-4' />
            )}
            <span className='hidden sm:inline'>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

