'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    console.log(up_script);
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

DROP VIEW IF EXISTS ice_core_data_view;

CREATE VIEW ice_core_data_view AS (
  SELECT
    ic.id,
    ic.name,
    sa.top_depth,
    sa.bottom_depth,
    sa.top_age,
    sa.bottom_age,
    dp.value,
    dpt.name as data_point_type
    from ice_core ic
    join sample sa on sa.ice_core_id = ic.id
    join data_point dp on dp.sample_id = sa.id
    join data_point_type dpt on dpt.id = dp.data_point_type_id
    order by sa.top_depth
);

SET search_path to public;
`;


const down_script = `
SET search_path TO ice_cores, public;

DROP VIEW IF EXISTS ice_core_data_view;

SET search_path to public;
`;