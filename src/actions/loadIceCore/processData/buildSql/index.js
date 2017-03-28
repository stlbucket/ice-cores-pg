const Promise = require('bluebird');
const clog = require('fbkt-clog');
const _ = require('lodash');

function buildSql(iceCoreInfo, stagingTable){
  // clog('PROCESS IT', {
  //   iceCoreInfo: iceCoreInfo,
  //   stagingTable: stagingTable
  // });

  const sql = `
set search_path to ice_cores_staging, ice_cores, public;

delete from ice_core where name = '${iceCoreInfo.name}';

-- ice_core -----------------------------------------------------------------------------------------
insert into ice_core (
  name
)
select
  '${iceCoreInfo.name}'
where not exists (
  select id from ice_core where name = '${iceCoreInfo.name}'
);
-- end ice_core -------------------------------------------------------------------------------------



-- add ice_core_id to staging table -----------------------------------------------------------------
DO $$
  BEGIN
    BEGIN
      alter table ${stagingTable}
      add column ice_core_id integer;
    EXCEPTION
      WHEN duplicate_column THEN RAISE NOTICE 'column ice_core_id already exists in ${stagingTable}.';
    END;
  END;
$$;

update ${stagingTable}
set ice_core_id = (
  select id from ice_core where name = '${iceCoreInfo.name}'
);
-- end add ice_core_id to staging table -------------------------------------------------------------



-- data_point_types ---------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
  (acc, dataPointType) => {
    return acc.concat(`
insert into data_point_type (
  name
)
select
  '${dataPointType}'
where not exists (
  select id
  from data_point_type
  where name = '${dataPointType}'
);
`)
  },
  '')
}
-- end data_point_types -----------------------------------------------------------------------------



-- series -------------------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
    (acc, dataPointType) => {
      return acc.concat(`
insert into series (
  ice_core_id,
  data_point_type_id,
  name
)
select
  ( select id from ice_core where name = '${iceCoreInfo.name}' ),
  ( select id from data_point_type where name = '${dataPointType}' ),
  ( select '${dataPointType}' )
where not exists (
  select id
  from series
  where ice_core_id = ( select id from ice_core where name = '${iceCoreInfo.name}' )
  and data_point_type_id = ( select id from data_point_type where name = '${dataPointType}' )
);
`)
    },
    '')
}
-- end series ---------------------------------------------------------------------------------------



-- sample -------------------------------------------------------------------------------------------

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
from ${stagingTable};

-- end sample ---------------------------------------------------------------------------------------



-- data point ---------------------------------------------------------------------------------------
${iceCoreInfo.dataPointTypes.reduce(
    (acc, dataPointType) => {
      return acc.concat(`
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
  ics.${_.snakeCase(dataPointType)} :: float
from ${stagingTable} ics
join ice_core ic on ic.id = ics.ice_core_id
join sample sa on sa.ice_core_id = ic.id and sa.top_depth = ics.top_depth :: float
join series se on se.ice_core_id = ic.id
join data_point_type dpt on dpt.id = se.data_point_type_id
where dpt.name = '${dataPointType}';
`)
    },
    '')
    }
-- end data point -----------------------------------------------------------------------------------

`;

  // clog('THE SQL', sql);
  return Promise.resolve(sql);
}

module.exports = buildSql;