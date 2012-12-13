<?php

/**
 * A tag-cloud summary style view.
 */
class views_cloud_plugin_summary_style_cloud extends views_plugin_style_summary {
  function option_definition() {
    $options = parent::option_definition();
    $options['randomize'] = array('default' => TRUE);
    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['randomize'] = array(
      '#type' => 'checkbox',
      '#title' => t('Randomize the order of items'),
      '#description' => t("This setting respects the View's sort order when limiting large paged lists, but shuffles each list of items when displayed on the page."),
      '#default_value' => $this->options['randomize'],
    );  
  
  }
}
