import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult, ValidationChain } from 'express-validator';
import { TIPOS_IDENTIFICACION, TIPOS_SERVICIO } from '../utils/constants';
import { ValidationError } from '../utils/AppError';

/**
 * Ejecuta una lista de validators y consolida los errores en un único objeto.
 */
export const validate =
  (validations: ValidationChain[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }
    next(new ValidationError('Datos inválidos', errors.array()));
  };

// ---------- Validadores de Cliente ----------
export const createClienteValidators: ValidationChain[] = [
  body('identificacion')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('La identificación es obligatoria')
    .isLength({ max: 20 })
    .withMessage('La identificación no puede superar 20 caracteres'),
  body('nombres')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Los nombres son obligatorios')
    .isLength({ max: 80 }),
  body('apellidos')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Los apellidos son obligatorios')
    .isLength({ max: 80 }),
  body('tipoIdentificacion')
    .isIn(TIPOS_IDENTIFICACION as unknown as string[])
    .withMessage(
      `tipoIdentificacion debe ser uno de: ${TIPOS_IDENTIFICACION.join(', ')}`,
    ),
  body('fechaNacimiento')
    .isISO8601()
    .withMessage('fechaNacimiento debe tener formato YYYY-MM-DD'),
  body('numeroCelular')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('numeroCelular es obligatorio')
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage('numeroCelular tiene un formato inválido'),
  body('correoElectronico')
    .isEmail()
    .withMessage('correoElectronico debe ser un email válido')
    .isLength({ max: 80 }),
];

export const updateClienteValidators: ValidationChain[] = [
  param('identificacion').isString().trim().notEmpty(),
  body('nombres').optional().isString().trim().notEmpty().isLength({ max: 80 }),
  body('apellidos').optional().isString().trim().notEmpty().isLength({ max: 80 }),
  body('tipoIdentificacion')
    .optional()
    .isIn(TIPOS_IDENTIFICACION as unknown as string[]),
  body('fechaNacimiento').optional().isISO8601(),
  body('numeroCelular').optional().matches(/^[0-9+\-\s]{7,20}$/),
  body('correoElectronico').optional().isEmail().isLength({ max: 80 }),
];

export const identificacionParamValidator: ValidationChain[] = [
  param('identificacion').isString().trim().notEmpty(),
];

// ---------- Validadores de Servicio ----------
export const createServicioValidators: ValidationChain[] = [
  body('identificacion').isString().trim().notEmpty().isLength({ max: 20 }),
  body('servicio')
    .isIn(TIPOS_SERVICIO as unknown as string[])
    .withMessage(`servicio debe ser uno de: ${TIPOS_SERVICIO.join(', ')}`),
  body('fechaInicio').isISO8601(),
  body('ultimaFacturacion').isISO8601(),
  body('ultimoPago').optional().isInt({ min: 0 }),
];

export const updateServicioValidators: ValidationChain[] = [
  param('identificacion').isString().trim().notEmpty(),
  param('servicio').isIn(TIPOS_SERVICIO as unknown as string[]),
  body('fechaInicio').optional().isISO8601(),
  body('ultimaFacturacion').optional().isISO8601(),
  body('ultimoPago').optional().isInt({ min: 0 }),
];

export const servicioParamsValidator: ValidationChain[] = [
  param('identificacion').isString().trim().notEmpty(),
  param('servicio').isIn(TIPOS_SERVICIO as unknown as string[]),
];
