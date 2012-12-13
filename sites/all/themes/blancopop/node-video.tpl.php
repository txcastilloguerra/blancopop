<?php
// $Id: node.tpl.php,v 1.4 2008/09/15 08:11:49 johnalbin Exp $

/**
 * @file node.tpl.php
 *
 * Theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: Node body or teaser depending on $teaser flag.
 * - $picture: The authors picture of the node output from
 *   theme_user_picture().
 * - $date: Formatted creation date (use $created to reformat with
 *   format_date()).
 * - $links: Themed links like "Read more", "Add new comment", etc. output
 *   from theme_links().
 * - $name: Themed username of node author output from theme_user().
 * - $node_url: Direct url of the current node.
 * - $terms: the themed list of taxonomy term links output from theme_links().
 * - $submitted: themed submission information output from
 *   theme_node_submitted().
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $teaser: Flag for the teaser state.
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 */
if($teaser){
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes." ".$seccion;?>"><div class="node-inner">
   <div class="cover"><?=$node->field_video_thumb[0]['view']?></div>
    <h2 class="title">
      <?php print $title; ?>
    </h2>
    <div class="subtitulo"><?=$node->field_subtitulo[0]['value'] ?></div>
    <div class="autor"><?=$node->name?></div>
    
  <?php if ($unpublished): ?>
    <div class="unpublished"><?php print t('Unpublished'); ?></div>
  <?php endif; ?>

</div></div> <!-- /node-inner, /node -->
<?
}else{
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>"><div class="node-inner">
  <div id="share">
   <div id="share_wrapper">
   <a id="twitter" rel="nofollow" target="_blank" href="<?= 'http://twitter.com/share?text=' . str_replace('|', '', $title) . '&url=' . "http://www.blancopop.com".$node_url ?>"><span>Twitter</span></a>
   <a rel="nofollow" id="facebook" target="_blank"
       href="javascript:window.location='<?= rawurlencode('http://www.facebook.com/share.php?u='. "http://www.blancopop.com".$node_url . '&amp;t=' . $title)?>';" title="Facebook"><span>Facebook</span></a>
       <span class="cmprten">comparte en:</span>
   </div>
   </div>
  <?php if (!$page): ?>
    <h2 class="title">
      <a href="<?php print $node_url; ?>" title="<?php print $title ?>"><?php print $title; ?></a>
    </h2>
  <?php endif; ?>
  <h2 class="title">
    <?php print $title; ?>
  </h2>
  <?php if ($unpublished): ?>
    <div class="unpublished"><?php print t('Unpublished'); ?></div>
  <?php endif; ?>

  <?php if ($submitted or $terms): ?>
    <div class="meta">
      <?php if ($submitted): ?>
        <div class="submitted">
          <?php print $submitted; ?>
        </div>
      <?php endif; ?>
   <?= $portada ?>

      <?php if ($terms && !$page): ?>
        <div class="terms terms-inline"><?php print t(' en ') . $terms; ?></div>
      <?php endif; ?>
    </div>
  <?php endif; ?>

  <div class="content">
    <?php 
    if ($page) {
      print SWF($field_video[0]['filepath'], array(
        'flashvars' => array('image' => $node->field_video_thumb[0]['filename'])
        )
      );
    }
    print $content;
    ?>
    
    <?php 
    $crels = $node->field_relaciones_vid;
    echo '<div class="relaitionships clearfix">';
    foreach($crels as $crel){
      $deta = node_load($crel['nid']);
      echo '<div class="drels">';
      echo '<span class="drel_tipo">';
      print_r($deta->type);
      echo '</span>';
      print_r($crel['view']);
      echo '</div>';
    }
    echo '</div>'; 
    ?>
         
    <script type="text/javascript">
    $(document).ready(function(){
      $('#page').addClass('page-seccion-video');
    });
    </script>
  </div>
  
  <a href="javascript:history.go(-1);" class="back_home video">&laquo; regresar</a>
  
  <?php print $links; ?>

</div></div> <!-- /node-inner, /node -->
<?
}
?>