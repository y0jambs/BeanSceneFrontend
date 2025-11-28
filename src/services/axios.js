import axios from 'axios';
import {config} from '../util/config';

export default axios.create({
  baseURL: config.BASE_URL,
  responseType: 'json',
});
