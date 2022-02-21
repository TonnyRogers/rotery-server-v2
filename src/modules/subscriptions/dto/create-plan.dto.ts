import { PlanFrequencyType } from "@/entities/plan.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

export class AutoRecurringFreeTrialDto {
    @ApiProperty()
    frequency?: string;

    @ApiProperty()
    frequency_type?: "months" | "days";
}

export class AutoRecurringDto {
    @ApiProperty()
    @IsNotEmpty()
    frequency: string;

    @ApiProperty()
    @IsNotEmpty()
    frequency_type: PlanFrequencyType;

    @ApiProperty()
    transaction_amount?: number;

    @ApiProperty()
    @IsNotEmpty()
    currency_id: "BRL";

    @ApiProperty()
    repetitions?: number;

    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => AutoRecurringFreeTrialDto)
    free_trial?: AutoRecurringFreeTrialDto;
}


export class CreatePlanDto {
    @ApiProperty()
    back_url?: string;

    @ApiProperty()
    @IsNotEmpty()
    reason: string;

    @ApiProperty()
    @ValidateNested({ each: true })
    @IsNotEmpty()
    @Type(() => AutoRecurringDto)
    auto_recurring: AutoRecurringDto;
}

