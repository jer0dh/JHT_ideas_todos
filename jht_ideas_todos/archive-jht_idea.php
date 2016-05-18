<?php


add_action( 'the_post' , 'jht_idea_post');

function jht_idea_post() {
    echo 'testing';
}

// return control of output to template

require( get_template_directory() . '/index.php');