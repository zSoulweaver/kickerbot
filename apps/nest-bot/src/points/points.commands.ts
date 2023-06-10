import { Injectable, UseGuards } from '@nestjs/common'
import { Arguments, Command, CommandGroup, Sender } from 'src/kicker'
import { RoleGuard } from 'src/permissions/role.guard'
import { SettingsService } from 'src/settings/settings.service'
import { PointsGetInput } from './dto/points-get.dto'
import { PointsNameSetInput } from './dto/points-name-set.dto'
import { PointsSetInput } from './dto/points-set.dto'
import { PointsService } from './points.service'
import { DefaultRole } from 'src/permissions/default-role.decorator'
import { ChatMessageEvent } from '@kickerbot/kclient'
import { CooldownGuard } from 'src/cooldown/cooldown.guard'

@Injectable()
@CommandGroup({ name: 'points' })
@UseGuards(CooldownGuard, RoleGuard)
export class PointsCommands {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly pointsService: PointsService
  ) { }

  @Command({ name: '' })
  async getUserPoints(
    @Arguments args: PointsGetInput,
    @Sender() sender: ChatMessageEvent['sender']
  ) {
    const targetUser = args.username ?? sender.username
    const points = await this.pointsService.getPoints(targetUser)
    const pointName = await this.settingsService.getSetting('pointsName') ?? 'points'
    return `${targetUser} currenly has ${points ?? 0} ${pointName}`
  }

  @Command({ name: 'set' })
  async setUserPoints(@Arguments args: PointsSetInput) {
    await this.pointsService.setPoints(args.username, args.points)
    return `Set points for ${args.username} to ${args.points}`
  }

  @Command({ name: 'name set' })
  @DefaultRole('MODERATOR')
  async setPointsName(@Arguments args: PointsNameSetInput) {
    await this.settingsService.set('pointsName', args.name)
    return `Current points name has been set to "${args.name}"`
  }

  @Command({ name: 'name' })
  async getPointsName() {
    const name = (await this.settingsService.getSetting('pointsName')) ?? 'Points'
    return `Current points name is "${name}"`
  }
}
