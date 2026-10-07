import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeWindow from '@site/src/components/Home/CodeWindow';
import CopyCommand from '@site/src/components/Home/CopyCommand';
import Toolkit from '@site/src/components/Home/Toolkit';
import styles from '@site/src/components/Home/styles.module.css';

const ROUTES_EXAMPLE = `// Respond to WordPress requests with a route.
Route::get('/post/{post}', function (Post $post) {
    return view('post')->with('post', $post);
});

Route::post('/upload/', function (Request $request) {
    $id = $request->file('image')->store_as_attachment();

    // Generate thumbnails in the background.
    Generate_Thumbnails::dispatch($id);

    return response()->json([ 'attachment_id' => $id ], 201);
});

Route::rest_api('namespace/v1', '/route-to-use', function () {
    return [ ... ];
});`;

const TEST_EXAMPLE = `class UploadTest extends TestCase {
    public function test_upload_file(): void {
        $post = static::factory()->post->create_and_get();

        $this->get($post)
            ->assertOk()
            ->assertSee($post->post_title);

        $this->post('/upload', [ 'image' => [ ... ] ])
            ->assertStatus(201);
    }
}`;

const PEST_EXAMPLE = `use function Pest\\PestPluginWordPress\\{
    fakeRequest,
    fetchPost,
};

it('renders a post', function () {
    fetchPost(['post_title' => 'Hello Pest'])
        ->assertOk()
        ->assertSee('Hello Pest');
});

it('syncs with the API', function () {
    fakeRequest('https://api.example.com/*')
        ->with_json(['synced' => true]);

    expect(sync_posts())->toBeTrue();
});`;

const BUILT_ON = ['WordPress', 'Composer', 'Symfony Routing', 'Blade', 'PHPUnit', 'Pest'];

const PRINCIPLES = [
  { title: 'Simplicity first', text: 'Enterprise-level WordPress development is possible and should have a simple, delightful syntax.' },
  { title: 'Inspired by Laravel', text: 'The flexibility of the Laravel framework inside WordPress, with a baked-in WordPress integration.' },
  { title: 'Readable for people and agents', text: 'Every page is available as Markdown, with llms.txt and llms-full.txt for AI tools.' },
];

function Arrow(): JSX.Element {
  return <span aria-hidden="true">→</span>;
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const logo = useBaseUrl('/img/logo-no-text.svg');

  return (
    <Layout description={siteConfig.tagline}>
      <main className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <Link href="https://github.com/alleyinteractive" className={styles.badge}>
                <span className={styles.badgeRule} aria-hidden="true" />
                Open source from Alley
              </Link>
              <h1 className={styles.heroTitle}>
                WordPress, with the structure of a framework.
                <span className={styles.heroTitleMuted}>Fluent. Testable. Still WordPress.</span>
              </h1>
              <p className={styles.heroLead}>
                Mantle is a Laravel-inspired framework for building large, robust websites and applications with WordPress.
              </p>
              <div className={styles.heroActions}>
                <CopyCommand command="composer require alleyinteractive/mantle-framework" />
                <Link to="/docs/getting-started" className={styles.buttonAccent}>
                  Get started <Arrow />
                </Link>
              </div>
            </div>
            <CodeWindow
              chrome
              className={styles.heroWindow}
              files={[
                { name: 'routes/web.php', code: ROUTES_EXAMPLE },
                { name: 'tests/UploadTest.php', code: TEST_EXAMPLE },
                { name: 'tests/PostTest.php', code: PEST_EXAMPLE },
              ]}
            />
          </div>
          <div className={styles.strata} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className={styles.builtOn}>
          <span className="mono-label">Built on</span>
          {BUILT_ON.map((name) => (
            <span key={name} className={styles.builtOnName}>{name}</span>
          ))}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionIntro}>
            <h2 className={styles.sectionTitle}>
              Everything an application needs. <span className={styles.muted}>WordPress core underneath.</span>
            </h2>
            <p className={styles.sectionText}>
              Underneath the hood, Mantle uses WordPress core functions and APIs. On top, you get the fluent toolkit you’d expect from Laravel.
            </p>
          </div>
          <Toolkit />
        </section>

        <section className={styles.split}>
          <div className={styles.splitCopy}>
            <span className={styles.eyebrow}>Testing</span>
            <h2 className={styles.sectionTitle}>An independent test framework for WordPress.</h2>
            <p className={styles.sectionText}>
              A drop-in replacement for the WordPress core test suite that runs faster and gives you IDE-friendly, fluent assertions. PHPUnit out of the box, with Pest support.
            </p>
            <div className={styles.inlineLinks}>
              <Link to="/docs/testing">Testing docs <span className={styles.accentText}>→</span></Link>
              <Link to="/docs/testing/parallel" className={styles.subtleLink}>Parallel testing</Link>
              <Link to="/docs/testing/snapshot-testing" className={styles.subtleLink}>Snapshot testing</Link>
            </div>
          </div>
          <CodeWindow className={styles.splitWindow} files={[{ name: 'tests/Feature/UploadTest.php', code: TEST_EXAMPLE }]} />
        </section>

        <section className={styles.calloutWrap}>
          <div className={styles.callout}>
            <div className={styles.calloutCopy}>
              <h2 className={styles.calloutTitle}>Not on Mantle? Use Testkit.</h2>
              <p className={styles.sectionText}>
                Bring the Mantle Testing Framework to an existing plugin, theme or wp-content project with no refactoring.
              </p>
            </div>
            <div className={styles.calloutAction}>
              <CopyCommand command="composer require --dev mantle-framework/testkit" className={styles.commandDark} />
              <Link to="/docs/testing/testkit" className={styles.calloutLink}>
                Read the Testkit guide <span className={styles.accentText}>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.principlesBand}>
          <div className={styles.principles}>
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.title} className={styles.principle}>
                <span className={styles.principleIndex}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.principleTitle}>{principle.title}</h3>
                  <p className={styles.principleText}>{principle.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.closing}>
          <img src={logo} alt="" width="64" height="64" className={styles.closingLogo} />
          <h2 className={styles.closingTitle}>
            Code should be fluent, testable <span className={styles.muted}>and delightful to work with.</span>
          </h2>
          <div className={styles.closingActions}>
            <Link to="/docs/getting-started" className={styles.buttonAccent}>
              Read the docs <Arrow />
            </Link>
            <Link href="https://github.com/alleyinteractive/mantle" className={styles.buttonGhost}>
              Contribute on GitHub
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
