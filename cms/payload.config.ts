import path from 'path';
import dotenv from 'dotenv';
import { buildConfig } from 'payload/config';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';

import { Tenants } from './collections/Tenants';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Events } from './collections/Events';
import { People } from './collections/People';
import { Sponsors } from './collections/Sponsors';
import { Slideshows } from './collections/Slideshows';
import { Galleries } from './collections/Galleries';
import { Navigations } from './collections/Navigations';
import { Forms } from './collections/Forms';
import { FormSubmissions } from './collections/FormSubmissions';
import { Users } from './collections/Users';
import { TenantUsers } from './collections/TenantUsers';
import { PostCategories } from './collections/PostCategories';
import { PostTags } from './collections/PostTags';
import { EventCategories } from './collections/EventCategories';
import { Disciplines } from './collections/Disciplines';
import { Settings } from './globals/Settings';
import { registerCmsMonitoring } from './monitoring/sentry';

dotenv.config();

type RequiredEnv = 'DATABASE_URL' | 'S3_BUCKET' | 'S3_ACCESS_KEY_ID' | 'S3_SECRET_ACCESS_KEY';

const ensureEnv = (key: RequiredEnv) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const storageAdapter = s3Adapter({
  bucket: ensureEnv('S3_BUCKET'),
  config: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? 'ap-southeast-1',
    credentials: {
      accessKeyId: ensureEnv('S3_ACCESS_KEY_ID'),
      secretAccessKey: ensureEnv('S3_SECRET_ACCESS_KEY'),
    },
  },
  acl: 'public-read',
});

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  collections: [
    Tenants,
    Media,
    Pages,
    Navigations,
    Posts,
    PostCategories,
    PostTags,
    Events,
    EventCategories,
    Disciplines,
    People,
    Sponsors,
    Slideshows,
    Galleries,
    Forms,
    FormSubmissions,
    TenantUsers,
    Users,
  ],
  globals: [Settings],
  localization: {
    locales: [
      { code: 'vi', label: 'Tiếng Việt', default: true },
      { code: 'en', label: 'English' },
    ],
    fallback: true,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(__dirname),
    },
    meta: {
      favicon: '/favicon.ico',
      titleSuffix: ' · CTT CMS',
    },
  },
  db: sqliteAdapter({
    client: {
      url: ensureEnv('DATABASE_URL'),
    },
  }),
  cors: (process.env.CMS_CORS ?? 'http://localhost:3000').split(','),
  csrf: (process.env.CMS_CSRF ?? 'http://localhost:3000').split(','),
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
  graphQL: {
    disable: false,
  },
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: storageAdapter,
        },
      },
    }),
  ],
  onInit: async (payload) => {
    if (payload?.express) {
      const sentryEnabled = registerCmsMonitoring(payload.express);
      if (sentryEnabled) {
        payload.logger.info('Sentry monitoring initialised for CMS');
      } else {
        payload.logger.debug('Sentry monitoring skipped (missing DSN or disabled)');
      }
    }
  },
});
