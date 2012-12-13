<?php
// $Id: views-cloud-style.tpl.php,v 1.2 2008/09/15 23:02:36 eaton Exp $
/**
 * @file views-cloud-style.tpl.php
 * Outputs a view as a weighted cloud.
 *
 * - $view: The view in use.
 * - $fields: an array of $field objects. Each one contains:
 *   - $field->content: The output of the field.
 *   - $field->raw: The raw data for the field, if it exists. This is NOT output safe.
 *   - $field->class: The safe class id to use.
 *   - $field->handler: The Views field handler object controlling this field. Do not use
 *     var_export to dump this object, as it can't handle the recursion.
 *   - $field->inline: Whether or not the field should be inline.
 *   - $field->inline_html: either div or span based on the above flag.
 *   - $field->separator: an optional separator that may appear before a field.
 * - $row: The raw result object from the query, with all data it fetched.
 *
 * @ingroup views_templates
 */
?>
<div class="views-cloud">
  <?php foreach ($rows as $row): ?>
    <div class="views-cloud-size-<?php print $row->cloud_size; ?>">
      <?php print $row->output; ?>
    </div>
  <?php endforeach; ?>
</div>
