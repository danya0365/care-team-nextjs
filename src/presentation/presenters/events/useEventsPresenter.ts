'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EventsPresenter, EventsViewModel } from './EventsPresenter';
import { createClientEventsPresenter } from './EventsPresenterClientFactory';
import { Event } from '@/src/application/repositories/IEventRepository';

export interface EventsPresenterState extends EventsViewModel {
  submitting: boolean;
  success: boolean;
}

export interface EventsPresenterActions {
  loadData: () => Promise<void>;
  createEvent: (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateEvent: (id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  resetStatus: () => void;
}

/**
 * Custom hook for Events Management presenter
 * Manages the state and provides actions for CRUD operations
 */
export function useEventsPresenter(
  initialViewModel?: EventsViewModel,
  presenterOverride?: EventsPresenter
): [EventsPresenterState, EventsPresenterActions] {
  const presenter = useMemo(
    () => presenterOverride ?? createClientEventsPresenter(),
    [presenterOverride]
  );

  const isMountedRef = useRef(true);
  const [viewModel, setViewModel] = useState<EventsViewModel>(
    initialViewModel ?? { events: [], loading: true, error: null }
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadData = useCallback(async () => {
    setViewModel(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await presenter.getViewModel();
      if (isMountedRef.current) {
        setViewModel(data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setViewModel(prev => ({ ...prev, loading: false, error: 'Failed to load events' }));
      }
    }
  }, [presenter]);

  // Load data on initialization if not provided
  useEffect(() => {
    if (!initialViewModel) {
      loadData();
    }
  }, [initialViewModel, loadData]);

  const createEvent = useCallback(async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSubmitting(true);
    setSuccess(false);
    try {
      await presenter.createEvent({
        ...data,
        id: `event-${Date.now()}`,
      } as Event);
      if (isMountedRef.current) {
        setSuccess(true);
        await loadData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Create Event Error:', err);
      return false;
    } finally {
      if (isMountedRef.current) setSubmitting(false);
    }
  }, [presenter, loadData]);

  const updateEvent = useCallback(async (id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setSubmitting(true);
    setSuccess(false);
    try {
      await presenter.updateEvent(id, data);
      if (isMountedRef.current) {
        setSuccess(true);
        await loadData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Update Event Error:', err);
      return false;
    } finally {
      if (isMountedRef.current) setSubmitting(false);
    }
  }, [presenter, loadData]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await presenter.deleteEvent(id);
      if (isMountedRef.current) {
        await loadData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Delete Event Error:', err);
      return false;
    }
  }, [presenter, loadData]);

  const resetStatus = useCallback(() => {
    setSuccess(false);
  }, []);

  return [
    { ...viewModel, submitting, success },
    { loadData, createEvent, updateEvent, deleteEvent, resetStatus },
  ];
}
