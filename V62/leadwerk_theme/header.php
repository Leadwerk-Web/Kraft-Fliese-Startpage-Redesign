<?php
/** Theme header. @package Leadwerk_Theme */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$nav = array(
	'kraft-sortiment'   => 'Sortiment',
	'kraft-warum-wir'   => 'Warum wir',
	'kraft-unternehmen' => 'Unternehmen',
	'kraft-service'     => 'Service',
	'kraft-inspiration' => 'Inspiration',
	'kraft-bewertungen' => 'Bewertungen',
);
$nav_class = '';
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><meta name="theme-color" content="#000000"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<nav class="main-nav<?php echo esc_attr( $nav_class ); ?>" id="mainNav">
	<div class="nav-container">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="nav-logo" aria-label="Kraft Fliesen Startseite"><img src="<?php echo esc_url( leadwerk_theme_logo_light() ); ?>" alt="Kraft Fliesen GmbH" class="nav-logo-img nav-logo-white"><img src="<?php echo esc_url( leadwerk_theme_logo_dark() ); ?>" alt="Kraft Fliesen GmbH" class="nav-logo-img nav-logo-black"></a>
		<button class="nav-toggle" id="navToggle" aria-label="Menü öffnen" aria-expanded="false" aria-controls="navLinks"><span></span><span></span><span></span></button>
		<ul class="nav-links" id="navLinks">
			<?php foreach ( $nav as $source_key => $label ) : ?><li><a href="<?php echo esc_url( leadwerk_theme_page_url( $source_key ) ); ?>"<?php echo leadwerk_theme_is_source( $source_key ) ? ' class="active" aria-current="page"' : ''; ?>><?php echo esc_html( $label ); ?></a></li><?php endforeach; ?>
			<li><a href="<?php echo esc_url( (string) leadwerk_theme_option( 'calendly_url', 'https://calendly.com/timkraft-hp76/beratung' ) ); ?>" target="_blank" rel="noopener noreferrer" class="nav-cta">Beratungstermin</a></li>
			<?php $language_switcher = class_exists( 'Leadwerk_Language_Switcher' ) ? Leadwerk_Language_Switcher::render( array( 'show_labels' => false ) ) : ''; ?>
			<?php if ( '' !== $language_switcher ) : ?><li class="nav-language"><?php echo $language_switcher; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></li><?php endif; ?>
		</ul>
	</div>
</nav>
