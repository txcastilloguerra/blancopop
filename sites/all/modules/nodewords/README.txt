; $Id: README.txt,v 1.27.2.12 2009/10/27 08:17:44 kiam Exp $

This module allows you to set some meta tags for each node.

Giving more attention to the important keywords and/or description on some of
your nodes allows you to get better search engine positioning (given that you
really only provide the keywords which exist in the node body itself, and do
not try to lie).

This version of the module only works with Drupal 6.x.

Features
------------------------------------------------------------------------------
Some features include:

* The current supported meta tags are ABSTRACT, CANONICAL, COPYRIGHT,
  GEO.POSITION, DESCRIPTION, ICBM, KEYWORDS, PICS-LABEL, REVISIT-AFTER, ROBOTS
  and the site verification meta tags used by Google Webmaster Tools,
  Microsoft Bing Webmaster Center, Yahoo! Site Explorer.

* You can tell "nodewords" to add all terms of some specified vocabularies
  to the KEYWORDS meta tag.

* You can specify a default meta tag ROBOTS value to use for all pages. You can
  override it on each page.

* On taxonomy pages, the term description is used as the DESCRIPTION
  tag. The term itself is added to the list of KEYWORDS. You can override
  the description to use if you wish.

* You can seperately specify the meta tags to show on some specific pages of
  your site (in example, the front page, the error 403 page, the error 404
  page, the tracker page), or to use in specific situations (in example, when
  the site is offline).

* The support for Views, and Panels has been removed from Nodewords
  6.x-1.x on August 15, 2009; successive versions for Drupal 6 replaced it with
  a more generic support for third-party module pages.

* You can select which of these tags you want to output on each page. You
  can also remove the edit box for these tags from the node edit page if
  you don't like using it.

* All text of the DESCRIPTION and KEYWORDS meta tags are added to the search
  system so they are searable too; other meta tags could be added to the search
  system too (depending on the code implemented from the module).

Installing Nodewords (aka Meta tags) (first time installation)
------------------------------------------------------------------------------
1. Backup your database.

2. Copy the complete 'nodewords/' directory into the 'modules/' directory of
   your Drupal site.

3. Enable the "Nodewords" module from the module administration page
   (Administer >> Site configuration >> Modules).

4. Configure the module (see "Configuration" below).

Configuration
------------------------------------------------------------------------------
1. On the access control administration page ("Administer >> User management
   >> Access control") you need to assign:

   + the "administer nodewords" permission to the roles that are allowed to
     administer the meta tags (such as setting the default values and/or
     enabling the possibility to edit them),

   + the "edit XYZ tag" permission to the roles that are allowed to set and
     edit meta tags for the content (there is a permission for each of the
     meta tags currently defined).

   All users will be able to see the assigned meta tags.

2. On the settings page ("Administer >> Content management >>
   Nodewords") you can specify the default settings for the module.
   Users need the "administer nodewords" permission to do this.

3. The front page is an important page for each website. Therefor you can
   specifically set the meta tags to use on the front page meta tags
   settings page ("Administer >> Content management >> Nodewords >>
   Front page").
   Users need the "administer nodewords" permission to do this.

   Alternatively, you can opt not to set the meta tags for the front page
   on this page, but to use the meta tags of the view, panel or node the
   front page points to. To do this, you need to uncheck the "Use front
   page meta tags" option on the settings page.

   Note that, in contrast to previous versions of this module, the site
   mission and/or site slogan are no longer used as DESCRIPTION or ABSTRACT
   on the front page!

4. You can completely disable the possibility to edit meta tags for each
   individual content type by editing the content type workflow options
   ("Administer >> Content management >> Content types").

   Note that this will still output the default values for the meta tags.

How to define meta tags in third-party modules
------------------------------------------------------------------------------
Modules that need to intregrate with Nodewords to define new meta tags need to
define two hooks: hook_nodewords_tags_info(), and hook_nodewords_api().

function hook_nodewords_tags_info() {
  $tags = array(
    'dc.title' => array(
      'tag:context:denied' => array('default'),
      'tag:db:type' => 'string',
      'tag:function:prefix' => 'test_metatags_dc_title',
      'tag:template' => array('dc.title' => NODEWORDS_META),
      'widget:label' => t('Dublin Core title'),
      'widget:permission' => 'edit meta tag Dublin Core TITLE',
    ),
    'location' => array(
      'tag:context:allowed' => array('node', 'user'),
      'tag:db:type' => 'array',
      'tag:function:prefix' => 'test_metatags_location',
      'tag:template' => array(
      'geo.position' => NODEWORDS_META,
      'icbm' => NODEWORDS_META,
    ),
    'widget:label' => t('Location'),
      'widget:permission' => 'edit location meta tag',
    ),
  );

  return $tags;
}

The returned array should contain the following values:

  * tag:context:allowed, tag:context:denied - this indexes define in which
    contexts the meta tags are allowed (and denied).

  * tag:db:type - if the value of this index is not equal to string, the value
    of the meta tag is passed to serialize before to be saved in the database
    table used by Nodewords.

  * tag:function:prefix - the prefix used when Nodewords looks for some
    functions it uses; the actual implementation uses the following functions
    (<suffix> stays for the value of this array index):

      * <suffix>_form(&$form, $content, $options) - the function is used to
        populate the form used to edit the meta tags.

      * <suffix>_prepare(&$tags, $content, $options) - the function is used to
        populate the array of meta tags before they are output in the page
        template.

      * <suffix>_settings_form(&$form, $form_id, $options) - the function is
        used to populate a settings form; actually, the function is used to
        populate the Nodewords settings page ($form_id == 'settings_form'),
        or the content type settings page ($form_id == 'node_type_form').

  * tag:function:parameters - an array passed to the functions used by
    Nodewords as $options['parameters'] ($options is the last parameter
    passed to the functions.

  * tag:template - the string used as template when the meta tag is added to
    the HTML tag HEAD; the value can be a constant as defined by the module, or
    a string.

  * tag:weight - the weight used to order the meta tags before to output them
    in HTML; the lighter meta tag will be output first.

  * widget:label - the label used as title in the fieldset for the form field
    shown in the form to edit the meta tags values.

  * widget:permission - the permission associated with the form fields used to
    edit the meta tags values; this permission is used only when the meta tag
    edit form fields are shown in a form that is accessible not only from the
    administrators users (in example, in the node edit form, or in the user
    profile form).

function hook_nodewords_api() {
  return array('version' => 1.1);
}

The function returns an array that contains the following indexes:

  * version - the API version used by the module; basing on this value
    Nodewords will take the necessary steps to assure to keep the module
    compatible with Nodewords (Nodewords actually uses the meta tags
    implemented by a module that supports version 1.1 of Nodewords API).

To better understand how to write the code for custom meta tags, see
basic_metatags.module, extra_metatags.module, and
site_verification.module.

Using Nodewords and Tagadelic
------------------------------------------------------------------------------
The Tagadelic module (http://drupal.org/project/tagadelic) allows one to
create a cloud of all terms used. The keywords you assign to nodes with
the Nodewords module will not appear in these clouds.

If you want to use tagclouds and have the same terms in the KEYWORDS meta
tag, you can configure nodewords as follows:

1. Create a "Free tagging" vocabulary at "Administer >> Content management
   >> Categories". For example, call this vocabulary "Keywords".

2. On the meta tags settings page ("Administer >> Content management >>
   Nodewords"), select the "Keywords" vocabulary as one of the "Auto-keywords
   vocabularies". This will make sure that all terms you assign to nodes
   will appear in the KEYWORDS meta tag.

3. On the same page, deselect the checkbox "Keywords" in the "Tags to
   show on edit form" fieldset. This will remove the meta tag KEYWORDS
   input box on all node edit forms. The only way to assign KEYWORDS then
   is to enter them in the vocabulary "Keywords" input box (which will
   appear in the "Categories" box instead of the "Meta tags" one).

The result is that the meta tag KEYWORDS will only contain the keywords
assigned to nodes by entering them in the free-tagging input box of the
"Keywords" vocabulary. Nodewords will add them to the KEYWORDS meta tag
and you can use a tagcloud to show all keywords too.

Auto-generated meta DESCRIPTION for CCK content types
------------------------------------------------------------------------------
It is recommended to use the contemplate (Content Template) module to
create a nicer looking node teaser that can also be used as auto-generated
DESCRIPTION.

------------------------------------------------------------------------------
Required:

A valid backup of your Drupal site having Nodewords 1.0 installed. If you don't
have a backup, there is now way to recover.
Step by step instruction:

1.  Disable all Nodewords modules (Basic meta tags, Extra meta tags, Site
    verification and Nodewords) with version 1.1 or 1.2 or other DEV versions up
    to <1.3 at admin/build/modules.
2.  Uninstall the modules Basic meta tags, Extra meta tags, Site verification
    and Nodewords at admin/build/modules/uninstall.
3.  Remove the nodewords folder from your installation. Typically it can be
    found in the folder sites/all/modules.
4.  Execute "DELETE FROM variable WHERE name IN ('nodewords-repeat',
    'nodewords-use_front', 'nodewords_page', 'nodewords_story');"
    on your database. You need to see that 4 rows have been affected (deleted).
    If you use a table prefix, prepend the variable with your table prefix.
    You can execute this query via MySQL Query Browser or myPHPAdmin, whatever
    your preferred tool for DB administration is.
5.  Install Nodewords 1.0 to your modules folder e.g. sites/all/modules.
6.  Enable Meta tags 1.0 module (this is Nodewords).
7.  Restore the table nodewords from your backup and replace/overwrite the
    existing table. You can use MySQL Administrator for this task and go to
    "Restore > Restore content" by selecting the nodewords table only.
8.  If you haven't changed any settings in your Drupal installation that are
    saved in "variable" table you can restore "variable" table the same way.
    Otherwise you need to extract the 3 settings from your SQL backup file by
    searching for 'nodewords', 'nodewords-repeat' and 'nodewords-use_front'.
    Replace below with your settings and execute the query on your DB server.
    Example:
    INSERT INTO `variable` (`name`,`value`) VALUES
    ('nodewords','your settings array is here...'),
    ('nodewords-repeat','i:0;'),
    ('nodewords-use_front','i:1;');
9.  Clear all caches in admin/settings/performance.
10. Finished. Now you are able to review your previous meta tag settings.
11. Wait until Nodewords 1.3 final has been released.

Bugs and shortcomings
------------------------------------------------------------------------------
* See the list of issues at http://drupal.org/project/issues/nodewords.

Credits / Contact
------------------------------------------------------------------------------
The original author of this module is Andras Barthazi. Mike Carter
(mike[at]buddasworld.co.uk) and Gabor Hojtsy (gobap[at]hp.net)
provided some feature enhancements.
Robrecht Jacques (robrecht.jacques[at]advalvas.be) is the current maintainer;
Alberto Paderno (k.iam[at]avpnet.org) is the current co-maintainer.

Best way to contact the authors is to submit a (support/feature/bug) issue at
the projects issue page at http://drupal.org/project/issues/nodewords.
