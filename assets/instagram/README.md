# Instagram Feed tab images

Place up to 6 images here for the **Feed** tab in the Photos section (Headshots & stills | Feed):

- `instagram-1.jpg` through `instagram-6.jpg`

Use square (1:1) images for best results (e.g. 1080×1080). Each tile links to your Instagram profile. If files are missing, the tiles show as placeholder boxes.

**Why not the Instagram API?**  
Using Instagram’s API would require a backend (or serverless) to store tokens, a Meta/Facebook app, and app review—not ideal for a simple static site. This static grid is simple and reliable; you can update the images in `assets/instagram/` whenever you want to refresh the feed.

**Optional: live feed widget**  
For an automatic live feed, you can use a third-party widget (e.g. [Elfsight](https://elfsight.com/instagram-feed-widget/), [SnapWidget](https://snapwidget.com/)). Paste the widget’s embed code into the Feed tab panel in `index.html` or `acting.html` (inside `#photos-panel-feed`, e.g. before or instead of the `.instagram-grid` div).
