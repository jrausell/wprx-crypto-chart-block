<?php

/**
 * Plugin Name:       Crypto Chart Block
 * Description:       Add simple Crypto Charts in pages/post for a Cryptocurrency against USD
 * Author:            Jorge Rausell
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           1.0
 * Text Domain:       crypto-chart-block
 */

 /**
  * Textdomain for localization
  */
function crypto_chart_block_init()
{
    load_plugin_textdomain('crypto-chart-block', false, dirname(plugin_basename(__FILE__)) . '/languages');
    load_plugin_textdomain('crypto-chart-block-settings', false, dirname(plugin_basename(__FILE__)) . '/languages');

    //register_block_type(__DIR__);
}
add_action('init', 'crypto_chart_block_init');


/**
 * The admin settings page
 */
function crypto_chart_block_create_admin_menu()
{
    add_menu_page(
        __('Crypto Chart Block Menu Page', 'wprx-crypto-chart'),
        __('Crypto Chart Block', 'wprx-crypto-chart'),
        'manage_options',
        'wprx-crypto-chart',
        'crypto_chart_block_menu_page_template',
        'dashicons-money-alt'
    );
}
add_action('admin_menu', 'crypto_chart_block_create_admin_menu');

function crypto_chart_block_menu_page_template()
{
    echo '<div id="wrap">';
        echo '<p>' . __('Hello world', 'crypto-chart-block-settings') . '</p>';
        echo '<div id="crypto-chart-block-settings">' . __('Crypto Chart Settings ... Loading ...', 'wprx-crypto-chart') . '</div>';
    echo '</div>';
}



function crypto_chart_block_admin_enqueue_scripts()
{
    $asset = include plugin_dir_path(__FILE__) . 'build/plugin-settings.asset.php';

    wp_enqueue_script(
        'crypto-chart-block-settings',
        plugin_dir_url(__FILE__) . 'build/plugin-settings.js',
        $asset['dependencies'],
        $asset['version'],
        wp_rand(),
        true
    );

    wp_set_script_translations(
        'crypto-chart-block-settings',
        'crypto-chart-block-settings',
        plugin_dir_path(__FILE__) . 'languages'
    );
}
add_action('admin_enqueue_scripts', 'crypto_chart_block_admin_enqueue_scripts');



