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

    const newValue: string[] = []
    const skippedIndexes: number[] = []
    for (let i = 0; i < value.length; i++) {
      if (skippedIndexes.includes(i)) {
        continue
      }

      const arg = value[i]

      if (arg.startsWith('"')) {
        const searchArray = value.slice(i)
        const searchEnd = searchArray.findIndex(x => x.endsWith('"'))
        if (searchEnd >= 0) {
          const quoteValue = searchArray.slice(0, searchEnd + 1)
          const finalValue = quoteValue.join(' ').replace(/['"]+/g, '')
          const indexesToSkip = Array.from({ length: quoteValue.length }, (_, x) => x + i)
          skippedIndexes.push(...indexesToSkip)
          newValue.push(finalValue)
          continue
        }
      }

      newValue.push(arg)
    }

    for (const [i, property] of propertyNames.entries()) {
      if (i === propertyNames.length - 1) { // Last Loop - Check if we have an array type to fill
        const typeInfo = getProperty(type as TypeClass, property)
        if (typeInfo?.type.kind === ReflectionKind.array) {
          argumentObject[property] = newValue.slice(i)
          continue
        }
      }

      argumentObject[property] = newValue[i]
    }

    const deserialized = deserialize<typeof DTOType>(argumentObject as any)
    const errors = validate<typeof DTOType>(deserialized)
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }
    return deserialized
  }
}
