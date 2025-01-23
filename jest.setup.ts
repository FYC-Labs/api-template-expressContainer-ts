import dotenv from 'dotenv';
import 'reflect-metadata';

const globalSetup = async () => {
  dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  });
};

module.exports = globalSetup;
