create table place (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  latitude numeric(8, 5) null,
  longitude numeric(8, 5) null,
  constraint place_pkey primary key (id)
);

create table visit (
  id uuid not null default extensions.uuid_generate_v4 (),
  place uuid not null,
  date date null,
  days bigint not null default '0'::bigint,
  constraint visit_pkey primary key (id),
  constraint visit_place_fkey foreign KEY (place) references place (id)
);

create table flight (
  id uuid not null default extensions.uuid_generate_v4 (),
  "from" uuid not null,
  "to" uuid not null,
  date date null,
  flight_number text null,
  constraint flight_pkey primary key (id),
  constraint flight_from_fkey foreign KEY ("from") references place (id),
  constraint flight_to_fkey foreign KEY ("to") references place (id)
);

create table author (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  email text null,
  constraint author_pkey primary key (id)
);

create table style (
  name text not null,
  header text null,
  footer text null,
  classes text[] not null,
  constraint style_pkey primary key (name),
  constraint style_name_key unique (name)
);

create table document (
  id uuid not null default extensions.uuid_generate_v4 (),
  content text not null,
  path text null,
  type text not null,
  published timestamp with time zone null,
  title text not null,
  style text not null default 'default'::text,
  summary text null,
  constraint document_pkey primary key (id),
  constraint document_path_key unique (path),
  constraint document_style_fkey foreign KEY (style) references style (name)
);

create type media_type as enum ('image', 'video', 'audio');

create table media (
  id uuid not null default extensions.uuid_generate_v4 (),
  type media_type not null,
  resource text not null,
  preview text null,
  description text null,
  title text null,
  alt text null,
  constraint media_pkey primary key (id)
);

create table gallery (
  id uuid not null default extensions.uuid_generate_v4 (),
  content uuid[] not null,
  name text null,
  constraint gallery_pkey primary key (id),
  constraint gallery_name_key unique (name)
);

create table comment (
  id uuid not null default extensions.uuid_generate_v4 (),
  document uuid not null,
  author text not null,
  content text not null,
  published timestamp with time zone not null default now(),
  constraint comment_pkey primary key (id),
  constraint comment_document_fkey foreign KEY (document) references document (id)
);

create table document_author (
  document uuid not null,
  author uuid not null,
  constraint document_author_pkey primary key (document),
  constraint document_author_document_fkey foreign KEY (document) references document (id) on delete CASCADE,
  constraint document_author_author_fkey foreign KEY (author) references author (id) on delete CASCADE
);

create table document_place (
  place uuid not null,
  document uuid not null,
  constraint document_place_document_fkey foreign KEY (document) references document (id) on delete CASCADE,
  constraint document_place_place_fkey foreign KEY (place) references place (id) on delete CASCADE
);

create table document_thumbnail (
  document uuid not null,
  thumbnail uuid not null,
  constraint document_thumbnail_pkey primary key (document),
  constraint document_thumbnail_document_fkey foreign KEY (document) references document (id) on delete CASCADE,
  constraint document_thumbnail_thumbnail_fkey foreign KEY (thumbnail) references media (id) on delete CASCADE
);
