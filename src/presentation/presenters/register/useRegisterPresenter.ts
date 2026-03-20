'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RegisterPresenter } from './RegisterPresenter';
import { createClientRegisterPresenter } from './RegisterPresenterClientFactory';
import { RegistrationData, Registration } from '@/src/application/repositories/IRegistrationRepository';

export interface RegisterPresenterState {
  submitting: boolean;
  success: boolean;
  error: string | null;
  registration: Registration | null;
  eventTitle: string | null;
}

export interface RegisterPresenterActions {
  submit: (data: RegistrationData) => Promise<void>;
  reset: () => void;
  loadEventTitle: (id: string) => Promise<void>;
}

/**
 * Custom hook for Register presenter
 */
export function useRegisterPresenter(
  eventId?: string,
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
  const [eventTitle, setEventTitle] = useState<string | null>(null);

  const loadEventTitle = useCallback(async (id: string) => {
    try {
      const event = await presenter.getEventById(id);
      if (isMountedRef.current && event) {
        setEventTitle(event.title);
      }
    } catch (err) {
      console.error('Failed to load event title:', err);
    }
  }, [presenter]);

  useEffect(() => {
    if (eventId) {
      loadEventTitle(eventId);
    }
  }, [eventId, loadEventTitle]);

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
      eventTitle,
    },
    { submit, reset, loadEventTitle },
  ];
}
