'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ServicesViewModel, ServicesPresenter } from './ServicesPresenter';
import { createClientServicesPresenter } from './ServicesPresenterClientFactory';

export interface ServicesPresenterState {
  viewModel: ServicesViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface ServicesPresenterActions {
  loadData: () => Promise<void>;
}

export function useServicesPresenter(
  initialViewModel?: ServicesViewModel,
  presenterOverride?: ServicesPresenter
): [ServicesPresenterState, ServicesPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientServicesPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const [viewModel, setViewModel] = useState<ServicesViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await presenter.getViewModel();
      if (isMountedRef.current) {
        setViewModel(data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [loadData, initialViewModel]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return [{ viewModel, loading, error }, { loadData }];
}
