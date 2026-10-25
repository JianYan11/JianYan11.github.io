This is the source code to Jon Barron's public academic website: https://jonbarron.info/. Feel free to clone this code for your own personal use.

## Blog language navigation

Every bilingual article loads `blog/navigation.css` after its article stylesheet.
Use one `.article-tools` row before the article, with the back-to-list link on the left
and a `.language-switch` navigation on the right. The order is always `中文`, then
`English`. Render the current language as a `span` with `lang` and
`aria-current="page"`; link the other language to the same article's translation
with matching `lang` and `hreflang`. Use `Read in English →` / `阅读中文版 →`
for the secondary link at the end of an article. Post lists use `.blog-links`
with `中文全文 →` and `English →`.
