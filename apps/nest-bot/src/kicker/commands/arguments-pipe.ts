import { deserialize, getProperty, ReflectionClass, ReflectionKind, TypeClass, typeOf, validate, ValidationError } from '@deepkit/type'
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ArgumentsPipe implements PipeTransform<any> {
  transform(value: string[], metadata: ArgumentMetadata) {
    const DTOType: any = metadata.metatype
    const reflection = ReflectionClass.from(DTOType)
    const propertyNames = reflection.getPropertyNames()
    const type = typeOf<typeof DTOType>()

    const argumentObject = {}

    for (const [i, property] of propertyNames.entries()) {
      const typeInfo = getProperty(type as TypeClass, property)
      if (i === propertyNames.length - 1) {
        // Last Loop - Check if we have an array type to fill
        if (typeInfo?.type.kind === ReflectionKind.array) {
          argumentObject[property] = value.slice(i)
        } else {
          argumentObject[property] = value[i]
        }
      } else {
        argumentObject[property] = value[i]
      }
    }

    const deserialized = deserialize<typeof DTOType>(argumentObject as any)
    const errors = validate<typeof DTOType>(deserialized)
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
    return deserialized
  }
}
