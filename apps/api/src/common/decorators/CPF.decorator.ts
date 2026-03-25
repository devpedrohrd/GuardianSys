import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(cpf: any, args: ValidationArguments) {
          if (typeof cpf !== 'string') return false

          cpf = cpf.replace(/[^\d]+/g, '')

          if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

          let soma = 0
          for (let i = 0; i < 9; i++) soma += +cpf[i] * (10 - i)
          let resto = (soma * 10) % 11
          if (resto === 10 || resto === 11) resto = 0
          if (resto !== +cpf[9]) return false

          soma = 0
          for (let i = 0; i < 10; i++) soma += +cpf[i] * (11 - i)
          resto = (soma * 10) % 11
          if (resto === 10 || resto === 11) resto = 0
          return resto === +cpf[10]
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} inválido`
        },
      },
    })
  }
}
