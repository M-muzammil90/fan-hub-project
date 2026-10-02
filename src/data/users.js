import heroImg from '../assets/images/hero_soul_conductor_1790241240007.jpg';
import cyberImg from '../assets/images/fandom_cyber_warrior_1790241253788.jpg';
import animeImg from '../assets/images/anime_cat_art_1790241330377.jpg';
import gamingImg from '../assets/images/gaming_cat_art_1790241347460.jpg';

export const initialUsers = [
  {
    id: 'usr-1',
    name: 'Alex Vance',
    email: 'admin@fanhubplus.com',
    avatar: cyberImg,
    role: 'admin',
    favoriteCategories: ['Anime', 'Gaming', 'Manga'],
    bio: 'Lead Architect & Community Curator at Fan Hub Plus. Dark fantasy and mecha fanatic.',
    joinedDate: '2025-01-10'
  },
  {
    id: 'usr-admin-demo',
    name: 'Marcus Vance',
    email: 'marcus.vance@fanhub.io',
    avatar: cyberImg,
    role: 'admin',
    favoriteCategories: ['Anime', 'Gaming', 'Movies'],
    bio: 'Senior Community Moderator & System Admin.',
    joinedDate: '2025-01-15'
  },
  {
    id: 'usr-user-demo',
    name: 'Alex Hunter',
    email: 'alex.hunter@fanhub.io',
    avatar: heroImg,
    role: 'user',
    favoriteCategories: ['Anime', 'Cosplay', 'Gaming'],
    bio: 'Avid anime streamer and gaming enthusiast.',
    joinedDate: '2025-03-20'
  },
  {
    id: 'usr-2',
    name: 'Irakli.T',
    email: 'irakli@example.com',
    avatar: heroImg,
    role: 'user',
    favoriteCategories: ['Anime', 'Movies'],
    bio: 'Digital illustrator and animation soundtrack collector.',
    joinedDate: '2025-06-14'
  },
  {
    id: 'usr-3',
    name: 'Anna.S',
    email: 'anna.s@example.com',
    avatar: animeImg,
    role: 'user',
    favoriteCategories: ['Cosplay', 'Gaming'],
    bio: 'Competitive cosplay armorer and prop maker.',
    joinedDate: '2025-08-20'
  },
  {
    id: 'usr-4',
    name: 'Vika.J',
    email: 'vika.j@example.com',
    avatar: gamingImg,
    role: 'user',
    favoriteCategories: ['Comics', 'K-Pop'],
    bio: 'Multiverse comic archivist and concert streamer.',
    joinedDate: '2025-11-05'
  },
  {
    id: 'usr-5',
    name: 'Alesanda.B',
    email: 'alesanda@example.com',
    avatar: heroImg,
    role: 'user',
    favoriteCategories: ['Cosplay', 'Manga'],
    bio: 'Manga collector and LED electronics hobbyist.',
    joinedDate: '2026-01-12'
  },
  {
    id: 'usr-6',
    name: 'Dadd.H',
    email: 'dadd.h@example.com',
    avatar: cyberImg,
    role: 'user',
    favoriteCategories: ['Gaming', 'TV Shows'],
    bio: 'Speedrunner and acoustic game soundtrack composer.',
    joinedDate: '2026-02-01'
  }
];
