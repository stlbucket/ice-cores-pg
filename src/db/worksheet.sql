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

select * from ice_core_data_view;