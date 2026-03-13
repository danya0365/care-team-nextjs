'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { RegisterPresenter } from './RegisterPresenter';
import { createClientRegisterPresenter } from './RegisterPresenterClientFactory';
import { RegistrationData, Registration } from '@/src/application/repositories/IRegistrationRepository';

export interface RegisterPresenterState {
  submitting: boolean;
  success: boolean;
  error: string | null;
  registration: Registration | null;
  targetGroups: string[];
}

export interface RegisterPresenterActions {
  submit: (data: RegistrationData) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for Register presenter
 */
export function useRegisterPresenter(
  presenterOverride?: RegisterPresenter
): [RegisterPresenterState, RegisterPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientRegisterPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);

  const submit = useCallback(async (data: RegistrationData) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await presenter.submitRegistration(data);
      if (isMountedRef.current) {
        setRegistration(result);
        setSuccess(true);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    } finally {
      if (isMountedRef.current) {
        setSubmitting(false);
      }
    }
  }, [presenter]);

  const reset = useCallback(() => {
    setSuccess(false);
    setError(null);
    setRegistration(null);
  }, []);

  return [
    {
      submitting,
      success,
      error,
      registration,
      targetGroups: presenter.getTargetGroups(),
    },
    { submit, reset },
  ];
}
