'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditRegistrationViewModel, EditRegistrationPresenter } from './EditRegistrationPresenter';
import { createClientEditRegistrationPresenter } from './EditRegistrationPresenterClientFactory';
import { RegistrationData } from '@/src/application/repositories/IRegistrationRepository';
import { useRouter } from 'next/navigation';

export interface EditRegistrationState {
  viewModel: EditRegistrationViewModel | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  success: boolean;
}

export function useEditRegistrationPresenter(
  id: string,
  initialViewModel?: EditRegistrationViewModel,
  presenterOverride?: EditRegistrationPresenter
) {
  const presenter = useMemo(
    () => presenterOverride ?? createClientEditRegistrationPresenter(),
    [presenterOverride]
  );
  
  const router = useRouter();

  const [state, setState] = useState<EditRegistrationState>({
    viewModel: initialViewModel ?? null,
    loading: !initialViewModel,
    submitting: false,
    error: null,
    success: false,
  });

  const fetchViewModel = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const viewModel = await presenter.getViewModel(id);
      setState(prev => ({ ...prev, viewModel, loading: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [presenter, id]);

  useEffect(() => {
    if (!initialViewModel) {
      fetchViewModel();
    }
  }, [initialViewModel, fetchViewModel]);

  const update = async (data: Partial<RegistrationData>) => {
    setState(prev => ({ ...prev, submitting: true, error: null }));
    try {
      await presenter.updateRegistration(id, data);
      setState(prev => ({ ...prev, submitting: false, success: true }));
      
      // Redirect back after success
      setTimeout(() => {
        router.push('/manage-register');
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, submitting: false }));
    }
  };

  return {
    state,
    actions: {
      update,
      cancel: () => router.push('/manage-register'),
    }
  };
}
