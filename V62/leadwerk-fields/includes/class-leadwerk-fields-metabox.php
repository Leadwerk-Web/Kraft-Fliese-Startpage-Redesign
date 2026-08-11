<?php
/**
 * ACF-like editing UI for every imported Kraft Fliesen text, link and image.
 *
 * @package Leadwerk_Fields
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Leadwerk_Fields_Metabox {

	const NONCE_ACTION = 'leadwerk_fields_save_page';
	const NONCE_NAME   = 'leadwerk_fields_nonce';

	/** @return void */
	public static function init() {
		add_action( 'add_meta_boxes_page', array( __CLASS__, 'register_metabox' ) );
		add_action( 'save_post_page', array( __CLASS__, 'save_page' ), 10, 2 );
		add_action( 'admin_menu', array( __CLASS__, 'register_options_page' ) );
		add_action( 'admin_init', array( __CLASS__, 'save_options' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
		add_filter( 'use_block_editor_for_post', array( __CLASS__, 'disable_block_editor_for_imported_pages' ), 10, 2 );
		add_filter( 'leadwerk_sync_non_translatable_keys', array( __CLASS__, 'translation_exclusions' ) );
	}

	/** @return void */
	public static function register_metabox() {
		add_meta_box(
			'leadwerk-page-fields',
			__( 'Individuelle Seiteninhalte', 'leadwerk-fields' ),
			array( __CLASS__, 'render_metabox' ),
			'page',
			'normal',
			'high'
		);
	}

	/** @param WP_Post $post Post. @return void */
	public static function render_metabox( $post ) {
		$payload    = Leadwerk_Content_Schema::normalize_payload( get_field( Leadwerk_Content_Schema::FIELD_NAME, $post->ID ) );
		$source_key = (string) get_post_meta( $post->ID, 'leadwerk_source_key', true );
		$source     = (string) get_post_meta( $post->ID, 'leadwerk_source_file', true );
		wp_nonce_field( self::NONCE_ACTION, self::NONCE_NAME );

		echo '<div class="leadwerk-fields-app">';
		echo '<p class="description"><strong>' . esc_html__( 'Kaynak:', 'leadwerk-fields' ) . '</strong> <code>' . esc_html( $source ?: $source_key ?: '-' ) . '</code> &middot; ';
		echo esc_html__( 'Alanlar bölüm bazında gruplanır. İç linkler WordPress kalıcı bağlantılarına otomatik çevrilir; resimler Medya Kütüphanesi kimliğiyle saklanır.', 'leadwerk-fields' ) . '</p>';

		if ( empty( $payload['text_items'] ) && empty( $payload['link_items'] ) && empty( $payload['media_items'] ) ) {
			echo '<div class="notice notice-info inline"><p>' . esc_html__( 'Bu sayfada henüz içe aktarılmış alan yok. Önce Araçlar > Leadwerk Import çalıştırın.', 'leadwerk-fields' ) . '</p></div></div>';
			return;
		}

		$groups = self::group_rows( $payload );
		echo '<div class="leadwerk-field-tabs" role="tablist">';
		$tab_index = 0;
		foreach ( $groups as $group_label => $rows ) {
			printf(
				'<button type="button" class="leadwerk-field-tab%1$s" data-leadwerk-tab="%2$s">%3$s <span>%4$d</span></button>',
				0 === $tab_index ? ' is-active' : '',
				esc_attr( sanitize_title( $group_label ) ),
				esc_html( $group_label ),
				count( $rows )
			);
			++$tab_index;
		}
		echo '</div>';

		$tab_index = 0;
		foreach ( $groups as $group_label => $rows ) {
			printf( '<section class="leadwerk-field-panel%1$s" data-leadwerk-panel="%2$s">', 0 === $tab_index ? ' is-active' : '', esc_attr( sanitize_title( $group_label ) ) );
			echo '<h3>' . esc_html( $group_label ) . '</h3>';
			foreach ( $rows as $row ) {
				self::render_row( $row );
			}
			echo '</section>';
			++$tab_index;
		}
		echo '</div>';
	}

	/** @param array<string,mixed> $payload Payload. @return array<string,array<int,array<string,mixed>>> */
	private static function group_rows( $payload ) {
		$groups = array();
		foreach ( array( 'text_items', 'link_items', 'media_items' ) as $bucket ) {
			foreach ( (array) $payload[ $bucket ] as $index => $row ) {
				$group = trim( (string) ( $row['group'] ?? '' ) ) ?: __( 'Allgemein', 'leadwerk-fields' );
				$row['_bucket'] = $bucket;
				$row['_index']  = (int) $index;
				$groups[ $group ][] = $row;
			}
		}
		return $groups;
	}

	/** @param array<string,mixed> $row Row. @return void */
	private static function render_row( $row ) {
		$bucket = (string) $row['_bucket'];
		$index  = (int) $row['_index'];
		$name   = 'leadwerk_content[' . $bucket . '][' . $index . ']';
		$label  = (string) ( $row['label'] ?? $row['key'] );
		echo '<div class="leadwerk-field-row leadwerk-field-row--' . esc_attr( $bucket ) . '">';
		echo '<div class="leadwerk-field-row__head"><strong>' . esc_html( $label ) . '</strong><code>' . esc_html( (string) $row['key'] ) . '</code></div>';
		printf( '<input type="hidden" name="%1$s[key]" value="%2$s"><input type="hidden" name="%1$s[label]" value="%3$s"><input type="hidden" name="%1$s[group]" value="%4$s">', esc_attr( $name ), esc_attr( (string) $row['key'] ), esc_attr( $label ), esc_attr( (string) $row['group'] ) );

		if ( 'text_items' === $bucket ) {
			printf( '<textarea class="widefat leadwerk-rich-field" rows="4" name="%1$s[content]">%2$s</textarea>', esc_attr( $name ), esc_textarea( (string) $row['content'] ) );
		} elseif ( 'link_items' === $bucket ) {
			printf( '<input class="widefat" type="text" name="%1$s[href]" value="%2$s"><p class="description">%3$s</p>', esc_attr( $name ), esc_attr( (string) $row['href'] ), esc_html__( 'İç sayfa için “service.html”, “/service/” veya “#kontakt” kullanabilirsin; tema doğru WordPress URL’sini üretir.', 'leadwerk-fields' ) );
		} else {
			$id      = absint( $row['attachment_id'] ?? 0 );
			$preview = $id ? wp_get_attachment_image_url( $id, 'medium' ) : '';
			printf( '<input type="hidden" name="%1$s[kind]" value="%2$s"><input type="hidden" name="%1$s[source_path]" value="%3$s">', esc_attr( $name ), esc_attr( (string) $row['kind'] ), esc_attr( (string) $row['source_path'] ) );
			echo '<div class="leadwerk-media-field">';
			printf( '<input class="leadwerk-media-id" type="hidden" name="%1$s[attachment_id]" value="%2$d">', esc_attr( $name ), $id );
			printf( '<div class="leadwerk-media-preview">%s</div>', $preview ? '<img src="' . esc_url( $preview ) . '" alt="">' : '<span>' . esc_html__( 'Kein Bild gewählt', 'leadwerk-fields' ) . '</span>' );
			echo '<p><button type="button" class="button leadwerk-media-select">' . esc_html__( 'Bild wählen/ändern', 'leadwerk-fields' ) . '</button> <button type="button" class="button-link-delete leadwerk-media-remove">' . esc_html__( 'Entfernen', 'leadwerk-fields' ) . '</button></p></div>';
			printf( '<label>%1$s<input class="widefat" type="text" name="%2$s[alt]" value="%3$s"></label>', esc_html__( 'Alternativtext', 'leadwerk-fields' ), esc_attr( $name ), esc_attr( (string) $row['alt'] ) );
			echo '<p class="description"><code>' . esc_html( (string) $row['source_path'] ) . '</code> &middot; ' . esc_html( 'background' === $row['kind'] ? __( 'Arkaplan görseli', 'leadwerk-fields' ) : __( 'İçerik görseli', 'leadwerk-fields' ) ) . '</p>';
		}
		echo '</div>';
	}

	/** @param int $post_id Post ID. @param WP_Post $post Post. @return void */
	public static function save_page( $post_id, $post ) {
		if ( ! isset( $_POST[ self::NONCE_NAME ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE_NAME ] ) ), self::NONCE_ACTION ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) || ! $post instanceof WP_Post || 'page' !== $post->post_type ) {
			return;
		}
		$raw = isset( $_POST['leadwerk_content'] ) && is_array( $_POST['leadwerk_content'] ) ? wp_unslash( $_POST['leadwerk_content'] ) : array();
		$raw['schema_version'] = Leadwerk_Content_Schema::VERSION;
		update_field( Leadwerk_Content_Schema::FIELD_NAME, Leadwerk_Content_Schema::normalize_payload( $raw ), $post_id );
	}

	/** @return void */
	public static function register_options_page() {
		add_options_page( __( 'Kraft Fliesen Website', 'leadwerk-fields' ), __( 'Kraft Fliesen Website', 'leadwerk-fields' ), 'manage_options', 'leadwerk-settings', array( __CLASS__, 'render_options_page' ) );
	}

	/** @return array<string,array<string,string>> */
	private static function option_fields() {
		return array(
			'company_name'       => array( 'label' => 'Firmenname', 'type' => 'text', 'default' => 'Kraft Fliesen GmbH' ),
			'company_tagline'    => array( 'label' => 'Kurzbeschreibung', 'type' => 'textarea', 'default' => 'Ihr Fliesenexperte zwischen Karlsruhe und Pforzheim. Familienunternehmen seit 1974.' ),
			'company_address'    => array( 'label' => 'Adresse', 'type' => 'textarea', 'default' => "Reetzstraße 48-52\n76327 Pfinztal-Söllingen" ),
			'company_phone'      => array( 'label' => 'Telefon (Anzeige)', 'type' => 'text', 'default' => '07240 / 7285' ),
			'company_phone_link' => array( 'label' => 'Telefon-Link', 'type' => 'text', 'default' => 'tel:072407285' ),
			'company_email'      => array( 'label' => 'E-Mail', 'type' => 'email', 'default' => 'info@kraft-fliesen.de' ),
			'opening_hours'      => array( 'label' => 'Öffnungszeiten', 'type' => 'textarea', 'default' => "Mo – Fr 07:30 – 18:00 durchgehend\nSa 08:00 – 12:00" ),
			'calendly_url'       => array( 'label' => 'Calendly URL', 'type' => 'url', 'default' => 'https://calendly.com/timkraft-hp76/beratung' ),
			'facebook_url'       => array( 'label' => 'Facebook URL', 'type' => 'url', 'default' => 'https://www.facebook.com/kraftfliesen/' ),
			'instagram_url'      => array( 'label' => 'Instagram URL', 'type' => 'url', 'default' => 'https://www.instagram.com/kraft_fliesen_gmbh/' ),
			'pinterest_url'      => array( 'label' => 'Pinterest URL', 'type' => 'url', 'default' => 'https://www.pinterest.de/kraft_fliesen_gmbh/' ),
			'wpforms_form_id_de' => array( 'label' => 'WPForms Formular-ID (DE)', 'type' => 'text', 'default' => '' ),
			'logo_dark_id'       => array( 'label' => 'Logo dunkel', 'type' => 'image', 'default' => '0' ),
			'logo_light_id'      => array( 'label' => 'Logo hell', 'type' => 'image', 'default' => '0' ),
		);
	}

	/** @return void */
	public static function render_options_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		echo '<div class="wrap"><h1>' . esc_html__( 'Kraft Fliesen Website-Einstellungen', 'leadwerk-fields' ) . '</h1><p>' . esc_html__( 'Header, Footer, Kontaktdaten und Formular-Verknüpfung werden zentral gepflegt.', 'leadwerk-fields' ) . '</p><form method="post">';
		wp_nonce_field( 'leadwerk_save_options', 'leadwerk_options_nonce' );
		echo '<input type="hidden" name="leadwerk_save_options" value="1"><table class="form-table" role="presentation">';
		foreach ( self::option_fields() as $key => $definition ) {
			$value = get_field( $key, 'option' );
			$value = null === $value || '' === $value ? $definition['default'] : $value;
			echo '<tr><th scope="row"><label for="leadwerk-opt-' . esc_attr( $key ) . '">' . esc_html( $definition['label'] ) . '</label></th><td>';
			if ( 'textarea' === $definition['type'] ) {
				printf( '<textarea class="large-text" rows="3" id="leadwerk-opt-%1$s" name="leadwerk_options[%1$s]">%2$s</textarea>', esc_attr( $key ), esc_textarea( (string) $value ) );
			} elseif ( 'image' === $definition['type'] ) {
				$id = absint( $value );
				printf( '<div class="leadwerk-media-field"><input class="leadwerk-media-id" type="hidden" id="leadwerk-opt-%1$s" name="leadwerk_options[%1$s]" value="%2$d"><div class="leadwerk-media-preview">%3$s</div><p><button type="button" class="button leadwerk-media-select">%4$s</button> <button type="button" class="button-link-delete leadwerk-media-remove">%5$s</button></p></div>', esc_attr( $key ), $id, $id ? wp_get_attachment_image( $id, 'medium' ) : '<span>–</span>', esc_html__( 'Bild wählen', 'leadwerk-fields' ), esc_html__( 'Entfernen', 'leadwerk-fields' ) );
			} else {
				printf( '<input class="regular-text" type="%1$s" id="leadwerk-opt-%2$s" name="leadwerk_options[%2$s]" value="%3$s">', esc_attr( $definition['type'] ), esc_attr( $key ), esc_attr( (string) $value ) );
			}
			echo '</td></tr>';
		}
		echo '</table>'; submit_button(); echo '</form></div>';
	}

	/** @return void */
	public static function save_options() {
		if ( empty( $_POST['leadwerk_save_options'] ) ) {
			return;
		}
		if ( ! current_user_can( 'manage_options' ) || ! isset( $_POST['leadwerk_options_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['leadwerk_options_nonce'] ) ), 'leadwerk_save_options' ) ) {
			return;
		}
		$values = isset( $_POST['leadwerk_options'] ) && is_array( $_POST['leadwerk_options'] ) ? wp_unslash( $_POST['leadwerk_options'] ) : array();
		foreach ( self::option_fields() as $key => $definition ) {
			$value = $values[ $key ] ?? '';
			if ( 'image' === $definition['type'] ) {
				$value = absint( $value );
			} elseif ( 'email' === $definition['type'] ) {
				$value = sanitize_email( $value );
			} elseif ( 'url' === $definition['type'] ) {
				$value = esc_url_raw( $value );
			} elseif ( 'textarea' === $definition['type'] ) {
				$value = sanitize_textarea_field( $value );
			} else {
				$value = sanitize_text_field( $value );
			}
			update_field( $key, $value, 'option' );
		}
		add_settings_error( 'leadwerk-settings', 'saved', __( 'Einstellungen gespeichert.', 'leadwerk-fields' ), 'success' );
	}

	/** @param string $hook Hook. @return void */
	public static function enqueue_assets( $hook ) {
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php', 'settings_page_leadwerk-settings' ), true ) ) {
			return;
		}
		wp_enqueue_media();
		wp_enqueue_style( 'leadwerk-fields-admin', LEADWERK_FIELDS_URL . 'assets/admin-fields.css', array(), LEADWERK_FIELDS_VERSION );
		wp_enqueue_script( 'leadwerk-fields-admin', LEADWERK_FIELDS_URL . 'assets/admin-fields.js', array(), LEADWERK_FIELDS_VERSION, true );
	}

	/** @param bool $use Whether. @param WP_Post $post Post. @return bool */
	public static function disable_block_editor_for_imported_pages( $use, $post ) {
		return $post instanceof WP_Post && 'page' === $post->post_type && get_post_meta( $post->ID, 'leadwerk_source_key', true ) ? false : $use;
	}

	/** @param array<int,string> $keys Keys. @return array<int,string> */
	public static function translation_exclusions( $keys ) {
		return array_values( array_unique( array_merge( (array) $keys, array( 'key', 'label', 'group', 'kind', 'source_path', 'href' ) ) ) );
	}
}

