// App constants
// Import version from package.json
import pkg from '../../package.json'

// Define type for package.json
interface PackageJson {
  version: string
  name: string
  [key: string]: any
}

// Type assertion for the imported package
const typedPkg = pkg as PackageJson

export const APP_VERSION = typedPkg.version
