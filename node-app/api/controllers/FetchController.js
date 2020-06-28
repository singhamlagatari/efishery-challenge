const User = require('../models/User');
const request = require('request');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
const underscore = require('underscore');
const moment = require('moment');

const FetchController = () => {
  // eslint-disable-next-line consistent-return
  const index = async (req, res) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
      };
      request(options, (error, response) => {
        if (error) throw new Error(error);

        const currencyOptions = {
          method: 'GET',
          url: 'https://free.currconv.com/api/v7/convert?q=IDR_USD&compact=ultra&apiKey=55d7ecc87dfa8fda26cd',
        };

        request(currencyOptions, (currencyError, currencyResponse) => {
          if (error) throw new Error(error);
          const currencyBocy = JSON.parse(currencyResponse.body);
          const bodyParsed = JSON.parse(response.body).map((item) => {
            item.price_usd = item.price * currencyBocy.IDR_USD;
            return item;
          });
          return res.status(200).json(bodyParsed);
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  // eslint-disable-next-line consistent-return
  const aggregate = async (req, res) => {
    try {
      const options = {
        method: 'GET',
        url: 'https://stein.efishery.com/v1/storages/5e1edf521073e315924ceab4/list',
      };
      request(options, (error, response) => {
        if (error) throw new Error(error);

        let bodyParsed = JSON.parse(response.body);
        // eslint-disable-next-line max-len
        bodyParsed = underscore.groupBy(bodyParsed, (iteratee) => moment(iteratee.timestamp).week());
        return res.status(200).json(bodyParsed);
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    index,
    aggregate,
  };
};

module.exports = FetchController;
