import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FEATURES = [
  { chip: 'Route::get()', title: 'Routing', to: '/docs/basics/requests', description: 'Register web and REST API routes fluently, without touching add_rewrite_rule().' },
  { chip: 'Post::where()', title: 'Models & ORM', to: '/docs/models', description: 'Eloquent-style models, relationships, a query builder, factories and seeding for posts and terms.' },
  { chip: '@foreach', title: 'Blade Templating', to: '/docs/basics/blade', description: 'Render views with Blade or native PHP, with template helpers to keep them DRY.' },
  { chip: 'dispatch()', title: 'Queues', to: '/docs/features/queue', description: 'Run jobs in the background instead of blocking the request.' },
  { chip: 'Http::get()', title: 'HTTP Client', to: '/docs/features/http-client', description: 'A fluent client for remote requests, built on the WordPress HTTP API.' },
  { chip: 'wp mantle', title: 'Console Commands', to: '/docs/basics/commands', description: 'Write WP-CLI commands as classes with typed arguments and options.' },
  { chip: 'Schedule::job()', title: 'Scheduling', to: '/docs/features/scheduling-tasks', description: 'Define recurring tasks fluently, without wiring up WP-Cron by hand.' },
  { chip: 'Event::listen()', title: 'Hooks & Events', to: '/docs/features/hooks', description: 'An observer pattern on top of WordPress hooks, with typed listeners.' },
  { chip: 'Cache::get()', title: 'Cache', to: '/docs/features/cache', description: 'A fluent caching API backed by the WordPress object cache.' },
  { chip: 'Storage::put()', title: 'File System', to: '/docs/features/file-system', description: 'Flysystem-powered storage for local uploads or remote disks.' },
  { chip: 'register()', title: 'Service Providers', to: '/docs/architecture/service-provider', description: 'Bootstrap and organize your application’s functionality in one place.' },
  { chip: '->assertOk()', title: 'Testing', to: '/docs/testing', description: 'Fast, isolated tests with fluent HTTP and database assertions.' },
];

export default function Toolkit(): JSX.Element {
  return (
    <div className={styles.toolkit}>
      {FEATURES.map((feature) => (
        <Link key={feature.title} to={feature.to} className={styles.toolkitCard}>
          <code className={styles.chip}>{feature.chip}</code>
          <span className={styles.toolkitTitle}>{feature.title}</span>
          <span className={styles.toolkitDescription}>{feature.description}</span>
        </Link>
      ))}
    </div>
  );
}
