'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ContactViewModel, ContactPresenter } from './ContactPresenter';

export interface ContactPresenterState {
  viewModel: ContactViewModel | null;
  loading: boolean;
  error: string | null;
}

export function useContactPresenter(
  initialViewModel?: ContactViewModel
): [ContactPresenterState, { loadData: () => Promise<void> }] {
  const presenter = useMemo(() => new ContactPresenter(), []);
  const isMountedRef = useRef(true);
  const [viewModel, setViewModel] = useState<ContactViewModel | null>(initialViewModel || null);
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await presenter.getViewModel();
      if (isMountedRef.current) setViewModel(data);
    } catch (err) {
      if (isMountedRef.current) setError('Failed to load contact data');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [presenter]);

  useEffect(() => {
    if (!initialViewModel) loadData();
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, [loadData, initialViewModel]);

  return [{ viewModel, loading, error }, { loadData }];
}
