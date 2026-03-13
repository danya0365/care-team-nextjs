'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AboutViewModel, AboutPresenter } from './AboutPresenter';
import { createClientAboutPresenter } from './AboutPresenterClientFactory';

export interface AboutPresenterState {
  viewModel: AboutViewModel | null;
  loading: boolean;
  error: string | null;
}

export interface AboutPresenterActions {
  loadData: () => Promise<void>;
}

export function useAboutPresenter(
  initialViewModel?: AboutViewModel,
  presenterOverride?: AboutPresenter
): [AboutPresenterState, AboutPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientAboutPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const [viewModel, setViewModel] = useState<AboutViewModel | null>(initialViewModel || null);
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
