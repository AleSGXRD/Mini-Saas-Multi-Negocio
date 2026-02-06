import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlanCode } from '../../subscription/entities/plan.entity';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(PlanCode)
  plan: PlanCode;
}
