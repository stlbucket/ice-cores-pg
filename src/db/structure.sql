--||--
drop schema if exists ice_cores cascade;
--||--
CREATE SCHEMA ice_cores;
--||--
SET search_path TO ice_cores, public;
--||--
CREATE TABLE ice_core (
	id 							integer  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name text NOT NULL,
	CONSTRAINT 		pk_ice_core PRIMARY KEY ( id )
 );
--||--
CREATE TABLE series (
	id 							integer  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name float NOT NULL,
  ice_core_id integer NOT NULL,
  data_point_type_id integer NOT NULL,
	CONSTRAINT 		pk_series PRIMARY KEY ( id )
 );
--||--
CREATE TABLE sample (
	id 							integer  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  ice_core_id integer NOT NULL,
  top_depth float,
  top_age float,
  bottom_depth float,
  bottom_age float,
	CONSTRAINT 		pk_sample PRIMARY KEY ( id )
 );
--||--
CREATE TABLE data_point_type (
	id 							integer  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  name text NOT NULL,
	CONSTRAINT 		pk_data_point_type PRIMARY KEY ( id )
 );
--||--
CREATE TABLE data_point (
	id 							integer  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  updated_at timestamp with time zone NOT NULL DEFAULT current_timestamp,
  value float NOT NULL,
  sample_id integer NOT NULL,
  data_point_type_id integer NOT NULL,
  series_id integer NOT NULL,
	CONSTRAINT 		pk_data_point PRIMARY KEY ( id )
 );
--||--
ALTER TABLE series
ADD CONSTRAINT fk_series_ice_core
FOREIGN KEY ( ice_core_id )
REFERENCES ice_core( id );
--||--
ALTER TABLE series
ADD CONSTRAINT fk_series_data_point_type
FOREIGN KEY ( data_point_type_id )
REFERENCES data_point_type( id );
--||--
ALTER TABLE sample
ADD CONSTRAINT fk_sample_ice_core
FOREIGN KEY ( ice_core_id )
REFERENCES ice_core( id );
--||--
ALTER TABLE data_point
ADD CONSTRAINT fk_data_point_data_point_type
FOREIGN KEY ( data_point_type_id )
REFERENCES data_point_type( id );
--||--
ALTER TABLE data_point
ADD CONSTRAINT fk_data_point_series
FOREIGN KEY ( series_id )
REFERENCES series( id );
--||--
ALTER TABLE data_point
ADD CONSTRAINT fk_data_point_sample
FOREIGN KEY ( sample_id )
REFERENCES sample( id );
--||--
SELECT 'SUCCESSFULLY CREATED ice_cores SCHEMA' AS message;