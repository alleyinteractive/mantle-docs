import React from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import styles from './styles.module.css';
import clsx from 'clsx';

const HomepageExamples = () => (
  <div className="container">
    <div className={styles.featureRow}>
      <div className={styles.featureCode}>
        <CodeBlock language="php">
          {`Route::get( '/post/{post}', function ( Post $post ) {
  return view( 'post' )->with( 'post', $post );
} );

Route::post( '/upload/', function ( Request $post ) {
  $attachment_id = $request->file( 'uploaded_image' )->store_as_attachment();

  return response()->json( [
    'attachment_id' => $attachment_id,
    'message'       => 'Image uploaded successfully',
  ] );
} );

Route::rest_api( 'namespace/v1', '/route-to-use', function() {
  return [ ... ];
} );`}
        </CodeBlock>
      </div>
      <div className={styles.featureDescription}>
        <h4 className="featureTitle">
          <Link to="/docs/basics/requests">Flexible RESTful Routing</Link>
        </h4>
        <p className="featureDescription">
          Use a Symfony-powered routing framework on top of WordPress to respond to requests in your application. Respond to requests using native PHP or Blade templates, both supporting a set of powerful template helpers to help DRY up your templates.
        </p>
      </div>
    </div>
    <div className={clsx(styles.featureRow, styles.featureRowFlipped)}>
      <div className={styles.featureCode}>
        <CodeBlock language="php">
          {`$post = static::factory()->post->create_and_get();

$this->get( $post )
  ->assertOk()
  ->assertSee( $post->post_title );

$this->post( '/upload', [
  'uploaded_file' => [ ... ],
] )
  ->assertStatus( 201 )
  ->assertJsonPath( 'message', 'Image uploaded successfully' );`}
        </CodeBlock>
      </div>
      <div className={styles.featureDescription}>
        <h4 className="featureTitle">
          <Link to="/docs/testing">Independent Test Framework</Link>
        </h4>
        <p className="featureDescription">
          Use the independent Mantle Test Framework to make writing unit tests simpler than ever. Supports a drop-in replacement for WordPress core testing framework that will run faster and allow IDE-friendly assertions. Runs PHPUnit 9.5+ out of the box.
        </p>
      </div>
    </div>
  </div>
);

export default HomepageExamples;