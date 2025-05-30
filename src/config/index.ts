// src/config/index.ts
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

interface EnvVars {
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_ENCRYPT: boolean;
  DB_TRUST_SERVER_CERT: boolean;
  JWT_SECRET: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

const envSchema = Joi.object<EnvVars>({
  PORT:                  Joi.number().default(4000),
  DB_HOST:               Joi.string().required(),
  DB_PORT:               Joi.number().default(1433),
  DB_USER:               Joi.string().required(),
  DB_PASSWORD:           Joi.string().required(),
  DB_DATABASE:           Joi.string().required(),
  DB_ENCRYPT:            Joi.boolean().default(true),
  DB_TRUST_SERVER_CERT:  Joi.boolean().default(true),
  JWT_SECRET:            Joi.string().min(32).required(),
  LOG_LEVEL:             Joi.string().valid('debug','info','warn','error').default('info'),
})
  .unknown()
  .required();

const { value: env, error } = envSchema.validate(process.env, { allowUnknown: true });
if (error) {
  throw new Error(`❌ Configuración inválida en .env: ${error.message}`);
}

export interface DbConfig {
  user: string;
  password: string;
  server: string;
  database: string;
  port: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

export interface Config {
  port: number;
  db: DbConfig;
  jwtSecret: string;
  logLevel: EnvVars['LOG_LEVEL'];
}

const config: Config = {
  port: env.PORT,
  db: {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_HOST,
    database: env.DB_DATABASE,
    port: env.DB_PORT,
    options: {
      encrypt: env.DB_ENCRYPT,
      trustServerCertificate: env.DB_TRUST_SERVER_CERT,
      enableArithAbort: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
  jwtSecret: env.JWT_SECRET,
  logLevel: env.LOG_LEVEL,
};

export default config;
