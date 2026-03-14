'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RegistrationsViewModel, RegistrationsPresenter } from './RegistrationsPresenter';
import { createClientRegistrationsPresenter } from './RegistrationsPresenterClientFactory';

export interface RegistrationsState {
  viewModel: RegistrationsViewModel | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  // Query State
  page: number;
  limit: number;
  search: string;
  status: string;
  eventId: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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
    // Initial Query Params
    page: 1,
    limit: 10,
    search: '',
    status: '',
    eventId: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchViewModel = useCallback(async (queryOptions?: Partial<RegistrationsState>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const options = {
        page: queryOptions?.page ?? state.page,
        limit: queryOptions?.limit ?? state.limit,
        search: queryOptions?.search ?? state.search,
        status: queryOptions?.status ?? state.status,
        eventId: queryOptions?.eventId ?? state.eventId,
        sortBy: queryOptions?.sortBy ?? state.sortBy,
        sortOrder: queryOptions?.sortOrder ?? state.sortOrder,
      };
      
      const viewModel = await presenter.getViewModel(options as any);
      setState(prev => ({ 
        ...prev, 
        viewModel, 
        loading: false,
        ...queryOptions // Update state with the options used for fetching
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [presenter, state.page, state.limit, state.search, state.status, state.eventId, state.sortBy, state.sortOrder]);

  const [debouncedSearch, setDebouncedSearch] = useState(state.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch !== state.search) {
        fetchViewModel({ search: debouncedSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedSearch, state.search, fetchViewModel]);

  const changePage = (page: number) => fetchViewModel({ page });
  const changeLimit = (limit: number) => fetchViewModel({ limit, page: 1 });
  const applySearch = (search: string) => setDebouncedSearch(search);
  const applyFilters = (filters: { status?: string, eventId?: string | null }) => 
    fetchViewModel({ ...filters, page: 1 });
  const applySorting = (sortBy: string, sortOrder: 'asc' | 'desc') => 
    fetchViewModel({ sortBy, sortOrder, page: 1 });

  useEffect(() => {
    if (!initialViewModel) {
      fetchViewModel();
    }
  }, [initialViewModel]);

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
      changePage,
      changeLimit,
      applySearch,
      applyFilters,
      applySorting,
    }
  };
}
