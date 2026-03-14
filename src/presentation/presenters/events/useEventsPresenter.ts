'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { EventsViewModel, EventsPresenter } from './EventsPresenter';
import { createClientEventsPresenter } from './EventsPresenterClientFactory';
import { Event } from '@/src/application/repositories/IEventRepository';

export interface EventsState {
  viewModel: EventsViewModel | null;
  loading: boolean;
  error: string | null;
  actionLoading: string | null;
  submitting: boolean;
  registrationCount: number | null;
  // Query State
  page: number;
  limit: number;
  search: string;
  isActive: boolean | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useEventsPresenter(
  initialViewModel?: EventsViewModel,
  presenterOverride?: EventsPresenter
) {
  const presenter = useMemo(
    () => presenterOverride ?? createClientEventsPresenter(),
    [presenterOverride]
  );

  const [state, setState] = useState<EventsState>({
    viewModel: initialViewModel ?? null,
    loading: !initialViewModel,
    error: null,
    actionLoading: null,
    submitting: false,
    registrationCount: null,
    // Initial Query Params
    page: 1,
    limit: 10,
    search: '',
    isActive: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchViewModel = useCallback(async (queryOptions?: Partial<EventsState>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const options = {
        page: queryOptions?.page ?? state.page,
        limit: queryOptions?.limit ?? state.limit,
        search: queryOptions?.search ?? state.search,
        isActive: queryOptions?.isActive !== undefined ? queryOptions.isActive : state.isActive,
        sortBy: queryOptions?.sortBy ?? state.sortBy,
        sortOrder: queryOptions?.sortOrder ?? state.sortOrder,
      };
      
      const viewModel = await presenter.getViewModel(options);
      setState(prev => ({ 
        ...prev, 
        viewModel, 
        loading: false,
        ...queryOptions // Update state with the options used for fetching
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [presenter, state.page, state.limit, state.search, state.isActive, state.sortBy, state.sortOrder]);

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
  const applyFilters = (filters: { isActive?: boolean | null }) => 
    fetchViewModel({ ...filters, page: 1 });
  const applySorting = (sortBy: string, sortOrder: 'asc' | 'desc') => 
    fetchViewModel({ sortBy, sortOrder, page: 1 });

  useEffect(() => {
    if (!initialViewModel) {
      fetchViewModel();
    }
  }, [initialViewModel]);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setState(prev => ({ ...prev, actionLoading: id }));
    try {
      await presenter.updateEvent(id, { isActive: !currentStatus });
      await fetchViewModel();
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      setState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  const createEvent = async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    setState(prev => ({ ...prev, submitting: true }));
    try {
      await presenter.createEvent(data);
      await fetchViewModel();
      return true;
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
      return false;
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  const updateEvent = async (id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setState(prev => ({ ...prev, submitting: true }));
    try {
      await presenter.updateEvent(id, data);
      await fetchViewModel();
      return true;
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
      return false;
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  };

  const fetchRegistrationCount = async (id: string) => {
    try {
      const count = await presenter.getRegistrationCount(id);
      setState(prev => ({ ...prev, registrationCount: count }));
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  };

  const deleteEvent = async (id: string) => {
    setState(prev => ({ ...prev, actionLoading: id }));
    try {
      await presenter.deleteEvent(id);
      await fetchViewModel();
      setState(prev => ({ ...prev, error: null })); // Clear any potential "cannot delete" errors on success
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message }));
      throw err; // Re-throw to handle in UI if needed
    } finally {
      setState(prev => ({ ...prev, actionLoading: null }));
    }
  };

  return {
    state,
    actions: {
      createEvent,
      updateEvent,
      toggleStatus,
      deleteEvent,
      fetchRegistrationCount,
      resetRegistrationCount: () => setState(prev => ({ ...prev, registrationCount: null })),
      clearError: () => setState(prev => ({ ...prev, error: null })),
      refresh: fetchViewModel,
      changePage,
      changeLimit,
      applySearch,
      applyFilters,
      applySorting,
    }
  };
}
