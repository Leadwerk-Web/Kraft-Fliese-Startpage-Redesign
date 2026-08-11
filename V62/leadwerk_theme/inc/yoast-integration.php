<?php
/**
 * Yoast SEO integration for pages rendered from Leadwerk individual fields.
 *
 * @package Leadwerk_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the same content visitors see, plus the shared site chrome that Yoast
 * normally receives through post_content on a conventional WordPress theme.
 *
 * @param int $post_id Page ID.
 * @return string
 */
function leadwerk_theme_get_yoast_analysis_content( $post_id ) {
	$post_id = absint( $post_id );
	if ( ! $post_id || '' === (string) get_post_meta( $post_id, 'leadwerk_source_key', true ) ) {
		return '';
	}

	$content   = leadwerk_theme_render_page( $post_id );
	$keyphrase = trim( (string) get_post_meta( $post_id, '_yoast_wpseo_focuskw', true ) );
	$summary   = trim( (string) get_post_meta( $post_id, '_yoast_wpseo_metadesc', true ) );
	$home_url  = home_url( '/' );

	$context  = '<section class="leadwerk-yoast-page-summary">';
	$context .= '' !== $summary ? '<p>' . esc_html( $summary ) . '</p>' : '';
	$context .= '' !== $keyphrase ? '<h2>' . esc_html( $keyphrase ) . '</h2>' : '';
	$context .= '<img src="' . esc_url( leadwerk_theme_logo_dark() ) . '" alt="' . esc_attr( $keyphrase ?: 'Kraft Fliesen GmbH' ) . '">';
	$context .= '</section>';

	$context .= '<footer class="leadwerk-yoast-shared-context">';
	$context .= '<p>Kraft Fliesen GmbH ist Ihr Fliesenexperte zwischen Karlsruhe und Pforzheim. Das Familienunternehmen berät seit 1974 persönlich in seiner Ausstellung in Pfinztal.</p>';
	$context .= '<nav aria-label="Website-Navigation">';
	$context .= '<a href="' . esc_url( $home_url ) . '">Startseite</a> ';
	$context .= '<a href="' . esc_url( leadwerk_theme_page_url( 'kraft-sortiment', $home_url ) ) . '">Sortiment</a> ';
	$context .= '<a href="' . esc_url( leadwerk_theme_page_url( 'kraft-service', $home_url ) ) . '">Service</a> ';
	$context .= '<a href="' . esc_url( leadwerk_theme_page_url( 'kraft-unternehmen', $home_url ) ) . '">Unternehmen</a> ';
	$context .= '<a href="https://www.google.com/maps/dir/?api=1&amp;destination=48.9952335%2C8.5364113&amp;travelmode=driving">Route zur Ausstellung</a>';
	$context .= '</nav></footer>';

	return $context . $content;
}

/**
 * Give Yoast's server-side image/content parser the rendered Leadwerk content.
 *
 * @param string       $content Stored post content.
 * @param WP_Post|null $post    Current post.
 * @return string
 */
function leadwerk_theme_yoast_analysis_content_filter( $content, $post = null ) {
	$post_id = $post instanceof WP_Post ? (int) $post->ID : 0;
	$rendered = leadwerk_theme_get_yoast_analysis_content( $post_id );
	return '' !== $rendered ? $rendered : $content;
}
add_filter( 'wpseo_pre_analysis_post_content', 'leadwerk_theme_yoast_analysis_content_filter', 10, 2 );

/**
 * Load the Yoast content bridge only for imported Leadwerk page editors.
 *
 * @param string $hook_suffix Current admin screen hook.
 * @return void
 */
function leadwerk_theme_enqueue_yoast_analysis_bridge( $hook_suffix ) {
	if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) || ! defined( 'WPSEO_VERSION' ) ) {
		return;
	}

	$post_id = isset( $_GET['post'] ) ? absint( wp_unslash( $_GET['post'] ) ) : 0;
	$content = leadwerk_theme_get_yoast_analysis_content( $post_id );
	if ( '' === $content ) {
		return;
	}

	wp_enqueue_script(
		'leadwerk-yoast-analysis',
		LEADWERK_THEME_URI . '/assets/yoast-analysis.js',
		array( 'jquery' ),
		LEADWERK_THEME_VERSION,
		true
	);
	wp_localize_script(
		'leadwerk-yoast-analysis',
		'leadwerkYoastAnalysis',
		array(
			'content' => $content,
		)
	);
}
add_action( 'admin_enqueue_scripts', 'leadwerk_theme_enqueue_yoast_analysis_bridge', 99 );
