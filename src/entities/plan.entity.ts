import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

export enum PlanFrequencyType {
    MONTHLY = 'months',
    DAILY = 'days',
}

export enum PlanStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
}

@Entity()
export class Plan {
    constructor({
        name,
        referenceId,
        amount,
        frequencyType,
        repetitions
    }: Omit<Plan, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        this.name = name;
        this.referenceId = referenceId;
        this.amount = amount;
        this.frequencyType = frequencyType;
        this.repetitions = repetitions;
    }

    @PrimaryKey()
    id!: number;

    @Property({ type: 'string' })
    referenceId!: string;

    @Property({ type: 'string' })
    name!: string;

    @Enum({ items: () => PlanFrequencyType, default: PlanFrequencyType.MONTHLY })
    frequencyType!: PlanFrequencyType;

    @Enum({ items: () => PlanStatus, default: PlanStatus.ACTIVE })
    status: PlanStatus;

    @Property({ columnType: 'decimal(8,2)'})
    amount!: string;

    @Property({ type: 'number'})
    repetitions!: number;

    @Property()
    createdAt: Date = new Date();
  
    @Property()
    updatedAt: Date = new Date();
  
    @Property({ nullable: true })
    deletedAt: Date;
}