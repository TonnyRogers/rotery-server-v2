import { Location } from "@/entities/location.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { LocationsController } from "./locations.controller";
import { locationsProvider } from "./providers";

@Module({
  imports: [MikroOrmModule.forFeature([Location])],
  controllers: [LocationsController],
  providers: locationsProvider,
  exports: locationsProvider,
})
export class LocationsModule {}