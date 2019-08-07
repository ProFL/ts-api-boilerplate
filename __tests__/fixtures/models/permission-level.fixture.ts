import {getConnection, Repository} from 'typeorm';
import {PermissionLevels} from '../../../src/helpers/enums/permission-levels.enum';
import {PermissionLevel} from '../../../src/models/permission-level.model';

export default class PermissionLevelFixture {
  private static get permLevelRepo(): Repository<PermissionLevel> {
    return getConnection().getRepository(PermissionLevel);
  }

  static async givenPermissionLevel(
    permissionLevel: PermissionLevels,
  ): Promise<PermissionLevel> {
    try {
      const permLevel = await this.permLevelRepo.findOneOrFail(permissionLevel);
      return permLevel;
    } catch (err) {
      return this.permLevelRepo.save(
        this.permLevelRepo.create({
          id: permissionLevel,
          name: PermissionLevels[permissionLevel],
        }),
      );
    }
  }
}
