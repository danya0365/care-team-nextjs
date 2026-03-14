import { EventsManagementView } from '@/src/presentation/components/admin/events/EventsManagementView';
import { createServerEventsPresenter } from '@/src/presentation/presenters/events/EventsPresenterServerFactory';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'จัดการกิจกรรม - Admin',
  description: 'บริหารจัดการกิจกรรมและรอบการลงทะเบียน',
};

export default async function AdminEventsPage() {
  const presenter = createServerEventsPresenter();
  const viewModel = await presenter.getViewModel();
  
  return <EventsManagementView initialViewModel={viewModel} />;
}
