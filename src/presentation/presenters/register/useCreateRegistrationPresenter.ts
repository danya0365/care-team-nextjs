'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CreateRegistrationViewModel, CreateRegistrationPresenter } from './CreateRegistrationPresenter';
import { createClientCreateRegistrationPresenter } from './CreateRegistrationPresenterClientFactory';
import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';
import { useRouter } from 'next/navigation';

export interface CreateRegistrationState {
  viewModel: CreateRegistrationViewModel | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: boolean;
}

export function useCreateRegistrationPresenter(
  initialViewModel?: CreateRegistrationViewModel,
  presenterOverride?: CreateRegistrationPresenter
) {
  const presenter = useMemo(
    () => presenterOverride ?? createClientCreateRegistrationPresenter(),
    [presenterOverride]
  );
  
  const router = useRouter();

  const [state, setState] = useState<CreateRegistrationState>({
    viewModel: initialViewModel ?? null,
    loading: !initialViewModel,
    submitting: false,
    error: null,
    success: false,
  });

  const fetchViewModel = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const viewModel = await presenter.getViewModel();
      setState(prev => ({ ...prev, viewModel, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) {
      fetchViewModel();
    }
  }, [initialViewModel, fetchViewModel]);

  const create = async (data: RegistrationData) => {
    setState(prev => ({ ...prev, submitting: true, error: null }));
    try {
      await presenter.createRegistration(data);
      setState(prev => ({ ...prev, submitting: false, success: true }));
      
      // Redirect back after success
      setTimeout(() => {
        router.push('/admin/registrations');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, submitting: false }));
    }
  };

  return {
    state,
    actions: {
      create,
      cancel: () => router.push('/admin/registrations'),
      refresh: fetchViewModel,
    }
  };
}
