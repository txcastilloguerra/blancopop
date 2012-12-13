<?php

/**
 * A tag-cloud style view.
 */
class views_cloud_plugin_style_cloud extends views_plugin_style {
  function option_definition() {
    $options = parent::option_definition();
    $options['randomize'] = array('default' => TRUE);
    $options['weight_field'] = array('default' => NULL);
    $options['hide_weight_field'] = array('default' => TRUE);
    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $options = array();
  
    $fields = $this->display->handler->get_handlers('field');

    foreach ($fields as $field => $handler) {
      if (in_array($handler->definition['handler'], array('views_handler_field_numeric', 'views_handler_field_date'))) {
        if ($label = $handler->label()) {
          $options[$field] = $label;
        }
        else {
          $options[$field] = $handler->ui_name();
        }
      }
    }

    $form['weight_field'] = array(
      '#type' => 'select',
      '#title' => t('Cloud weight field'),
      '#required' => TRUE,
      '#description' => t('This field will be used to control the size of each row in the cloud.'),
      '#options' => $options,
      '#default_value' => $this->options['weight_field'],
    );
    
    $form['hide_weight_field'] = array(
      '#type' => 'checkbox',
      '#title' => t('Hide weight field'),
      '#description' => t('This field used to weight individual items in the view will not be output.'),
      '#default_value' => $this->options['hide_weight_field'],
    );

    $form['randomize'] = array(
      '#type' => 'checkbox',
      '#title' => t('Randomize the order of items'),
      '#description' => t("This setting respects the View's sort order when limiting large paged lists, but shuffles each list of items when displayed on the page."),
      '#default_value' => $this->options['randomize'],
    );  
  
  }
}
