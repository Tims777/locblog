INSERT INTO "author" ("name") VALUES ('Admin');

INSERT INTO "style" ("name", "header", "footer", "classes")
VALUES
    ('default', E'::::div{.grid .place-items-center}\n:::div{.row-start-1 .col-start-1 .children:m-0 .w-2/3 .mx-auto}\n[:globe](/map)\n:::\n:::div{.row-start-1 .col-start-1 .children:m-0 .p-2 .pb-3 .bg-white .bg-opacity-50 .rounded-xl}\n# [LocBlog](/)\n:::\n::::', null, ARRAY['prose','prose-lg','max-w-2xl','mx-auto','p-2']),
    ('fullscreen', null, null, ARRAY['w-screen','h-screen','children:(w-full,h-full)']);

INSERT INTO "document" ("path", "type", "title", "content", "style")
VALUES
    ('', 'page', 'Home', '::documents{type=post}', 'default'),
    ('map', 'page', 'Map', '::map', 'fullscreen');

INSERT INTO "place" ("name", "latitude", "longitude")
VALUES
    ('Paris', 48.857, 2.352),
    ('Montreal', 45.509, -73.554),
    ('Toronto', 43.653, -79.382),
    ('Chicago', 41.882, -87.628),
    ('Minneapolis', 44.982, -93.269),
    ('Winnipeg', 49.896, -97.139),
    ('Regina', 50.455, -104.607),
    ('Calgary', 51.050, -114.070),
    ('Vancouver', 49.261, -123.114),
    ('Portland', 45.520, -122.682),
    ('San Francisco', 37.777, -122.416),
    ('Auckland', -36.849, 174.765),
    ('Wellington', -41.289, 174.777),
    ('Queenstown',-45.031, 168.663),
    ('Sydney', -33.868, 151.2100),
    ('Brisbane', -27.467, 153.028),
    ('Cairns', -16.920, 145.780),
    ('Darwin', -12.438, 130.841),
    ('Singapore', 1.283, 103.833),
    ('Kuala Lumpur', 3.148, 101.695),
    ('Frankfurt', 50.111, 8.682);

INSERT INTO "visit" ("place") SELECT p.id FROM (SELECT "id" FROM "place") AS p;

INSERT INTO "flight" ("from", "to")
SELECT f.id, t.id
FROM (
    VALUES
        ('Paris', 'Montreal'),
        ('San Francisco', 'Auckland'),
        ('Auckland', 'Sydney'),
        ('Darwin', 'Singapore'),
        ('Singapore', 'Frankfurt')
) AS "route"("from", "to")
JOIN place f ON f.name = route.from
JOIN place t ON t.name = route.to;
