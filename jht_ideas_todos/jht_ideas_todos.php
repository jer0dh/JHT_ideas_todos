<?php
//* Start the engine
/*
Plugin Name: jht_ideas_todos
Plugin URI: http://jhtechservices.com
Description: Adds ideasModel and todos to Wordpress
Author: Jerod Hammerstein
Version: 0.1
Author URI: http://jhtechservices.com
*/
if ( ! defined( 'ABSPATH' ) ) {
	exit;
} // Exit if accessed directly


class jhtIdeasTodos {
    private $excerpt_limit = 80;
	
	public function __construct() {
		
		add_action('init', array( $this, 'create_idea_type') );
		add_filter( 'manage_jht_idea_posts_columns', array( $this, 'jht_idea_table_head' ) );
		add_action( 'manage_jht_idea_posts_custom_column', array( $this, 'jht_idea_table_custom_column' ), 10, 2);

        // Add a postie filter
        add_filter( 'postie_post_before', array( $this, 'jht_idea_postie_filter') );

        // Add shortcode
        add_shortcode( 'jht_ideas_app', array( $this, 'jht_idea_ajax_app') );
        // Add an archive template for jht_idea post-type
        //add_filter( 'archive_template', array( $this, 'get_archive_template' ) ) ;

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue'));


	}

	public function enqueue() {

		//https://mikejolley.com/2013/12/02/sensible-script-enqueuing-shortcodes/
		wp_register_script('jhtscripts', plugins_url( '/js/dist/app/app.js', __FILE__), array('jquery'),'1.0.0',true);
		
	//	wp_enqueue_style('modaalcss', plugins_url( '/css/modaal.min.css', __FILE__));
 
	}
	public function create_idea_type() {
		register_post_type( 'jht_idea',
			array(
				'labels' => array(
					'name' => __('Ideas', 'jhtIdeasTodos'),
					'singular_name' => __('Idea', 'jhtIdeasTodos'),
					'add_new'             => __( 'Add New', 'jhtIdeasTodos' ),
					'add_new_item'        => __( 'Add New Idea', 'jhtIdeasTodos' ),
					'edit_item'           => __( 'Edit Idea', 'jhtIdeasTodos' ),
					'new_item'            => __( 'New Idea', 'jhtIdeasTodos' ),
					'all_items'           => __( 'All Ideas', 'jhtIdeasTodos' ),
					'view_item'           => __( 'View Idea', 'jhtIdeasTodos' ),
					'search_items'        => __( 'Search Ideas', 'jhtIdeasTodos' ),
					'not_found'           => __( 'No ideasModel found', 'jhtIdeasTodos' ),
					'not_found_in_trash'  => __( 'No ideasModel found in Trash', 'jhtIdeasTodos' ),
					'menu_name'           => __( 'Ideas', 'jhtIdeasTodos' ),
					
				),
				'supports' => array('title', 'editor', 'excerpt'),
				'public' => true,
				'show_ui'       => true,
				'has_archive' => true,
				'rewrite'       => array( 'slug' => 'ideasModel'),
				'description' => 'Possibilities',
				'exclude_from_search' => true,
				'menu_icon' => 'dashicons-lightbulb'
			));
		
		register_taxonomy( 'jht_idea_category', 'jht_idea', array(
			'labels' => array(
				'name'                       => __('Categories', 'jhtIdeasTodos' ),
				'singular_name'              => __('Category', 'jhtIdeasTodos' ),
				'menu_name'                  => __('Categories', 'jhtIdeasTodos' ),
				'search_items'               => __( 'Search Categories', 'jhtIdeasTodos' ),
				'popular_items'              => __( 'Popular Categories' , 'jhtIdeasTodos' ),
				'all_items'                  => __( 'All Categories' , 'jhtIdeasTodos' ),
				'parent_item'                => null,
				'parent_item_colon'          => null,
				'edit_item'                  => __( 'Edit Categories' , 'jhtIdeasTodos' ),
				'update_item'                => __( 'Update Categories' , 'jhtIdeasTodos' ),
				'add_new_item'               => __( 'Add New Category' , 'jhtIdeasTodos' ),
				'new_item_name'              => __( 'New Category Name' , 'jhtIdeasTodos' ),
				'separate_items_with_commas' => __( 'Separate categories with commas' , 'jhtIdeasTodos' ),
				'add_or_remove_items'        => __( 'Add or remove categories' , 'jhtIdeasTodos' ),
			),
			'hierarchical'   => false,
			'show_ui'       => true,
			'rewrite'       => array( 'slug' => 'ideaCat'),
			'update_count_callback' => '_update_post_term_count',
		));
	}

	/**
	 * Add and reorder columns
	 * @param $defaults
	 * @return array
	 */
	public function jht_idea_table_head( $defaults ) {
		$new = array();
		foreach( $defaults as $key => $title ) {
			if ($key === 'date') {
				$new['excerpt'] = __('Excerpt','jhtIdeasTodos' );
				$new['taxonomy-jht_idea_category']  = __('Categories', 'jhtIdeasTodos' );
			}
			$new[$key] = $title;
		}

		return $new;
	}
	
	public function jht_idea_table_custom_column( $column_name, $id) {


		if ($column_name === 'excerpt') {
            $title = get_the_title($id);
			$excerpt = substr(apply_filters('the_excerpt', get_post_field('post_excerpt', $id)), 0, $this->excerpt_limit);

			if (empty($excerpt)) {
				$my_post = get_post( $id );
				$content = $my_post->post_content;
				$content = apply_filters( 'the_content', $content);
				$excerpt = substr(wp_strip_all_tags($content), 0, $this->excerpt_limit);
				
			}
            if (substr($excerpt,0,30) === substr($title,0,30)) {
                $excerpt = '';
            }
            echo $excerpt;
		}

	}

    public function jht_idea_postie_filter($email) {


        $content = trim(strip_tags($email['post_content']));
        $email['post_type'] = 'jht_idea';

        $title = trim(strip_tags($email['post_title']));
        if (strpos($title, 'Live') !== false ) {
            if(strlen($content)>90){
                $email['post_title'] = substr($content,0,$this->excerpt_limit) . "...";
                $email['post_content'] = $content;
            } else {
                $email['post_title'] = $content;
            }
        } else {
            $email['post_title'] = $title;
            $email['post_content'] = $content;
        }

        $email['post_name'] = sanitize_title($email['post_title']);
        return $email;

    }

    /**
     * Load plugins archive template for custom post type jht_idea
     * May or may not use: seems to be very theme oriented.  Maybe instead apply most of the functions for AJAX calls
     * here but have a theme template
     * @param $archive_template
     * @return string
     */
    public function get_archive_template($archive_template) {

        global $post;
        if ($post->post_type == 'jht_idea') {
            $archive_template = dirname( __FILE__ ) . '/archive-jht_idea.php';
        }
        return $archive_template;
    }

    public function jht_idea_ajax_app($atts, $content=null) {

        $posts_per_page = 20;
        $paged = 1;

        $query = new WP_Query(array(
            'post_type'         => 'jht_idea',
            'paged'             =>  $paged,
            'posts_per_page'    =>  $posts_per_page
        ));
        $return = array();
        $fields = array('post_title', 'ID');
        $posts = $query->get_posts();
        foreach($posts as $post) {
            $newPost = array();
            foreach($fields as $field) {
                $newPost[$field] = $post->$field;
            }
            $return[] = $newPost;
        }
/* 
        foreach( $posts as $key => $value) {
            if(in_array($key, $fields)) {
                $return[$key] = $value;
            }
        }*/



        wp_localize_script(
            'jhtscripts',
            'jhtIdeas',
            array(
                'ajax_url'          =>      admin_url( 'admin-ajax.php' ),
                'actions'           =>      array(
                                                    'create'    =>  'create_jht_idea',
                                                    'read'      =>  'read_jht_idea',
                                                    'update'    =>  'update_jht_idea',
                                                    'delete'    =>  'delete_jht_idea',
                                            ),
                '_ajax_nonce'       =>      wp_create_nonce( 'jht_ideas' ),
                'posts'             =>      $return
            ));
        wp_enqueue_script('jhtscripts');
		$output = '<div id="jhtMain"></div>';
		return $output;

    }


	/**
	 * Activate Plugin
	 */
	public static function activate()
	{
		// Do nothing
	} // END public static function activate

	/**
	 * Deactivate the plugin
	 */
	public static function deactivate()
	{
		// Do nothing
	} // END public static function deactivate
}

if(class_exists('jhtIdeasTodos')) {
	register_activation_hook(__FILE__, array( 'jhtIdeasTodos', 'activate' ));
	register_deactivation_hook(__FILE__, array( 'jhtIdeasTodos', 'deactivate'));




	$jhtIdeasTodos = new jhtIdeasTodos();
}
