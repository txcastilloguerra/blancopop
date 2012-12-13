Weekly Archive by Node Type
---------------------------------------------------------------------
week.module generates weekly archive pages and a block with links to the pages. You can specify the node types that will be included in the archive pages.

Links are generated only for those week that actually have posts. The text of the links is created using the token module.

The page is generated using the year and week number embedded in the URL.

NOTE: This module is NOT PostgreSQL-compatible, due to the use of MySQL's FROM_UNIXTIME() and YEARWEEK() functions.

Options:
Select node type that will be included in the overall archive pages

Select node types that will have their own block

Set number of links in block: If greater than zero, limits the number of links in
the block and adds a link to a page listing all available weekly links.

Sort links in chronological order: If checked the list of archive links will be
sorted from oldest to newest. Otherwise it will be sorted from newest to oldest

Sort archive page in chronological order: If checked the list of archive links
will be sorted from oldest to newest. Otherwise it will be sorted from newest to
oldest

Paginate archive page: If checked the output will be split into pages. The number
of posts will respect the global nodes per page setting.

Archive path: User defined root path to archives (/your_root/year/weekno). Node type archive can be either (/your_root/node_type/year/weekno) or (/node_type/your_root/year/weekno).

Archive page title and block link definitions