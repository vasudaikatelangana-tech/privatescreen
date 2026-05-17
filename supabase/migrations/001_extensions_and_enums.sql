-- migrations/001_extensions_and_enums.sql


CREATE EXTENSION IF NOT EXISTS "uuid-ossp"  SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto"   SCHEMA extensions;

-- Enums
CREATE TYPE slot_status AS ENUM ('available', 'booked', 'blocked', 'maintenance');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'failed');
CREATE TYPE screen_type AS ENUM ('mini', 'luxe', 'grand');
CREATE TYPE occasion_type AS ENUM ('birthday', 'anniversary', 'ott_movie', 'live_cricket', 'corporate', 'other');
CREATE TYPE addon_category AS ENUM ('cake', 'decoration', 'food', 'beverage', 'bundle');