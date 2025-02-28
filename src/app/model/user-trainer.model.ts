export interface UserTrainer {
  id?: number; // Optional field
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  job_title: string;
  user_type: string;
  subscription_id: string;
  experience: number;
  specialties: string[];
  modes: UserTrainerModes;
  bio: string;
  linkedin_profile: string;
  publicProfile: boolean;
  total_webinars: number;
  followers: number;
  profile_image: string;
}
export interface UserTrainerModes {
  online: boolean;
  offline: boolean;
  hybrid: boolean;

}
