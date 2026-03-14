'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RegistrationsViewModel, RegistrationsPresenter } from './RegistrationsPresenter';
import { createClientRegistrationsPresenter } from './RegistrationsPresenterClientFactory';

export interface RegistrationsState {
  viewModel: RegistrationsViewModel | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null; // ID of registration being updated
}

export function useRegistrationsPresenter(
  initialViewModel?: RegistrationsViewModel,
  presenterOverride?: RegistrationsPresenter
) {
  const presenter = useMemo(
    () => presenterOverride ?? createClientRegistrationsPresenter(),
    [presenterOverride]
  );

  const [state, setState] = useState<RegistrationsState>({
    viewModel: initialViewModel ?? null,
    loading: !initialViewModel,
    error: null,
    actionLoading: null,
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

  const updateStatus = async (id: string, status: string) => {
    setState(prev => ({ ...prev, actionLoading: id }));
    try {
      await presenter.updateStatus(id, status);
      await fetchViewModel();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('ยืนยันการลบข้อมูลนี้หรือไม่?')) return;
    
    setState(prev => ({ ...prev, actionLoading: id }));
    try {
      await presenter.deleteRegistration(id);
      await fetchViewModel();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  return {
    state,
    actions: {
      updateStatus,
      deleteRegistration,
      refresh: fetchViewModel,
    }
  };
}
