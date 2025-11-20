/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'getting-started/index',
      },
      items: [
        'getting-started/installation',
        'getting-started/directory-structure',
        'getting-started/tutorial',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Concepts',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'architecture/index',
      },
      items: [
        'architecture/bootloader',
        'architecture/service-provider',
        'architecture/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Basics',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [
        'basics/requests',
        'basics/templating',
        'basics/blade',
        'basics/helpers',
        'basics/commands',
      ],
    },
    {
      type: 'category',
      label: 'Models',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'models/index',
      },
      items: [
        'models/query-builder',
        'models/model-registration',
        'models/model-relationships',
        'models/serialization',
        'models/database-factory',
        'models/seeding',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [
        'features/assets',
        'features/cache',
        'features/file-system',
        'features/hooks',
        'features/http-client',
        'features/queue',
        'features/scheduling-tasks',
        {
          type: 'category',
          label: 'Support',
          collapsed: true,
          link: {
            type: 'doc',
            id: 'features/support/support',
          },
          items: [
            'features/support/classname',
            'features/support/collections',
            'features/support/conditionable',
            'features/support/helpers',
            'features/support/hookable',
            'features/support/html',
            'features/support/macroable',
            'features/support/mixed-data',
            'features/support/pipeline',
            'features/support/singleton',
            'features/support/stringable',
            'features/support/uri',
          ],
        },
        'features/types',
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'testing/index',
      },
      items: [
        'testing/getting-started',
        'testing/testkit',
        'testing/installation-manager',
        'testing/requests',
        'testing/factory',
        'testing/assertions',
        'testing/state',
        'testing/deprecation-incorrect-usage',
        'testing/hooks',
        'testing/remote-requests',
        'testing/snapshot-testing',
        'testing/traits-attributes',
        'testing/users',
        'testing/cron',
        'testing/helpers',
        'testing/continuous-integration',
        'testing/parallel',
        'testing/pest',
        'testing/environmental-variables',
        'testing/migration-phpunit-9',
      ],
    },
    // TODO: Enable this again when packages are ready.
    // {
    //   type: 'category',
    //   label: 'Packages',
    //   link: {
    //     type: 'generated-index',
    //   },
    //   items: [
    //     'packages/browser-testing',
    //   ],
    // },
  ],
};

export default sidebars;