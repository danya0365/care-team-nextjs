/**
 * StaticNavigationRepository
 * Static data implementation for navigation menus
 * Following Clean Architecture - Infrastructure layer
 */

import {
  INavigationRepository,
  NavigationItem,
} from '@/src/application/repositories/INavigationRepository';

const MAIN_MENU: NavigationItem[] = [
  {
    id: 'home',
    label: 'หน้าแรก',
    href: '/',
  },
  {
    id: 'about',
    label: 'เกี่ยวกับเรา',
    href: '/about',
  },
  {
    id: 'services',
    label: 'บริการ',
    href: '/services',
  },
  {
    id: 'contact',
    label: 'ติดต่อเรา',
    href: '/contact',
  },
  {
    id: 'register',
    label: 'ลงทะเบียน',
    href: '/register',
  },
];

const FOOTER_MENU: NavigationItem[] = [
  {
    id: 'home',
    label: 'หน้าแรก',
    href: '/',
  },
  {
    id: 'about',
    label: 'เกี่ยวกับเรา',
    href: '/about',
  },
  {
    id: 'services',
    label: 'บริการของเรา',
    href: '/services',
  },
  {
    id: 'contact',
    label: 'ติดต่อเรา',
    href: '/contact',
  },
  {
    id: 'register',
    label: 'ลงทะเบียน',
    href: '/register',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/CareTeamSongkhla',
    isExternal: true,
  },
];

export class StaticNavigationRepository implements INavigationRepository {
  async getMainMenu(): Promise<NavigationItem[]> {
    return [...MAIN_MENU];
  }

  async getFooterMenu(): Promise<NavigationItem[]> {
    return [...FOOTER_MENU];
  }
}

export const staticNavigationRepository = new StaticNavigationRepository();
