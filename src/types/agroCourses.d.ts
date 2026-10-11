export type AgroCourseCategory = 'agronomy' | 'agrotech' | 'agri-business';

export interface AgroCourse {
  id: string;
  title: string;
  description: string;
  instructor_name: string;
  association_badge: string;
  target_audience: string[];
  enrolled_count: number;
  rating: number;
  modules_count: number;
  category: AgroCourseCategory;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AgroInstructor {
  id: string;
  full_name: string;
  role: string;
  association_badge: string;
  specialties: string[];
  is_verified?: boolean;
  profile_url?: string;
  created_at?: string;
  updated_at?: string;
}
