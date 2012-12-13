<?php
// $Id: views-cloud-summary-style.tpl.php,v 1.2 2008/09/15 23:02:37 eaton Exp $
/**
 * @file views-cloud-summary-style.tpl.php
 * View template to display a list summaries as a weighted cloud
 *
 * - $rows contains a nested array of rows. Each row contains an array of
 *   columns.
 *
 * @ingroup views_templates
 */
?>
<div class="views-cloud">
  <ul>
  <?php foreach ($rows as $row): ?>
    <li class="views-cloud-size-<?php print $row->cloud_size; ?>">
      <a href="<?php print $row->url; ?>"><?php print $row->link; ?></a>
      <?php if (!empty($options['count'])): ?>
        <span class="views-cloud-count">(<?php print $row->count?>)</span>
      <?php endif; ?>
    </li>
  <?php endforeach; ?>
  </ul>
</div>
