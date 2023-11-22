import { PlayerService, PlayerSkill } from '../schema/player.schema';
import { Gender, PlayerStatus } from '../utils/type';

export class PlayerData {
  _id: string;
  email: string;
  name: string;
  nickname?: string;
  yob: string;
  gender: Gender;
  country: string;
  is_student: boolean;
  code: string;
  status: PlayerStatus;
  skills: PlayerSkill;
  services: PlayerService;
  total_fee?: number;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PlayerData>) {
    Object.assign(this, partial);
  }
}
