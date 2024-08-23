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
        // todo: switch to a welcome or introduction page.
        id: 'getting-started/installation',
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
        id: 'architecture/architecture',
      },
      items: [
        'architecture/architecture',
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
        id: 'models/models',
      },
      items: [
        'models/models',
        'models/query-builder',
        'models/model-relationships',
        'models/model-registration',
        'models/serialization',
        'models/model-factory',
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
        'features/caper',
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
            'features/support/collections',
            'features/support/conditionable',
            'features/support/hookable',
            'features/support/macroable',
            'features/support/pipeline',
            'features/support/singleton',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      link: {
        type: 'doc',
        id: 'testing/testing',
      },
      items: [
        'testing/testing',
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
        'testing/traits',
        'testing/users',
        'testing/cron',
        'testing/helpers',
        'testing/continuous-integration',
        'testing/pest',
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