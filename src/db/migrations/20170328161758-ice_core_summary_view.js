'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.sequelize.query(up_script);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.sequelize.query(down_script);
  }
};


const up_script = `
SET search_path TO ice_cores, public;

DROP VIEW IF EXISTS ice_core_summary_view;

CREATE VIEW ice_core_summary_view AS (
  SELECT
    ic.id,
    ic.name,
    ( select count(*) from sample where ice_core_id = ic.id ) as sample_count,
    ( select json_agg(series_name) 
      from ( 
        select 
          name,
          ( select count(*) from data_point dp where dp.series_id = se.id ) as data_point_count
        from series se
        where ice_core_id = ic.id 
      ) as series_name 
    ) as available_series
    from ice_core ic
);

SET search_path to public;
`;

const down_script = `
SET search_path TO ice_cores, public;

DROP VIEW IF EXISTS ice_core_summary_view;

SET search_path to public;
`;