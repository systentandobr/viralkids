import { useState, useCallback } from 'react';
import { UseFormTrigger, FieldValues, Path } from 'react-hook-form';

interface UseWizardFormOptions<T extends FieldValues> {
  totalSteps: number;
  trigger: UseFormTrigger<T>;
  getFieldsForStep: (step: number) => Path<T>[];
  onStepChange?: (step: number) => void;
}

export function useWizardForm<T extends FieldValues>({
  totalSteps,
  trigger,
  getFieldsForStep,
  onStepChange,
}: UseWizardFormOptions<T>) {
  const [currentStep, setCurrentStep] = useState(1);

  const validateStep = useCallback(
    async (step: number): Promise<boolean> => {
      const fieldsToValidate = getFieldsForStep(step);
      if (fieldsToValidate.length === 0) return true;
      const result = await trigger(fieldsToValidate);
      return result;
    },
    [trigger, getFieldsForStep]
  );

  const goToNext = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  }, [currentStep, totalSteps, validateStep, onStepChange]);

  const goToPrevious = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  }, [currentStep, onStepChange]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
        onStepChange?.(step);
      }
    },
    [totalSteps, onStepChange]
  );

  const reset = useCallback(() => {
    setCurrentStep(1);
    onStepChange?.(1);
  }, [onStepChange]);

  return {
    currentStep,
    totalSteps,
    goToNext,
    goToPrevious,
    goToStep,
    reset,
    validateStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}

