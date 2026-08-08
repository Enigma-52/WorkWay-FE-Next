export type TalentProfile = {
  id: number;
  user_id: string;
  username: string;
  display_name: string | null;
  professional_title: string | null;
  category: string | null;
  experience_level: string | null;
  years_of_experience: string | null;
  about: string | null;
  country: string | null;
  availability_status: string | null;
  hourly_rate: string | null;
  annual_salary: string | null;
  compensation_visibility: string | null;
  skills: string[] | null;
  languages: string[] | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type TalentSearchResponse = {
  profiles: TalentProfile[];
  total: number;
  page: number;
  totalPages: number;
};
