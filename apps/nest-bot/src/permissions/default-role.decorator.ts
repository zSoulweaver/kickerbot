import { SetMetadata } from '@nestjs/common'
import { PermissionLevel } from '@prisma/client'

export const DEFAULT_ROLE_METADATA = 'bot:default_role_meta'

export const DefaultRole = (role: PermissionLevel): MethodDecorator => SetMetadata(DEFAULT_ROLE_METADATA, role)
