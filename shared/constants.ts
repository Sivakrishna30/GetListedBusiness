import { CategoryInfo } from './types.ts';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'sports',
    name: 'Sports',
    subCategories: ['Turf', 'Badminton', 'Box Cricket', 'Tennis', 'Football'],
  },
  {
    id: 'fitness',
    name: 'Fitness',
    subCategories: ['Gym', 'Yoga', 'Pilates', 'CrossFit', 'Personal Training'],
  },
  {
    id: 'leisure',
    name: 'Leisure',
    subCategories: ['Swimming Pool', 'Bowling', 'Gaming Arena', 'Resort Activity'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    subCategories: ['Clinic', 'Hospital', 'Dental', 'Physiotherapy', 'Diagnostics'],
  },
  {
    id: 'wellness',
    name: 'Wellness & Salons',
    subCategories: ['Salon', 'Spa', 'Skin Care', 'Hair Studio'],
  },
  {
    id: 'education',
    name: 'Learning & Dance',
    subCategories: ['Dance Studio', 'Music Academy', 'Martial Arts', 'Art Workshop'],
  },
];

export const AMENITIES_LIST = [
  'Air Conditioning',
  'Changing Rooms',
  'Showers',
  'Parking Available',
  'Drinking Water',
  'Equipment Provided',
  'Lockers',
  'First Aid',
  'Free Wi-Fi',
  'Floodlights',
  'Cafeteria',
  'Waiting Lounge',
];

export const STANDARD_AMENITIES = AMENITIES_LIST;

export const TIME_SLOTS = [
  '06:00 - 07:00',
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
  '22:00 - 23:00',
];
