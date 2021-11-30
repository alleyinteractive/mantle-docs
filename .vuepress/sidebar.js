function prefix(prefix, children) {
  return children.map(child => `/${prefix}/${child}.md`)
}

module.exports = [
  {
    text: 'Getting Started',
    children: prefix('getting-started', [
      'installation',
      'directory-structure',
      'tutorial',
    ]),
  },
  {
    text: 'Architecture',
    children: prefix('architecture', [
      'architecture',
      'configuration',
    ]),
  },
  {
    text: 'Basics',
    children: prefix('basics', [
      'requests',
      'templating',
      'helpers',
      'commands',
    ]),
  },
  {
    text: 'Models',
    collapsable: false,
    children: prefix('models', [
      'models',
      'querying-models',
      'model-relationships',
      'model-registration',
      'model-factory',
      'serialization',
      'seeding',
    ]),
  },
  {
    text: 'Features',
    collapsable: false,
    children: prefix('features', [
      'queue',
      'scheduling-tasks',
      'hooks',
      'file-system',
      'caper',
      'cache',
    ]),
  },
  {
    text: 'Testing',
    collapsable: false,
    children: prefix('testing', [
      'test-framework',
      'transition',
      'continuous-integration',
      'assertions',
      'requests',
      'hooks',
      'cron',
      'remote-requests',
      'traits',
      'users',
    ]),
  },
  {
    text: 'Packages',
    collapsable: false,
    children: prefix('packages', [
      'browser-testing',
    ]),
  },
]
