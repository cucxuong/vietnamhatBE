import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ClothesSize, StandardColor } from '../../tournament/utils/type';
import { Gender, PlayerStatus } from '../utils/type';

export class BooleanService {
  @Prop({ required: true })
  value: boolean;

  @Prop({ required: true })
  price: number;
}

export class ClothesService {
  @Prop({ required: true, type: 'enum', enum: StandardColor })
  color: StandardColor;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, type: 'enum', enum: ClothesSize })
  size: ClothesSize;

  @Prop({ required: true })
  price: number;
}

export class QuantityService {
  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export class PlayerSKill {
  @Prop({ required: true })
  play_exp: number;

  @Prop({ required: true })
  years: number;

  @Prop({ required: true })
  throwing: number;

  @Prop({ required: true })
  catching: number;

  @Prop({ required: true })
  cutting: number;

  @Prop({ required: true })
  defense: number;

  @Prop({ required: true })
  fitness: number;

  @Prop({ required: true })
  captain: number;

  @Prop({ required: false })
  team?: string;
}

export class PlayerService {
  @Prop({ required: true })
  base: BooleanService;

  @Prop({ required: true })
  lunch: BooleanService;

  @Prop({ required: false })
  is_vegan: boolean;

  @Prop({ required: false })
  allergies: string;

  @Prop({ required: true })
  bus: BooleanService;

  @Prop({ required: true })
  jerseys: ClothesService[];

  @Prop({ required: true })
  shorts: ClothesService[];

  @Prop({ required: true })
  disc: QuantityService;
}

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Player {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  nickname?: string;

  @Prop({ required: true })
  yob: string;

  @Prop({ required: true, type: 'string', enum: Gender })
  gender: Gender;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  is_student: boolean;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: 'string', enum: PlayerStatus })
  status: PlayerStatus;

  @Prop({ required: true })
  skills: PlayerSKill;

  @Prop({ required: true })
  services: PlayerService;
}

export type PlayerDocument = HydratedDocument<Player>;

export const PlayerSchema = SchemaFactory.createForClass(Player);
