import { Trip } from 'src/trips/entity/trip.entity';
import { ChangeColumnTypeMigration1676651894119 } from 'src/common/db/1676651894119-ChangeColumnTypeMigration';

const entitiesList = [Trip];

const migrationsList = [ChangeColumnTypeMigration1676651894119];

export { entitiesList, migrationsList };

//npm run migration:generate -- src/common/db/Migration
//npm run migration:run
