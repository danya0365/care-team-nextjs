/**
 * INavigationRepository
 * Repository interface for navigation menu data access
 * Following Clean Architecture - Application layer
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isExternal?: boolean;
  children?: NavigationItem[];
}

export interface INavigationRepository {
  getMainMenu(): Promise<NavigationItem[]>;
  getFooterMenu(): Promise<NavigationItem[]>;
}
