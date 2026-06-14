create view public.document_aggregate
as
select
  document.id,
  document.type,
  document.title,
  document.content,
  document.summary,
  document.path,
  document.published,
  row_to_json(a.*) as author,
  row_to_json(t.*) as thumbnail,
  row_to_json(s.*) as style,
  (
    select
      json_agg(row_to_json(p.*)) as json_agg
    from
      document_place dp
      left join place p on dp.place = p.id
    where
      dp.document = document.id
  ) as places
from
  document
  left join document_author da on document.id = da.document
  left join author a on da.author = a.id
  left join document_thumbnail dt on document.id = dt.document
  left join media t on dt.thumbnail = t.id
  left join style s on document.style = s.name
group by
  document.id,
  a.id,
  t.id,
  s.name;

create view public.flight_aggregate
as
select
  flight.id,
  flight.date,
  flight.flight_number,
  row_to_json(f.*) as "from",
  row_to_json(t.*) as "to"
from
  flight
  left join place f on flight."from" = f.id
  left join place t on flight."to" = t.id
where
  flight.date < now();

create view public.gallery_aggregate
as
select
  gallery.id,
  gallery.name,
  array_agg(row_to_json(media.*)) as content
from
  gallery
  left join media on media.id = any (gallery.content)
group by
  gallery.id;

create view public.place_aggregate
as
select
  place.id,
  place.name,
  place.latitude,
  place.longitude,
  (
    select
      d.path
    from
      document_place dp
      left join document d on d.id = dp.document
    where
      place.id = dp.place
    order by
      d.published desc
    limit
      1
  ) as resource,
  max(v.date) as last_visit,
  array_agg(
    row_to_json(v.*)
    order by
      v.date
  ) as visits
from
  place
  left join visit v on place.id = v.place
where
  v.id is not null
group by
  place.id;
