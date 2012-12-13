// $Id: parent.js,v 1.1.2.10 2009/06/19 15:33:20 markuspetrux Exp $

(function ($) {

/**
 * Modal Frame object for parent windows.
 */
Drupal.modalFrame = Drupal.modalFrame || {
  dirtyFormsWarning: Drupal.t('Your changes will be lost if you close this popup now.'),
  options: {},
  iframe: { $container: null, $element: null },
  isOpen: false
};

/**
 * Open a modal frame.
 */
Drupal.modalFrame.open = function(options) {
  var self = this;

  // Just one modal is allowed.
  if (self.isOpen || $('#modalframe-container').size()) {
    return false;
  }

  // Build modal frame options structure.
  self.options = {
    url: options.url,
    width: options.width,
    height: options.height,
    autoFit: (options.autoFit == undefined || options.autoFit ? true : false),
    autoResize: (options.autoResize ? true : false),
    draggable: (options.draggable == undefined || options.draggable ? true : false),
    onSubmit: options.onSubmit
  };

  // Create the dialog and related DOM elements.
  self.create(options);

  // Open the dialog offscreen where we can set its size, etc.
  self.iframe.$container.dialog('option', {position: ['-999em', '-999em']}).dialog('open');

  return true;
};

/**
 * Create the modal dialog.
 */
Drupal.modalFrame.create = function() {
  var self = this;

  // Note: We use scrolling="yes" for IE as a workaround to yet another IE bug
  // where the horizontal scrollbar is always rendered no matter how wide the
  // iframe element is defined.
  self.iframe.$element = $('<iframe id="modalframe-element" name="modalframe-element"'+ ($.browser.msie ? ' scrolling="yes"' : '') +'/>');
  self.iframe.$container = $('<div id="modalframe-container"/>').append(self.iframe.$element);
  $('body').append(self.iframe.$container);

  self.iframe.$container.dialog({
    modal: true,
    autoOpen: false,
    closeOnEscape: true,
    draggable: self.options.draggable,
    resizable: false,
    title: Drupal.t('Loading...'),
    dialogClass: 'modalframe',
    open: function() {
      // Unbind the keypress handler installed by ui.dialog itself.
      // IE does not fire keypress events for some non-alphanumeric keys
      // such as the tab character. http://www.quirksmode.org/js/keys.html
      // Also, this is not necessary here because we need to deal with an
      // iframe element that contains a separate window.
      // We'll try to provide our own behavior from bindChild() method.
      $('.modalframe').unbind('keypress.ui-dialog');

      // Adjust close button features.
      $('.modalframe .ui-dialog-titlebar-close:not(.modalframe-processed)').addClass('modalframe-processed')
        .attr('href', 'javascript:void(0)')
        .attr('title', Drupal.t('Close'))
        .unbind('click').bind('click', function() { try { self.close(false); } catch(e) {}; return false; });

      // Adjust titlebar.
      if (!self.options.draggable) {
        $('.modalframe .ui-dialog-titlebar').css('cursor', 'default');
      }

      // Fix dialog position on the viewport.
      self.fixPosition($('.modalframe'), true);

      // Compute initial dialog size.
      var dialogSize = self.sanitizeSize({width: self.options.width, height: self.options.height});

      // Compute frame size and dialog position based on dialog size.
      var frameSize = $.extend({}, dialogSize);
      frameSize.height -= $('.modalframe .ui-dialog-titlebar').outerHeight(true);
      var dialogPosition = self.computeCenterPosition($('.modalframe'), dialogSize);

      // Adjust size of the iframe element and container.
      $('.modalframe').width(dialogSize.width).height(dialogSize.height);
      self.iframe.$container.width(frameSize.width).height(frameSize.height);
      self.iframe.$element.width(frameSize.width).height(frameSize.height);

      // Update the dialog size so that UI internals are aware of the change.
      self.iframe.$container.dialog('option', {width: dialogSize.width, height: dialogSize.height});

      // Hide the dialog, center it on the viewport and then fade it in with
      // the frame hidden until the child document is loaded.
      self.iframe.$element.hide();
      $('.modalframe').hide().css({top: dialogPosition.top, left: dialogPosition.left});
      $('.modalframe').fadeIn('slow', function() {
        // Load the document on hidden iframe (see bindChild method).
        self.load(self.options.url);
      });

      // Enable auto resize feature?
      if (self.options.autoResize) {
        var $window = $(window), currentWindowSize = {width: $window.width(), height: $window.height()};
        $window.bind('resize.modalframe-event', function() {
          if (self.isOpen && self.isObject(self.iframe.documentSize)) {
            var newWindowSize = {width: $window.width(), height: $window.height()};
            if (Math.abs(currentWindowSize.width - newWindowSize.width) > 5 || Math.abs(currentWindowSize.height - newWindowSize.height) > 5) {
              currentWindowSize = newWindowSize;
              self.resize(self.iframe.documentSize);
            }
          }
        });
      }

      self.isOpen = true;
    },
    beforeclose: function() {
      if (self.beforeCloseEnabled) {
        return true;
      }
      if (!self.beforeCloseIsBusy) {
        self.beforeCloseIsBusy = true;
        setTimeout(function() { self.close(false); }, 1);
      }
      return false;
    },
    close: function() {
      if (self.options.autoResize) {
        $(window).unbind('resize.modalframe-event');
      }
      $(document).unbind('keydown.modalframe-event');
      $('.modalframe .ui-dialog-titlebar-close').unbind('keydown.modalframe-event');
      self.fixPosition($('.modalframe'), false);
      try {
        self.iframe.$element.remove();
        self.iframe.$container.dialog('destroy').remove();
      } catch(e) {};
      delete self.iframe.documentSize;
      delete self.iframe.Drupal;
      delete self.iframe.$element;
      delete self.iframe.$container;
      if (self.beforeCloseEnabled) {
        delete self.beforeCloseEnabled;
      }
      if (self.beforeCloseIsBusy) {
        delete self.beforeCloseIsBusy;
      }
      self.isOpen = false;
    }
  });
};

/**
 * Load the given URL into the dialog iframe.
 */
Drupal.modalFrame.load = function(url) {
  var self = this;
  var iframe = self.iframe.$element.get(0);
  // Get the document object of the iframe window.
  // @see http://xkr.us/articles/dom/iframe-document/
  var doc = (iframe.contentWindow || iframe.contentDocument);
  if (doc.document) {
    doc = doc.document;
  }
  doc.location.replace(url);
};

/**
 * Check if the dialog can be closed.
 */
Drupal.modalFrame.canClose = function() {
  var self = this;
  if (!self.isOpen) {
    return false;
  }
  if (self.isObject(self.iframe.Drupal)) {
    // Prompt user for confirmation to close dialog if child window has
    // dirty forms.
    if (self.isObject(self.iframe.Drupal.dirtyForms)) {
      if (self.iframe.Drupal.dirtyForms.isDirty() && !confirm(self.dirtyFormsWarning)) {
        return false;
      }
      self.iframe.Drupal.dirtyForms.warning = null;
    }
    // Disable onBeforeUnload behaviors on child window.
    if (self.isObject(self.iframe.Drupal.onBeforeUnload)) {
      self.iframe.Drupal.onBeforeUnload.disable();
    }
  }
  return true;
};

/**
 * Close the modal frame.
 */
Drupal.modalFrame.close = function(args, statusMessages) {
  var self = this;

  // Check if the dialog can be closed.
  if (!self.canClose()) {
    delete self.beforeCloseIsBusy;
    return false;
  }

  // Hide and destroy the dialog.
  function closeDialog() {
    // Prevent double execution when close is requested more than once.
    if (!self.isObject(self.iframe.$container)) {
      return;
    }
    self.beforeCloseEnabled = true;
    self.iframe.$container.dialog('close');
    if ($.isFunction(self.options.onSubmit)) {
      self.options.onSubmit(args, statusMessages);
    }
  }
  if (!self.isObject(self.iframe.$element) || !self.iframe.$element.size() || !self.iframe.$element.is(':visible')) {
    closeDialog();
  }
  else {
    self.iframe.$element.fadeOut('fast', function() {
      $('.modalframe').animate({height: 'hide', opacity: 'hide'}, closeDialog);
    });
  }
  return true;
};

/**
 * Bind the child window.
 */
Drupal.modalFrame.bindChild = function(iFrameWindow, isClosing) {
  var self = this;
  var $iFrameWindow = iFrameWindow.jQuery;
  var $iFrameDocument = $iFrameWindow(iFrameWindow.document);
  self.iframe.Drupal = iFrameWindow.Drupal;

  // We are done if the child window is closing.
  if (isClosing) {
    return;
  }

  // Update the dirty forms warning on the child window.
  if (self.isObject(self.iframe.Drupal.dirtyForms)) {
    self.iframe.Drupal.dirtyForms.warning = self.dirtyFormsWarning;
  }

  // Update the dialog title with the child window title.
  $('.modalframe .ui-dialog-title').html($iFrameDocument.attr('title'));

  // Setting tabIndex makes the div focusable.
  // Setting outline to 0 prevents a border on focus in Mozilla.
  // Inspired by ui.dialog initialization code.
  $iFrameDocument.attr('tabIndex', -1).css('outline', 0);

  // Perform animation to show the iframe element.
  self.iframe.$element.fadeIn('slow', function() {
    // @todo: Watch for experience in the way we compute the size of the
    // iframed document. There are many ways to do it, and none of them
    // seem to be perfect. Note though, that the size of the iframe itself
    // may affect the size of the child document, specially on fluid layouts.
    // If you get in trouble, then I would suggest to choose a known dialog
    // size and disable the options autoFit and/or autoResize.
    self.iframe.documentSize = {width: $iFrameDocument.width(), height: $iFrameWindow('body').height() + 25};

    // Adjust modal dialog to fit the iframe content?
    if (self.options.autoFit) {
      self.resize(self.iframe.documentSize);
    }

    // Try to enhance keyboard based navigation of the modal dialog.
    // Logic inspired by the open() method in ui.dialog.js, and
    // http://wiki.codetalks.org/wiki/index.php/Docs/Keyboard_navigable_JS_widgets

    // Get a reference to the close button.
    var $closeButton = $('.modalframe .ui-dialog-titlebar-close');

    // Search tabbable elements on the iframed document to speed up related
    // keyboard events.
    // @todo: Do we need to provide a method to update these references when
    // AJAX requests update the DOM on the child document?
    var $iFrameTabbables = $iFrameWindow(':tabbable:not(form)');
    var $firstTabbable = $iFrameTabbables.filter(':first');
    var $lastTabbable = $iFrameTabbables.filter(':last');

    // Set focus to the first tabbable element in the content area or the
    // first button. If there are no tabbable elements, set focus on the
    // close button of the dialog itself.
    if (!$firstTabbable.focus().size()) {
      $iFrameDocument.focus();
    }

    // Unbind keyboard event handlers that may have been enabled previously.
    $(document).unbind('keydown.modalframe-event');
    $closeButton.unbind('keydown.modalframe-event');

    // When the focus leaves the close button, then we want to jump to the
    // first/last inner tabbable element of the child window.
    $closeButton.bind('keydown.modalframe-event', function(event) {
      if (event.keyCode && event.keyCode == $.ui.keyCode.TAB) {
        var $target = (event.shiftKey ? $lastTabbable : $firstTabbable);
        if (!$target.size()) {
          $target = $iFrameDocument;
        }
        setTimeout(function() { $target.focus(); }, 10);
        return false;
      }
    });

    // When the focus leaves the child window, then drive the focus to the
    // close button of the dialog.
    $iFrameDocument.bind('keydown.modalframe-event', function(event) {
      if (event.keyCode) {
        if (event.keyCode == $.ui.keyCode.TAB) {
          if (event.shiftKey && event.target == $firstTabbable.get(0)) {
            setTimeout(function() { $closeButton.focus(); }, 10);
            return false;
          }
          else if (!event.shiftKey && event.target == $lastTabbable.get(0)) {
            setTimeout(function() { $closeButton.focus(); }, 10);
            return false;
          }
        }
        else if (event.keyCode == $.ui.keyCode.ESCAPE) {
          setTimeout(function() { self.close(false); }, 10);
          return false;
        }
      }
    });

    // When the focus is captured by the parent document, then try
    // to drive the focus back to the first tabbable element, or the
    // close button of the dialog (default).
    $(document).bind('keydown.modalframe-event', function(event) {
      if (event.keyCode && event.keyCode == $.ui.keyCode.TAB) {
        setTimeout(function() {
          if (!$iFrameWindow(':tabbable:not(form):first').focus().size()) {
            $closeButton.focus();
          }
        }, 10);
        return false;
      }
    });
  });
};

/**
 * Unbind the child window.
 */
Drupal.modalFrame.unbindChild = function(iFrameWindow) {
  var self = this;

  // Prevent memory leaks by explicitly unbinding keyboard event handler
  // on the child document.
  iFrameWindow.jQuery(iFrameWindow.document).unbind('keydown.modalframe-event');

  // Change the modal dialog title.
  $('.modalframe .ui-dialog-title').html(Drupal.t('Please, wait...'));

  // Hide the iframe element.
  self.iframe.$element.fadeOut('fast');
};

/**
 * Check if the given variable is an object.
 */
Drupal.modalFrame.isObject = function(something) {
  return (something !== null && typeof something === 'object');
};

/**
 * Sanitize dialog size.
 */
Drupal.modalFrame.sanitizeSize = function(size) {
  var width, height;
  var $window = $(window);
  var minWidth = 300, maxWidth = parseInt($window.width() * .98);
  if (typeof size.width != 'number') {
    width = maxWidth;
  }
  else if (size.width < minWidth || size.width > maxWidth) {
    width = Math.min(maxWidth, Math.max(minWidth, size.width));
  }
  else {
    width = size.width;
  }
  var minHeight = 100, maxHeight = parseInt($window.height() * .98);
  if (typeof size.height != 'number') {
    height = maxHeight;
  }
  else if (size.height < minHeight || size.height > maxHeight) {
    height = Math.min(maxHeight, Math.max(minHeight, size.height));
  }
  else {
    height = size.height;
  }
  return {width: width, height: height};
};

/**
 * Fix the position of the modal frame.
 *
 * Possible alternative to position:'fixed' for IE6:
 * @see http://www.howtocreate.co.uk/fixedPosition.html
 */
Drupal.modalFrame.fixPosition = function($element, isOpen) {
  var $window = $(window);
  if ($.browser.msie && parseInt($.browser.version) <= 6) {
    // IE6 does not support position:'fixed'.
    // Lock the window scrollBar instead.
    if (isOpen) {
      var yPos = $window.scrollTop();
      var xPos = $window.scrollLeft();
      $window.bind('scroll.modalframe-event', function() {
        window.scrollTo(xPos, yPos);
        // Default browser action cannot be prevented here.
      });
    }
    else {
      $window.unbind('scroll.modalframe-event');
    }
  }
  else {
    // Use CSS to do it on other browsers.
    if (isOpen) {
      var offset = $element.offset();
      $element.css({
        left: (offset.left - $window.scrollLeft()),
        top: (offset.top - $window.scrollTop()),
        position: 'fixed'
      });
    }
  }
};

/**
 * Compute position to center an element with the given size.
 */
Drupal.modalFrame.computeCenterPosition = function($element, elementSize) {
  var $window = $(window);
  var position = {
    left: Math.max(0, parseInt(($window.width() - elementSize.width) / 2)),
    top: Math.max(0, parseInt(($window.height() - elementSize.height) / 2))
  };
  if ($element.css('position') != 'fixed') {
    var $document = $(document);
    position.left += $document.scrollLeft();
    position.top += $document.scrollTop();
  }
  return position;
};

/**
 * Resize modal frame.
 */
Drupal.modalFrame.resize = function(size) {
  var self = this;

  // Compute frame and dialog size based on requested document size.
  var maxSize = self.sanitizeSize({}), titleBarHeight = $('.modalframe .ui-dialog-titlebar').outerHeight(true);
  var frameSize = self.sanitizeSize(size), dialogSize = $.extend({}, frameSize);
  if ((dialogSize.height + titleBarHeight) <= maxSize.height) {
    dialogSize.height += titleBarHeight;
  }
  else {
    dialogSize.height = maxSize.height;
    frameSize.height = dialogSize.height - titleBarHeight;
  }

  // Compute dialog position centered on viewport.
  var dialogPosition = self.computeCenterPosition($('.modalframe'), dialogSize);

  var animationOptions = $.extend(dialogSize, dialogPosition);

  // Perform the resize animation.
  $('.modalframe').animate(animationOptions, 'fast', function() {
    // Proceed only if the dialog still exists.
    if (self.isObject(self.iframe.$element) && self.isObject(self.iframe.$container)) {
      // Resize the iframe element and container.
      $('.modalframe').width(dialogSize.width).height(dialogSize.height);
      self.iframe.$container.width(frameSize.width).height(frameSize.height);
      self.iframe.$element.width(frameSize.width).height(frameSize.height);

      // Update the dialog size so that UI internals are aware of the change.
      self.iframe.$container.dialog('option', {width: dialogSize.width, height: dialogSize.height});
    }
  });
};

})(jQuery);
