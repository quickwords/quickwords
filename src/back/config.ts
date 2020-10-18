import { version } from '../../package.json'

export const config = {
  ...process.env,
  APP_ENVIRONMENT: 'ELECTRON_IS_DEV' in process.env ? 'development' : 'production',
  APP_VERSION: version,
}
