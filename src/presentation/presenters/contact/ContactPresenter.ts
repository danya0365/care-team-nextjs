/**
 * ContactPresenter
 * Handles business logic for the Contact page
 */

import { Metadata } from 'next';
import { siteConfig } from '@/src/config/site';

export interface ContactViewModel {
  siteName: string;
  phone: string;
  facebook: string;
  facebookUrl: string;
  location: string;
  areas: string[];
  coordinator: string;
}

export class ContactPresenter {
  async getViewModel(): Promise<ContactViewModel> {
    return {
      siteName: siteConfig.name,
      phone: siteConfig.phone,
      facebook: siteConfig.facebook,
      facebookUrl: siteConfig.facebookUrl,
      location: siteConfig.location,
      areas: [...siteConfig.areas],
      coordinator: siteConfig.coordinator,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: `ติดต่อเรา | ${siteConfig.name}`,
      description: `ช่องทางการติดต่อ ${siteConfig.name} เบอร์โทรศัพท์ พื้นที่ให้บริการ และช่องทางออนไลน์`,
    };
  }
}
