import { Injectable } from '@nestjs/common'
import { Arguments, Command, CommandGroup } from 'src/kicker'
import { AliasAddInput } from './dto/alias-add.input'
import { AliasService } from './alias.service'
import { AliasRemoveInput } from './dto/alias-remove.input'

@Injectable()
@CommandGroup({ name: 'alias' })
export class AliasCommands {
  constructor(
    private readonly aliasService: AliasService
  ) {}

  @Command({ name: 'add' })
  public async addAlias(@Arguments args: AliasAddInput) {
    await this.aliasService.addAlias(args.target, args.alias)
    return `Alias "${args.alias.toLowerCase()}" has been added for the command/group "${args.target.toLowerCase()}"`
  }

  @Command({ name: 'remove' })
  public async removeAlias(@Arguments args: AliasRemoveInput) {
    await this.aliasService.removeAlias(args.alias)
    return `Alias "${args.alias.toLowerCase()}" has been removed`
  }
}
