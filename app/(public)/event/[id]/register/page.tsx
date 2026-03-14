import { RegisterView } from '@/src/presentation/components/register/RegisterView';
import { RegisterPresenterServerFactory } from '@/src/presentation/presenters/register/RegisterPresenterServerFactory';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const presenter = RegisterPresenterServerFactory.create();
  const event = await presenter.getEventById(id);
  
  if (!event) {
    return {
      title: 'ไม่พบกิจกรรม',
    };
  }

  return {
    title: `ลงทะเบียนกิจกรรม - ${event.title}`,
    description: event.description || 'ลงทะเบียนแจ้งความประสงค์เข้าร่วมกิจกรรมกับ Care Team Songkhla',
  };
}

/**
 * Dynamic Event Registration Page
 * Validates event existence before rendering the view
 */
export default async function EventRegisterPage({ params }: Props) {
  const { id } = await params;
  
  const presenter = RegisterPresenterServerFactory.create();
  const event = await presenter.getEventById(id);

  if (!event) {
    notFound();
  }
  
  return <RegisterView eventId={id} />;
}
