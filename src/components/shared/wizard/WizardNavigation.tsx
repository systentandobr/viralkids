import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  onPrevious: () => void;
  onCancel?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  canGoNext?: boolean;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  stepTitle,
  onPrevious,
  onCancel,
  onNext,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar',
  canGoNext = true,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <>
      {/* Step Badge */}
      <div className='flex items-center gap-2'>
        <Badge variant='outline' className='text-base'>
          Etapa {currentStep} de {totalSteps}
        </Badge>
        <span className='text-base font-medium'>{stepTitle}</span>
      </div>

      {/* Navigation Buttons */}
      <div className='flex justify-between pt-4 border-t'>
        <Button
          type='button'
          variant='outline'
          onClick={isFirstStep ? onCancel : onPrevious}
          disabled={isSubmitting}
        >
          <ChevronLeft className='w-4 h-4 mr-2' />
          {isFirstStep ? 'Cancelar' : 'Anterior'}
        </Button>

        {isLastStep ? (
          <Button
            type='button'
            className='bg-primary text-white'
            onClick={onSubmit}
            disabled={isSubmitting || !canGoNext}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className='w-4 h-4 mr-2' />
                {submitLabel}
              </>
            )}
          </Button>
        ) : (
          <Button
            type='button'
            className='bg-primary text-white'
            onClick={onNext}
            disabled={!canGoNext || isSubmitting}
          >
            Próximo
            <ChevronRight className='w-4 h-4 ml-2' />
          </Button>
        )}
      </div>
    </>
  );
}

