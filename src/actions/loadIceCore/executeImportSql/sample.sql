-- select * from ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9;
-- select * from ice_core;
-- select * from data_point_type;
-- select * from series;
-- select * from sample;
-- select * from data_point;

-- delete from data_point;
-- delete from sample;
-- delete from series;
-- delete from data_point_type;

set search_path to ice_cores_staging, ice_cores, public;

delete from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9';

-- ice_core
insert into ice_core (
  name
)
select
  'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9'
where not exists (
  select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9'
);

-- add ice_core_id to staging table
DO $$
  BEGIN
    BEGIN
      alter table ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9
      add column ice_core_id integer;
    EXCEPTION
      WHEN duplicate_column THEN RAISE NOTICE 'column ice_core_id already exists in ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9.';
    END;
  END;
$$;

update ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9
set ice_core_id = (
  select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9'
);

-- data_point_types
insert into data_point_type (
  name
)
select
  'NO3_ppb'
where not exists (
  select id
  from data_point_type
  where name = 'NO3_ppb'
);

insert into data_point_type (
  name
)
select
  'NO3_uM'
where not exists (
  select id
  from data_point_type
  where name = 'NO3_uM'
);

-- series
insert into series (
  ice_core_id,
  data_point_type_id,
  name
)
select
  ( select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9' ),
  ( select id from data_point_type where name = 'NO3_ppb' ),
  ( select 'NO3_ppb' )
where not exists (
  select id
  from series
  where ice_core_id = ( select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9' )
  and data_point_type_id = ( select id from data_point_type where name = 'NO3_ppb' )
);

insert into series (
  ice_core_id,
  data_point_type_id,
  name
)
select
  ( select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9' ),
  ( select id from data_point_type where name = 'NO3_uM' ),
  ( select 'NO3_ppb' )
where not exists (
  select id
  from series
  where ice_core_id = ( select id from ice_core where name = 'ice_core_35d0b64b_879b_4540_a037_876eb7a74af9' )
  and data_point_type_id = ( select id from data_point_type where name = 'NO3_uM' )
);

-- sample
insert into sample (
  ice_core_id,
  top_depth,
  bottom_depth,
  top_age,
  bottom_age
)
select
  ice_core_id,
  top_depth :: float,
  bottom_depth :: float,
  top_age :: float,
  bottom_age :: float
from ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9;

insert into data_point (
  sample_id,
  series_id,
  data_point_type_id,
  value
)
select
  sa.id,
  se.id,
  dpt.id,
  ics.no_3_ppb :: float
from ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9 ics
join ice_core ic on ic.id = ics.ice_core_id
join sample sa on sa.ice_core_id = ic.id and sa.top_depth = ics.top_depth :: float
join series se on se.ice_core_id = ic.id
join data_point_type dpt on dpt.id = se.data_point_type_id
where dpt.name = 'NO3_ppb';

insert into data_point (
  sample_id,
  series_id,
  data_point_type_id,
  value
)
select
  sa.id,
  se.id,
  dpt.id,
  ics.no_3_u_m :: float
from ice_cores_staging.ice_core_35d0b64b_879b_4540_a037_876eb7a74af9 ics
join ice_core ic on ic.id = ics.ice_core_id
join sample sa on sa.ice_core_id = ic.id and sa.top_depth = ics.top_depth :: float
join series se on se.ice_core_id = ic.id
join data_point_type dpt on dpt.id = se.data_point_type_id
where dpt.name = 'NO3_uM';









