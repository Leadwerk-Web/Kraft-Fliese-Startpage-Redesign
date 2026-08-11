<?php
/**
 * Standalone deployment verifier for the Kraft Fliesen WordPress import stack.
 *
 * Usage: php scripts/verify-kraft-import.php
 */

declare(strict_types=1);

$root = dirname( __DIR__ );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', $root . '/' );
}

// Minimal WordPress-compatible stubs used by the parser in standalone mode.
if ( ! function_exists( 'sanitize_key' ) ) {
	function sanitize_key( $value ) { return trim( preg_replace( '/[^a-z0-9_\-]/', '', strtolower( (string) $value ) ), '-' ); }
}
if ( ! function_exists( 'sanitize_text_field' ) ) {
	function sanitize_text_field( $value ) { return trim( strip_tags( (string) $value ) ); }
}
if ( ! function_exists( 'wp_unslash' ) ) {
	function wp_unslash( $value ) { return $value; }
}
if ( ! function_exists( 'wp_kses_post' ) ) {
	function wp_kses_post( $value ) { return (string) $value; }
}
if ( ! function_exists( 'esc_url_raw' ) ) {
	function esc_url_raw( $value, $protocols = null ) { return filter_var( (string) $value, FILTER_SANITIZE_URL ); }
}
if ( ! function_exists( 'wp_basename' ) ) {
	function wp_basename( $value ) { return basename( (string) $value ); }
}
if ( ! function_exists( 'absint' ) ) {
	function absint( $value ) { return abs( (int) $value ); }
}
if ( ! function_exists( 'wp_strip_all_tags' ) ) {
	function wp_strip_all_tags( $value ) { return strip_tags( (string) $value ); }
}
if ( ! function_exists( '__' ) ) {
	function __( $value, $domain = null ) { return (string) $value; }
}

class WP_Error {
	private $message;
	public function __construct( $code, $message ) { $this->message = (string) $message; }
	public function get_error_message() { return $this->message; }
}
function is_wp_error( $value ) { return $value instanceof WP_Error; }

require_once $root . '/leadwerk-fields/includes/class-leadwerk-content-schema.php';
require_once $root . '/leadwerk_importer/includes/class-leadwerk-static-parser.php';

$errors   = array();
$warnings = array();
$summary  = array();

$manifest_path = $root . '/leadwerk_importer/manifest/mapping.json';
$manifest      = json_decode( (string) file_get_contents( $manifest_path ), true );
if ( ! is_array( $manifest ) || empty( $manifest['pages'] ) ) {
	$errors[] = 'Importer mapping.json is invalid or contains no pages.';
}

$source_root = $root . '/leadwerk_importer/source_assets/';
$source_keys = array();
$source_files = array();
$focus_keyphrases = array();
foreach ( (array) ( $manifest['pages'] ?? array() ) as $page ) {
	$key  = (string) ( $page['source_key'] ?? '' );
	$file = (string) ( $page['source_file'] ?? '' );
	$seo  = (array) ( $page['seo'] ?? array() );
	$source_keys[]  = $key;
	$source_files[] = $file;
	$focus_keyphrase = trim( (string) ( $seo['focus_keyphrase'] ?? '' ) );
	$seo_title       = trim( (string) ( $seo['title'] ?? '' ) );
	$meta_description = trim( (string) ( $seo['meta_description'] ?? '' ) );
	if ( '' === $focus_keyphrase || '' === $seo_title || '' === $meta_description ) {
		$errors[] = "Missing Yoast SEO mapping for {$file}.";
	} else {
		$focus_keyphrases[] = mb_strtolower( $focus_keyphrase );
		if ( 0 !== mb_stripos( $seo_title, $focus_keyphrase ) ) {
			$errors[] = "SEO title does not begin with its focus keyphrase in {$file}.";
		}
		if ( false === mb_stripos( $meta_description, $focus_keyphrase ) ) {
			$errors[] = "Meta description does not contain its focus keyphrase in {$file}.";
		}
	}
	$path = $source_root . $file;
	if ( ! is_file( $path ) ) {
		$errors[] = "Missing mapped HTML: {$file}";
		continue;
	}
	$parser = new Leadwerk_Static_Parser( $key, $file );
	$result = $parser->parse_file( $path );
	if ( is_wp_error( $result ) ) {
		$errors[] = "Parser failed for {$file}: " . $result->get_error_message();
		continue;
	}
	if ( preg_match( '~<nav[^>]+main-nav|<footer[^>]+footer|<script~i', (string) $result['template_html'] ) ) {
		$errors[] = "Shared chrome was not removed from {$file}.";
	}
	$fields = (array) $result['fields'];
	$keys   = array();
	foreach ( array( 'text_items', 'link_items', 'media_items' ) as $bucket ) {
		foreach ( (array) ( $fields[ $bucket ] ?? array() ) as $row ) {
			$field_key = (string) ( $row['key'] ?? '' );
			if ( '' === $field_key || isset( $keys[ $field_key ] ) ) {
				$errors[] = "Missing/duplicate field key in {$file}: {$field_key}";
			}
			$keys[ $field_key ] = true;
			if ( 'media_items' === $bucket ) {
				$media_path = $source_root . ltrim( (string) ( $row['source_path'] ?? '' ), '/' );
				if ( ! is_file( $media_path ) ) {
					$errors[] = "Missing field media in {$file}: " . (string) ( $row['source_path'] ?? '' );
				}
			}
		}
	}
	$summary[ $file ] = array(
		'text'  => count( (array) ( $fields['text_items'] ?? array() ) ),
		'links' => count( (array) ( $fields['link_items'] ?? array() ) ),
		'media' => count( (array) ( $fields['media_items'] ?? array() ) ),
	);
	if ( 0 === $summary[ $file ]['text'] ) {
		$errors[] = "No editable text fields generated for {$file}.";
	}
}

if ( count( $source_keys ) !== count( array_unique( $source_keys ) ) ) {
	$errors[] = 'Duplicate source_key values in mapping.json.';
}
if ( count( $source_files ) !== count( array_unique( $source_files ) ) ) {
	$errors[] = 'Duplicate source_file values in mapping.json.';
}
if ( count( $focus_keyphrases ) !== count( array_unique( $focus_keyphrases ) ) ) {
	$errors[] = 'Duplicate Yoast focus keyphrases in mapping.json.';
}

// Static HTML duplicate IDs and local file/fragment links.
foreach ( glob( $root . '/*.html' ) as $html_file ) {
	$html = (string) file_get_contents( $html_file );
	$dom  = new DOMDocument( '1.0', 'UTF-8' );
	$old  = libxml_use_internal_errors( true );
	$dom->loadHTML( '<?xml encoding="UTF-8">' . $html, LIBXML_NONET );
	libxml_clear_errors();
	libxml_use_internal_errors( $old );
	$xpath = new DOMXPath( $dom );
	$ids   = array();
	foreach ( $xpath->query( '//*[@id]' ) as $node ) {
		$id = (string) $node->getAttribute( 'id' );
		if ( isset( $ids[ $id ] ) ) {
			$errors[] = 'Duplicate HTML id in ' . basename( $html_file ) . ': ' . $id;
		}
		$ids[ $id ] = true;
	}
	foreach ( $xpath->query( '//a[@href]' ) as $node ) {
		$href = html_entity_decode( trim( (string) $node->getAttribute( 'href' ) ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );
		if ( '' === $href || '#' === $href || preg_match( '~^(?:https?:)?//|^(?:mailto|tel):~i', $href ) ) {
			continue;
		}
		$parts = parse_url( $href );
		$path  = (string) ( $parts['path'] ?? '' );
		$hash  = (string) ( $parts['fragment'] ?? '' );
		$target_file = '' === $path ? $html_file : $root . '/' . ltrim( $path, './' );
		if ( '' !== $path && ! is_file( $target_file ) ) {
			$errors[] = 'Broken local HTML link in ' . basename( $html_file ) . ': ' . $href;
			continue;
		}
		if ( '' !== $hash && is_file( $target_file ) ) {
			$target_html = (string) file_get_contents( $target_file );
			if ( ! preg_match( '~\bid=["\']' . preg_quote( $hash, '~' ) . '["\']~i', $target_html ) ) {
				$errors[] = 'Missing local fragment target in ' . basename( $html_file ) . ': ' . $href;
			}
		}
	}
}

// Root/static parity for canonical import files.
foreach ( $source_files as $file ) {
	$root_file   = $root . '/' . $file;
	$source_file = $source_root . $file;
	if ( is_file( $root_file ) && is_file( $source_file ) && hash_file( 'sha256', $root_file ) !== hash_file( 'sha256', $source_file ) ) {
		$errors[] = "Root/import source drift: {$file}";
	}
}

// No references to deleted raster originals may remain in web/PHP sources.
$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root, FilesystemIterator::SKIP_DOTS ) );
foreach ( $iterator as $file ) {
	if ( ! $file instanceof SplFileInfo || ! $file->isFile() ) {
		continue;
	}
	$path = str_replace( '\\', '/', $file->getPathname() );
	if ( false !== strpos( $path, '/.git/' ) || ! preg_match( '/\.(?:html|css|js|php|json)$/i', $path ) ) {
		continue;
	}
	$content = (string) file_get_contents( $path );
	if ( preg_match( '~(?:src|href|url\(|source_path["\']?\s*[:=])[^\n>]*\.(?:png|jpe?g)(?:["\')?#]|$)~i', $content, $match ) ) {
		$errors[] = 'Deleted raster reference in ' . substr( $path, strlen( $root ) + 1 ) . ': ' . trim( $match[0] );
	}
}

// WPForms structure must match the current native export/import shape.
$form_path = $root . '/wpforms-kraft-fliesen-kontakt.json';
$forms     = json_decode( (string) file_get_contents( $form_path ), true );
$form      = is_array( $forms ) ? ( $forms[0] ?? array() ) : array();
if ( empty( $form['fields'] ) || empty( $form['settings']['form_title'] ) ) {
	$errors[] = 'WPForms JSON is missing fields or settings.form_title.';
}
if ( 'redirect' !== (string) ( $form['settings']['confirmations']['1']['type'] ?? '' ) ) {
	$errors[] = 'WPForms confirmation is not configured as a redirect.';
}

// Theme runtime copies must stay in sync with canonical root assets.
foreach ( array( 'styles.css', 'script.js' ) as $file ) {
	$theme_file = $root . '/leadwerk_theme/assets/' . $file;
	if ( ! is_file( $theme_file ) || hash_file( 'sha256', $root . '/' . $file ) !== hash_file( 'sha256', $theme_file ) ) {
		$errors[] = "Theme asset drift: {$file}";
	}
}

foreach ( $summary as $file => $counts ) {
	printf( "[OK] %-20s %3d text | %3d links | %2d media\n", $file, $counts['text'], $counts['links'], $counts['media'] );
}
foreach ( $warnings as $warning ) {
	fwrite( STDERR, "[WARN] {$warning}\n" );
}
foreach ( $errors as $error ) {
	fwrite( STDERR, "[ERROR] {$error}\n" );
}

printf( "\nPages: %d | Errors: %d | Warnings: %d\n", count( $summary ), count( $errors ), count( $warnings ) );
exit( $errors ? 1 : 0 );
