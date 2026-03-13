/**
 * Site Configuration
 * Central place for site-wide settings
 */

export const siteConfig = {
  name: 'Care Team Songkhla',
  nameShort: 'CTS',
  nameThai: 'กลุ่มคนทำงานดูแลผู้ใช้สารเสพติดจังหวัดสงขลา',
  description:
    'ให้บริการด้านสุขภาพและสังคมแก่กลุ่มผู้ใช้สารเสพติด โดยมุ่งเน้นการลดอันตรายจากการใช้ยา (Harm Reduction) และการป้องกันโรคติดต่อ',
  phone: '074-800-143',
  facebook: 'Care Team Songkhla',
  facebookUrl: 'https://www.facebook.com/CareTeamSongkhla',
  location: 'จังหวัดสงขลา',
  areas: ['สะเดา', 'จะนะ'],
  partners: [
    'โครงการ STAR B/HIV (Global Fund)',
    'กระทรวงสาธารณสุข',
    'โรงพยาบาลสะเดา',
    'โรงพยาบาลจะนะ',
  ],
  director: 'คุณนูซาบะห์ สะมาเฮาะ',
  coordinator: 'คุณอัมพรรัตน์ ประไพวงศ์',
} as const;
